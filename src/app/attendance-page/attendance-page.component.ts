import { Component, Inject, OnInit } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AttCell, AttendanceService } from "../service/attendance.service";
import { getDateFromStr, ObjectRef } from "../service/common.service";
import {
  DAYS_OF_WEEK,
  Lesson,
  LessonService,
  LessonTime,
} from "../service/lesson.service";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { GroupService, Volume } from "../service/group.service";
import { Person, PersonService, Role } from "../service/account.service";
import { SubjectService } from "../service/subject.service";
import { AuthenticationService } from "../service/auth.service";
import { ProfessorService } from "../service/professor.service";

@Component({
  selector: "app-attendance-page",
  templateUrl: "./attendance-page.component.html",
  styleUrls: ["./attendance-page.component.css"],
})
export class AttendancePageComponent implements OnInit {
  att: AttCell[] = [];

  cols: number = 0;

  group: ObjectRef;
  subject: ObjectRef;

  groupId: number;
  groupVolume: string = "FULL";
  subjectId: number;

  selectedValue: string = "";

  listToSave: AttCell[] = [];

  range = new FormGroup({
    start: new FormControl(this.get3DaysBefore()),
    end: new FormControl(this.get3DaysAfter()),
  });

  subjectTypesSelect = {
    name: "All",
    completed: false,
    subtasks: [
      { name: "LECTURE", completed: false },
      { name: "PRACTICE", completed: false },
      { name: "LAB", completed: false },
    ],
  };
  allSubjectTypes: boolean = false;

  times: LessonTime[] = [];
  subjects: ObjectRef[] = [];
  subjectTypes: string[] = [];
  groups: ObjectRef[] = [];
  profs: Person[] = [];
  volumes: Volume[] = [];

  lessons: Lesson[] = [];
  selected: Lesson;
  isUpdate: boolean = false;

  constructor(
    private profService: ProfessorService,

    private lessonService: LessonService,
    private subjectService: SubjectService,
    private groupService: GroupService,
    private loginService: AuthenticationService,

    private router: Router,
    private attService: AttendanceService,
    private route: ActivatedRoute,

    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.lessonService
      .getLessonTimes()
      .subscribe((data) => (this.times = data));
    this.groupService.getAll().subscribe((data) => (this.groups = data));
    this.profService.getProfs().subscribe((data) => (this.profs = data));
    this.subjectService.getAll().subscribe((data) => (this.subjects = data));
    this.subjectService
      .getTypes()
      .subscribe((data) => (this.subjectTypes = data));
    this.groupService
      .getGroupVolumes()
      .subscribe((data) => (this.volumes = data));

    this.route.queryParams.subscribe((params) => {
      this.groupId = params["groupId"];
      this.groupVolume = params["groupVolume"] || "FULL";
      this.subjectId = params["subjectId"];
      this.subjectTypesSelect.subtasks.find(
        (st) => st.name === params["subjectTypes"]
      ).completed = true;
    });
    this.loadTable();
  }

  updateAllComplete() {
    this.allSubjectTypes =
      this.subjectTypesSelect.subtasks != null &&
      this.subjectTypesSelect.subtasks.every((t) => t.completed);
    this.loadTable();
  }

  someComplete(): boolean {
    if (this.subjectTypesSelect.subtasks == null) {
      return false;
    }
    return (
      this.subjectTypesSelect.subtasks.filter((t) => t.completed).length > 0 &&
      !this.allSubjectTypes
    );
  }

  setAll(completed: boolean) {
    this.allSubjectTypes = completed;
    if (this.subjectTypesSelect.subtasks == null) {
      return;
    }
    this.subjectTypesSelect.subtasks.forEach((t) => (t.completed = completed));
    this.loadTable();
  }

  getSelectedSubjectTypes() {
    let types: string[] = [];
    this.subjectTypesSelect.subtasks.forEach((t) => {
      if (t.completed) types.push(t.name);
    });
    return types;
  }

  get3DaysBefore() {
    var curr = new Date();
    return new Date(curr.setDate(curr.getDate() - 3));
  }

  get3DaysAfter() {
    var curr = new Date();
    return new Date(curr.setDate(curr.getDate() + 3));
  }

  loadTable() {
    if (!this.range.value.start || !this.range.value.end) return;
    if (
      this.subjectTypesSelect.subtasks.find((t) => t.completed === true) ===
      undefined
    )
      return;

    this.attService
      .getAttendance(
        getDateFromStr(this.range.value.start),
        getDateFromStr(this.range.value.end),
        this.groupId,
        this.subjectId,
        this.getSelectedSubjectTypes(),
        this.groupVolume
      )
      .subscribe((data) => {
        console.log(data);
        this.att = data.cells;
        this.cols = data.cols;
        this.group = data.group;
        this.subject = data.subject;
      });
  }

  setValue(value: number, cell: AttCell) {
    if (value === 0) {
      cell.text = "";
      cell.empty = true;
      cell.goodReason = false;
    } else {
      cell.empty = false;
      cell.text = value.toString();
    }
    this.addToSaveList(cell);
  }

  isDateTimes(cell, i) {
    return cell.header && i <= this.cols;
  }

  isStudents(cell, i) {
    return cell.header && i % this.cols === 0;
  }

  isAtt(cell) {
    return !cell.header;
  }

  addToSaveList(cell: AttCell) {
    let found = this.listToSave.find(
      (c) => c.lesson.id === cell.lesson.id && c.person.id === cell.person.id
    );
    if (found) {
      found = cell;
    } else {
      this.listToSave.push(cell);
    }
    this.save(false);
    console.log(this.listToSave);
  }

