import { Component, Inject, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { PageEvent } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import {
  getDate,
  getDateFromStr,
  ObjectRef,
} from "src/app/service/common.service";
import { GroupService, Volume } from "../../service/group.service";
import {
  DAYS_OF_WEEK,
  Lesson,
  LessonSeries,
  LessonService,
  LessonTime,
} from "../../service/lesson.service";
import { SubjectService } from "../../service/subject.service";
import { Person, PersonService } from "../../service/account.service";
import { RemoveDialogComponent } from "../remove-dialog/remove-dialog.component";
import { ProfessorService } from "src/app/service/professor.service";

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
  volumes: Volume[] = [];

  lessons: Lesson[] = [];
  selected: Lesson;
  isUpdate: boolean = false;

  constructor(
    private profService: ProfessorService,
    private lessonService: LessonService,
    private subjectService: SubjectService,
    private groupService: GroupService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.lessonService
      .getLessonTimes()
      .subscribe((data) => (this.times = data));
    this.profService.getProfs().subscribe((data) => (this.profs = data));
    this.groupService.getAll().subscribe((data) => (this.groups = data));
    this.subjectService.getAll().subscribe((data) => (this.subjects = data));
    this.subjectService
      .getTypes()
      .subscribe((data) => (this.subjectTypes = data));
    this.groupService
      .getGroupVolumes()
      .subscribe((data) => (this.volumes = data));
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
        volumes: this.volumes,
        days: DAYS_OF_WEEK,
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
              volume: s.groupVolume,
            });
          });
          this.dataSource = new MatTableDataSource(newList);
        }
      );
  }

  // update(id: number) {
  //   this.selected = this.lessons.find((s) => s.id === id);
  //   this.isUpdate = true;
  //   const dialogRef = this.dialog.open(LessonEditorDialog, {
  //     data: {
  //       isUpdate: true,
  //       active: this.selected,
  //       times: this.times,
  //       subjects: this.subjects,
  //       subjectTypes: this.subjectTypes,
  //       profs: this.profs,
  //       groups: this.groups,
  //       volumes: this.volumes,
  //       days: DAYS_OF_WEEK,
  //     },
  //   });
  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result) {
  //       this.updateList();
  //       this.clear();
  //     }
  //   });
  // }

  delete(id: number) {
    this.selected = this.lessons.find((s) => s.id === id);
    const dialogRef = this.dialog.open(LessonEditorDialog, {
      data: {
        isDelete: true,
        active: this.selected,
        times: this.times,
        subjects: this.subjects,
        subjectTypes: this.subjectTypes,
        profs: this.profs,
        groups: this.groups,
        volumes: this.volumes,
        days: DAYS_OF_WEEK,
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
        this.profService.delete(id).subscribe((data) => this.updateList());
        this.clear();
      }
    });
  }
}

@Component({
  templateUrl: "./lesson-editor-dialog.html",
  styleUrls: ["./lesson-edit.component.css"],
})
export class LessonEditorDialog implements OnInit {
  active: Lesson;
  days: number[] = [];

  fgc = new FormGroup({
    start: new FormControl(new Date().toISOString(), Validators.required),
    finish: new FormControl(new Date().toISOString(), Validators.required),
    time: new FormControl({}, [Validators.required]),
    subject: new FormControl("", [Validators.required]),
    subjectType: new FormControl("", [Validators.required]),
    prof: new FormControl("", [Validators.required]),
    group: new FormControl("", [Validators.required]),
    volume: new FormControl(Volume.FULL, [Validators.required]),
  });

  constructor(
    private lessonService: LessonService,
    public dialogRef: MatDialogRef<LessonEditorDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data.isDelete) {
      this.active = data.active;
      this.fgc.controls.time.setValue(data.active.time.id);
      this.fgc.controls.subject.setValue(data.active.subject.id);
      this.fgc.controls.subjectType.setValue(data.active.subjectType);
      this.fgc.controls.prof.setValue(data.active.professor.id);
      this.fgc.controls.group.setValue(data.active.group.id);
      this.fgc.controls.volume.setValue(data.active.groupVolume);
      this.fgc.controls.start.setValue(
        new Date(data.active.date).toISOString()
      );
      this.fgc.controls.finish.setValue(
        new Date(data.active.date).toISOString()
      );
      this.changeDays(new Date(data.active.date).getDay());
    }
  }
  ngOnInit(): void {}

  changeDays(day: number) {
    const size = this.days.length;
    this.days = this.days.filter((d) => d !== day);
    if (size === this.days.length) this.days.push(day);
  }

  isChecked(day: number): boolean {
    return this.days.find((d) => d === day) !== undefined;
  }

  create() {
    let toCreate: LessonSeries = {
      id: null,
      date: null,
      time: this.data.times.find((t) => t.id === this.fgc.value.time),
      subject: { id: this.fgc.value.subject, qualifier: null },
      subjectType: this.fgc.value.subjectType,
      professor: { id: this.fgc.value.prof, qualifier: null },
      group: { id: this.fgc.value.group, qualifier: null },
      groupVolume: this.fgc.value.volume,
      start: getDateFromStr(this.fgc.value.start),
      finish: getDateFromStr(this.fgc.value.finish),
      days: this.days,
    };
    this.lessonService
      .createSeries(toCreate)
      .subscribe((_) => this.close(true));
  }

  update() {
    let toUpdate: LessonSeries = {
      id: null,
      date: null,
      time: this.data.times.find((t) => t.id === this.fgc.value.time),
      subject: { id: this.fgc.value.subject, qualifier: null },
      subjectType: this.fgc.value.subjectType,
      professor: { id: this.fgc.value.prof, qualifier: null },
      group: { id: this.fgc.value.group, qualifier: null },
      groupVolume: this.fgc.value.volume,
      start: getDateFromStr(this.fgc.value.start),
      finish: getDateFromStr(this.fgc.value.finish),
      days: this.days,
    };
    this.lessonService
      .update(this.active.id, toUpdate)
      .subscribe((_) => this.close(true));
  }

  delete() {
    let toDelete: LessonSeries = {
      id: null,
      date: null,
      time: this.data.times.find((t) => t.id === this.fgc.value.time),
      subject: { id: this.fgc.value.subject, qualifier: null },
      subjectType: this.fgc.value.subjectType,
      professor: { id: this.fgc.value.prof, qualifier: null },
      group: { id: this.fgc.value.group, qualifier: null },
      groupVolume: this.fgc.value.volume,
      start: getDateFromStr(this.fgc.value.start),
      finish: getDateFromStr(this.fgc.value.finish),
      days: this.days,
    };
    this.lessonService
      .deleteSeries(toDelete)
      .subscribe((_) => this.close(true));
  }

  close(result: boolean): void {
    this.dialogRef.close(result);
  }
}
