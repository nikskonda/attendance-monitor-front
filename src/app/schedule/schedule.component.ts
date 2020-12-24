import { Cell, Lesson, LessonService } from "./../service/lesson.service";
import { Component, Inject, OnInit } from "@angular/core";
import { L10nLocale, L10N_LOCALE } from "angular-l10n";
import { ActivatedRoute, Router } from "@angular/router";
import { Person, Role } from "../service/account.service";
import { FormControl, FormGroup } from "@angular/forms";
import { AuthenticationService } from "../service/auth.service";
import { CommonService, getDate } from "../service/common.service";

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
    private commonService: CommonService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.personId = params["personId"];
      this.loadTable();
    });
  }

  lt() {
    this.topDateHeader = !this.topDateHeader;
    this.loadTable();
  }

  loadTable() {
    // if (!this.range.value.start || !this.range.value.end) return;
    this.lessonService
      .getLessons(
        getDate(this.range.value.start),
        getDate(this.range.value.end),
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
    return new Date(curr.setDate(curr.getDate() - curr.getDay() + 1));
  }

  getLastDateOfWeek() {
    var curr = new Date();
    return new Date(curr.setDate(curr.getDate() - curr.getDay() + 7));
  }

  getColor(color: string) {
    if (color === "NOW") return "#d7565e"; //warn
    if (color === "TODAY") return "#f19d45"; //accent
    if (color === "HEADER") return "#384480";
    // return "#A5B6D5";
    return "#c7dafd";
  }
}
