import { Component, Inject, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { PageEvent } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { ObjectRef } from "src/app/service/common.service";
import { GroupService } from "../../service/group.service";
import {
  Lesson,
  LessonService,
  LessonTime,
} from "../../service/lesson.service";
import { SubjectService } from "../../service/subject.service";
import { Person, PersonService } from "../../service/user.service";
import { RemoveDialogComponent } from "../remove-dialog/remove-dialog.component";

@Component({
  selector: "app-lesson-edit",
  templateUrl: "./lesson-edit.component.html",
  styleUrls: ["./lesson-edit.component.css"],
})
export class LessonEditComponent implements OnInit {
  dateForListFormControl = new FormControl(new Date().toISOString());

  displayedColumns: string[] = [
    "position",
    "date",
    "time",
    "subject",
    "subjectType",
    "professor",
    "group",
    "edit",
    "remove",
  ];
  dataSource;
  length = 0;
  pageSize = 10;
  currentPage = 0;

  times: LessonTime[] = [];
  subjects: ObjectRef[] = [];
  subjectTypes: string[] = [];
  profs: Person[] = [];
  groups: ObjectRef[] = [];

  lessons: Lesson[] = [];
  selected: Lesson;
  isUpdate: boolean = false;

  constructor(
    private personService: PersonService,
    private lessonService: LessonService,
    private subjectService: SubjectService,
    private groupService: GroupService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.lessonService
      .getLessonTimes()
      .subscribe((data) => (this.times = data));
    this.personService.getProfs().subscribe((data) => (this.profs = data));
    this.groupService.getAll().subscribe((data) => (this.groups = data));
    this.subjectService.getAll().subscribe((data) => (this.subjects = data));
    this.subjectService
      .getTypes()
      .subscribe((data) => (this.subjectTypes = data));
    this.updateList();
  }

  clear() {
    this.selected = null;
    this.isUpdate = false;
  }

  create() {
    const dialogRef = this.dialog.open(LessonEditorDialog, {
      data: {
        isUpdate: false,
        times: this.times,
        subjects: this.subjects,
        subjectTypes: this.subjectTypes,
        profs: this.profs,
        groups: this.groups,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.updateList();
        this.clear();
      }
    });
  }

  selectDate() {
    this.updateList();
  }

  updateList(event?: PageEvent) {
    if (event) {
      if (this.pageSize !== event.pageSize) {
        this.pageSize = event.pageSize;
        this.currentPage = 0;
      } else {
        this.currentPage = event.pageIndex;
      }
    }
    const date: Date = new Date(this.dateForListFormControl.value);
    date.setMinutes(-date.getTimezoneOffset());

    this.lessonService
      .getLessonsPageForDate(
        date.toISOString().substring(0, 10),
        this.currentPage,
        this.pageSize
      )
      .subscribe(
        (data) => {
          this.lessons = data.content || [];
          console.log(data);
          this.length = data.totalElements;
        },
        (error) => console.log(error),
        () => {
          let newList = [];
          let i = this.currentPage * this.pageSize + 1;
          this.lessons.forEach((s) => {
            newList.push({
              position: i++,
              id: s.id,
              date: s.date,
              subject: s.subject.qualifier,
              subjectType: s.subjectType,
              time: `${s.time.startTime} - ${s.time.finishTime} (${s.time.shift})`,
              professor: s.professor.qualifier,
              group: s.group.qualifier,
            });
          });
          this.dataSource = new MatTableDataSource(newList);
        }
      );
  }

  onSelectExisting(id: number) {
    this.selected = this.lessons.find((s) => s.id === id);
    this.isUpdate = true;
    this.update();
  }

  update() {
    const dialogRef = this.dialog.open(LessonEditorDialog, {
      data: {
        isUpdate: true,
        active: this.selected,
        times: this.times,
        subjects: this.subjects,
        subjectTypes: this.subjectTypes,
        profs: this.profs,
        groups: this.groups,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.updateList();
        this.clear();
      }
    });
  }

  remove(id: number, name: string) {
    const dialogRef = this.dialog.open(RemoveDialogComponent, {
      data: {
        name: name,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.personService
          .deletePerson(id)
          .subscribe((data) => this.updateList());
        this.clear();
      }
    });
  }
}

@Component({
  templateUrl: "./lesson-editor-dialog.html",
})
export class LessonEditorDialog implements OnInit {
  public isUpdate: boolean = false;

  active: Person;

  fgc = new FormGroup({
    date: new FormControl(new Date().toISOString(), Validators.required),
    time: new FormControl({}, [Validators.required]),
    subject: new FormControl("", [Validators.required]),
    subjectType: new FormControl("", [Validators.required]),
    prof: new FormControl("", [Validators.required]),
    group: new FormControl("", [Validators.required]),
    inWeek: new FormControl(1),
    count: new FormControl(1),
  });

  constructor(
    private lessonService: LessonService,
    public dialogRef: MatDialogRef<LessonEditorDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data.isUpdate) {
      this.active = data.active;
      this.fgc.value.date.setValue(data.avtive.date);
      this.fgc.value.time.setValue(data.active.time.id);
      this.fgc.value.subject.setValue(data.active.subject.id);
      this.fgc.value.subjectType.setValue(data.active.subjectType);
      this.fgc.value.prof.setValue(data.active.professor.id);
      this.fgc.value.group.setValue(data.active.group.id);
      this.fgc.value.inWeek.setValue(1);
      this.fgc.value.count.setValue(1);
    }
    this.isUpdate = data.isUpdate;
  }
  ngOnInit(): void {}

  create() {
    const date: Date = new Date(this.fgc.value.date);
    console.log(date);
    date.setMinutes(-date.getTimezoneOffset());

    let toCreate: Lesson = {
      id: null,
      date: date.toISOString().substring(0, 10),
      time: this.data.times.find((t) => t.id === this.fgc.value.time),
      subject: { id: this.fgc.value.subject, qualifier: null },
      subjectType: this.fgc.value.subjectType,
      professor: { id: this.fgc.value.prof, qualifier: null },
      group: { id: this.fgc.value.group, qualifier: null },
    };
    if (this.fgc.value.inWeek !== 1 || this.fgc.value.count !== 1) {
      this.lessonService
        .createSeries(toCreate, this.fgc.value.inWeek, this.fgc.value.count)
        .subscribe((_) => this.close(true));
    } else {
      this.lessonService.create(toCreate).subscribe((_) => this.close(true));
    }
  }

  update() {
    const date: Date = new Date(this.fgc.value.date);
    date.setMinutes(-date.getTimezoneOffset());

    let toUpdate: Lesson = {
      id: null,
      date: date.toISOString().substring(0, 10),
      time: this.data.times.find((t) => t.id === this.fgc.value.time),
      subject: { id: this.fgc.value.subject, qualifier: null },
      subjectType: this.fgc.value.subjectType,
      professor: { id: this.fgc.value.prof, qualifier: null },
      group: { id: this.fgc.value.group, qualifier: null },
    };
    this.lessonService
      .update(this.active.id, toUpdate)
      .subscribe((_) => this.close(true));
  }

  close(result: boolean): void {
    this.dialogRef.close(result);
  }
}
