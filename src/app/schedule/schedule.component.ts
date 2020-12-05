import { Cell, Lesson, LessonService } from "./../service/lesson.service";
import { Component, Inject, OnInit } from "@angular/core";
import { L10nLocale, L10N_LOCALE } from "angular-l10n";
import { ActivatedRoute, Router } from "@angular/router";
import { Person, Role } from "../service/account.service";
import { FormControl, FormGroup } from "@angular/forms";
import { AuthenticationService } from "../service/auth.service";

@Component({
  selector: "app-schedule",
  templateUrl: "./schedule.component.html",
  styleUrls: ["./schedule.component.scss"],
})
export class ScheduleComponent implements OnInit {
  lessons: Lesson[] = [];
  cells: Cell[] = [];
  headers: Cell[] = [];

  professor: Person;
  personId: number;
  cols: number = 0;

  topDateHeader: boolean = false;
  showGrid: boolean = false;

  range = new FormGroup({
    start: new FormControl(this.getFirstDateOfWeek()),
    end: new FormControl(this.getLastDateOfWeek()),
  });

  constructor(
    @Inject(L10N_LOCALE) public locale: L10nLocale,
    private lessonService: LessonService,
    private loginservice: AuthenticationService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.personId = params["personId"];
      this.loadTable();
    });
  }

  isAdmin() {
    return this.loginservice.isHasRole(Role.ADMIN);
  }

  lt() {
    this.topDateHeader = !this.topDateHeader;
    this.loadTable();
  }

  loadTable() {
    // if (!this.range.value.start || !this.range.value.end) return;
    this.lessonService
      .getLessons(
        this.getDate(this.range.value.start),
        this.getDate(this.range.value.end),
        this.personId,
        this.topDateHeader
      )
      .subscribe((data) => {
        this.cells = data.cells;
        this.showGrid = this.cells !== undefined && this.cells.length !== 0;
        this.headers = data.headers;
        this.professor = data.professor;
        this.cols = data.cols;
      });
  }

  getFirstDateOfWeek() {
    var curr = new Date();
    return new Date(curr.setDate(curr.getDate() - curr.getDay()));
    // return new Date("2020-09-01");
  }

  getLastDateOfWeek() {
    var curr = new Date();
    return new Date(curr.setDate(curr.getDate() - curr.getDay() + 6));
    // return new Date("2020-09-30");
  }

  getDate(date: Date) {
    date.setMinutes(-date.getTimezoneOffset());
    return date.toISOString().substring(0, 10);
  }
}
