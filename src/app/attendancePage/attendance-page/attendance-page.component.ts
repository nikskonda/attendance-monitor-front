import { Component, Inject, OnInit } from "@angular/core";
import { L10nLocale, L10nTranslationService, L10N_LOCALE } from "angular-l10n";
import { CommonModule, DatePipe } from "@angular/common";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { AttCell, AttendanceService } from "../../service/attendance.service";
import {
  CommonService,
  getDate,
  getDateFromStr,
  ObjectRef,
} from "../../service/common.service";
import {
  DAYS_OF_WEEK,
  Lesson,
  LessonService,
  LessonTime,
} from "../../service/lesson.service";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { GroupService, Volume } from "../../service/group.service";
import { Person, AccountService, Role } from "../../service/account.service";
import { SubjectService } from "../../service/subject.service";
import { AuthenticationService } from "../../service/auth.service";
import { ProfessorService } from "../../service/professor.service";
import { FilterComponent } from "../filter/filter.component";
import { RemoveDialogComponent } from "src/app/editor/remove-dialog/remove-dialog.component";

@Component({
  selector: "app-attendance-page",
  templateUrl: "./attendance-page.component.html",
  styleUrls: ["./attendance-page.component.scss"],
})
export class AttendancePageComponent implements OnInit {
  IN_SAVE_LIST: number = 0;
  DATE_RANGE: number = 20;

  headers: AttCell[] = [];
  att: AttCell[] = [];

  cols: number = 0;

  group: ObjectRef;
  subject: ObjectRef;

  groupId: number;
  groupVolume: string = "FULL";
  subjectId: number;
  subjectTypesSelected: string[] = [];

  selectedValue: string = "";

  listToSave: AttCell[] = [];

  range = new FormGroup({
    start: new FormControl(this.getDayBefore(true)),
    end: new FormControl(this.getDayAfter(true)),
  });

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
    @Inject(L10N_LOCALE) public locale: L10nLocale,
    private translation: L10nTranslationService,

    private profService: ProfessorService,

    private lessonService: LessonService,
    private subjectService: SubjectService,
    private groupService: GroupService,
    private loginService: AuthenticationService,
    private commonService: CommonService,

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
    this.profService.getProfs().subscribe((data) => {
      if (this.commonService.isInclude([Role.EDITOR])) {
        this.profs = data;
      } else {
        const email = this.loginService.getUserData().username;
        this.profs = data.filter((p) => p.email === email);
      }
    });
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
      this.subjectTypesSelected = params["subjectTypes"] || [];
      const dateS = params["dateStart"] || undefined;
      const dateF = params["dateEnd"] || undefined;
      this.setDate(dateS, dateF);
      this.subjectTypesSelected =
        this.subjectTypesSelected instanceof Array
          ? this.subjectTypesSelected
          : new Array(this.subjectTypesSelected);
    });
    this.loadTable();
  }

  setDate(dateS, dateF) {
    const toCalc = dateS === dateF;
    this.range.controls.start.setValue(this.getDayBefore(toCalc, dateS));
    this.range.controls.end.setValue(this.getDayAfter(toCalc, dateF));
  }

  getDayBefore(toCalc: boolean, date?) {
    if (!toCalc) {
      return new Date(date);
    }
    var curr = date ? new Date(date) : new Date();
    return new Date(curr.setDate(curr.getDate() - this.DATE_RANGE));
  }

  getDayAfter(toCalc: boolean, date?) {
    if (!toCalc) {
      return new Date(date);
    }
    var curr = date ? new Date(date) : new Date();
    return new Date(curr.setDate(curr.getDate() + this.DATE_RANGE));
  }

  loadTable() {
    if (!this.range.value.start || !this.range.value.end) return;
    if (this.subjectTypesSelected.length === 0) return;

    this.attService
      .getAttendance(
        getDateFromStr(this.range.value.start),
        getDateFromStr(this.range.value.end),
        this.groupId,
        this.subjectId,
        this.subjectTypesSelected,
        this.groupVolume
      )
      .subscribe((data) => {
        this.headers = data.headers;
        this.att = data.cells;
        this.cols = data.cols;
        this.group = data.group;
        this.subject = data.subject;
        this.setParams();
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
  }

  save(isSaveButton: boolean) {
    if (isSaveButton || this.listToSave.length > this.IN_SAVE_LIST) {
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
    return cell.goodReason && !cell.empty ? "#b4bf9b" : "white";
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

      return [date, time, this.translation.translate(lesson.subjectType)];
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
        profEmail: this.loginService.getUserData().username,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.status) {
        this.groupId = result.lesson.group.id;
        this.groupVolume = result.lesson.groupVolume;
        this.subjectId = result.lesson.subject.id;
        this.subjectTypesSelected = [result.lesson.subjectType];
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
        this.subjectTypesSelected = [result.lesson.subjectType];
        this.loadTable();
      }
    });
  }

  delete(lesson: Lesson) {
    const dialogRef = this.dialog.open(RemoveDialogComponent, {
      data: {
        name: `Удалить занятие по '${lesson.subject.qualifier}' за ${lesson.date} ${lesson.time.startTime}-${lesson.time.finishTime}?`,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.lessonService.remove(lesson.id).subscribe((_) => this.loadTable());
      }
    });
    return false;
  }

  filter() {
    const dialogRef = this.dialog.open(FilterComponent, {
      data: {
        subjects: this.subjects,
        groups: this.groups,
        volumes: this.volumes,

        groupId: this.groupId,
        groupVolume: this.groupVolume,
        subjectId: this.subjectId,
        subjectTypes: this.subjectTypesSelected,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.groupId = result.groupId;
      this.groupVolume = result.groupVolume;
      this.subjectId = result.subjectId;
      this.subjectTypesSelected = result.subjectTypes;

      this.loadTable();
    });
  }

  setParams() {
    const queryParams: Params = {
      groupId: this.groupId,
      groupVolume: this.groupVolume,
      subjectId: this.subjectId,
      subjectTypes: this.subjectTypesSelected,
      dateStart: getDate(this.range.value.start),
      dateEnd: getDate(this.range.value.end),
    };

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: "merge",
    });
  }

  getColor(color: string) {
    if (color === "GOOD") return "#B4C6E7"; //accent
    if (color === "HEADER") return "#4472C4";
    // return "#A5B6D5";
    return "#D9E2F3";
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
    @Inject(L10N_LOCALE) public locale: L10nLocale,
    private lessonService: LessonService,
    private commonService: CommonService,
    public dialogRef: MatDialogRef<AttLessonEditorDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data.isUpdate) {
      this.active = data.active;
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
      // this.fgc.controls.prof.setValue(
      //   data.profs.find((p) => p.email === data.profEmail).id
      // );
      // if (!commonService.isInclude([Role.ADMIN])) {
      //   data.profs = data.profs.filter((pr) => pr.email === data.profEmail);
      // }
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
    // if (this.loginService.isHasRole(Role.PROFESSOR))
    return false;
    // return true;
  }
}