  save(isSaveButton: boolean) {
    if (isSaveButton || this.listToSave.length > 10) {
      this.attService
        .save(this.listToSave)
        .subscribe((data) => (this.listToSave = []));
    }
  }

  onRightClick(cell: AttCell) {
    if (cell.empty === true) return;
    cell.goodReason = !cell.goodReason;
    this.addToSaveList(cell);
    return false;
  }

  getCellBackground(cell: AttCell) {
    return cell.goodReason && !cell.empty ? "lime" : "white";
  }

  getHeaderText(text: string, i) {
    if (i === 0 || i >= this.cols) {
      return text;
    }
    let date = new DatePipe("ru").transform(text.substring(0, 10), "d MMMM");
    return date + text.substring(10, text.length);
  }

  getHeaderPList(lesson: Lesson) {
    if (lesson) {
      let date = new DatePipe("ru").transform(lesson.date, "d MMMM");
      let time = `${lesson.time.startTime.substring(
        0,
        5
      )} - ${lesson.time.finishTime.substring(0, 5)}`;

      return [date, time, lesson.subjectType];
    }
    return [];
  }

  create() {
    const dialogRef = this.dialog.open(AttLessonEditorDialog, {
      data: {
        isUpdate: false,
        times: this.times,
        subjects: this.subjects,
        subjectTypes: this.subjectTypes,
        profs: this.profs,
        groups: this.groups,
        volumes: this.volumes,
        days: DAYS_OF_WEEK,
        profEmail: this.loginService.getUserData().email,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.status) {
        console.log(result);
        this.groupId = result.lesson.group.id;
        this.groupVolume = result.lesson.groupVolume;
        this.subjectId = result.lesson.subject.id;
        this.subjectTypesSelect.subtasks.forEach(
          (st) => (st.completed = st.name === result.lesson.subjectType)
        );
        this.loadTable();
      }
    });
  }

  update(lesson) {
    const dialogRef = this.dialog.open(AttLessonEditorDialog, {
      data: {
        isUpdate: true,
        active: lesson,
        times: this.times,
        subjects: this.subjects,
        subjectTypes: this.subjectTypes,
        profs: this.profs,
        groups: this.groups,
        volumes: this.volumes,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.status) {
        this.groupId = result.status.lesson.group.id;
        this.groupVolume = result.status.lesson.groupVolume;
        this.subjectId = result.status.lesson.subject.id;
        this.subjectTypesSelect.subtasks.find(
          (st) => st.name === result.status.lesson.subjectType
        ).completed = true;
        this.loadTable();
      }
    });
  }
}

@Component({
  templateUrl: "./lesson-editor-dialog.html",
})
export class AttLessonEditorDialog implements OnInit {
  public isUpdate: boolean = false;

  active: Lesson;
  days: number[] = [];

  fgc = new FormGroup({
    date: new FormControl(new Date().toISOString(), Validators.required),
    time: new FormControl({}, [Validators.required]),
    subject: new FormControl("", [Validators.required]),
    subjectType: new FormControl("", [Validators.required]),
    prof: new FormControl("", [Validators.required]),
    group: new FormControl("", [Validators.required]),
    volume: new FormControl(Volume.FULL, [Validators.required]),
  });

  constructor(
    private lessonService: LessonService,
    private loginService: AuthenticationService,
    public dialogRef: MatDialogRef<AttLessonEditorDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data.isUpdate) {
      this.active = data.active;
      console.log(data.active);
      this.fgc.controls.date.setValue(new Date(data.active.date).toISOString());
      this.fgc.controls.time.setValue(data.active.time.id);
      this.fgc.controls.subject.setValue(data.active.subject.id);
      this.fgc.controls.subjectType.setValue(data.active.subjectType);
      this.fgc.controls.prof.setValue(data.active.professor.id);
      this.fgc.controls.group.setValue(data.active.group.id);
      this.fgc.controls.volume.setValue(data.active.groupVolume);
    } else {
      const now = new Date();
      const dateStr = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
      this.fgc.controls.time.setValue(
        data.times.find(
          (t) => dateStr >= t.startTime && dateStr <= t.finishTime
        )?.id
      );
    }
    if (data.profEmail) {
      this.fgc.controls.prof.setValue(
        data.profs.find((p) => p.email === data.profEmail).id
      );
    }
    this.isUpdate = data.isUpdate;
  }
  ngOnInit(): void {}

  create() {
    let toCreate: Lesson = {
      id: null,
      date: getDateFromStr(this.fgc.value.date),
      time: this.data.times.find((t) => t.id === this.fgc.value.time),
      subject: { id: this.fgc.value.subject, qualifier: null },
      subjectType: this.fgc.value.subjectType,
      professor: { id: this.fgc.value.prof, qualifier: null },
      group: { id: this.fgc.value.group, qualifier: null },
      groupVolume: this.fgc.value.volume,
    };
    this.lessonService
      .create(toCreate)
      .subscribe((data) => this.close(true, data));
  }

  update() {
    let toUpdate: Lesson = {
      id: null,
      date: getDateFromStr(this.fgc.value.date),
      time: this.data.times.find((t) => t.id === this.fgc.value.time),
      subject: { id: this.fgc.value.subject, qualifier: null },
      subjectType: this.fgc.value.subjectType,
      professor: { id: this.fgc.value.prof, qualifier: null },
      group: { id: this.fgc.value.group, qualifier: null },
      groupVolume: this.fgc.value.volume,
    };
    this.lessonService
      .update(this.active.id, toUpdate)
      .subscribe((data) => this.close(true, data));
  }

  close(result: boolean, lesson?: Lesson): void {
    this.dialogRef.close({ status: result, lesson: lesson });
  }

  isProfDisable() {
    if (this.loginService.isHasRole(Role.Admin)) return false;
    return true;
  }
}
