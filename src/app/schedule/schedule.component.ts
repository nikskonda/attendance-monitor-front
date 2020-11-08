import { Cell, Lesson, LessonService } from "./../service/lesson.service";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Person, Role } from "../service/account.service";
import { FormControl, FormGroup } from "@angular/forms";
import { AuthenticationService } from "../service/auth.service";

@Component({
  selector: "app-schedule",
  templateUrl: "./schedule.component.html",
  styleUrls: ["./schedule.component.css"],
})
export class ScheduleComponent implements OnInit {
  lessons: Lesson[] = [];
  cells: Cell[] = [];
  professor: Person;
  personId: number;
  cols: number = 0;

  topDateHeader: boolean = true;

  range = new FormGroup({
    start: new FormControl(this.getFirstDateOfWeek()),
    end: new FormControl(this.getLastDateOfWeek()),
  });

  constructor(
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
    return this.loginservice.isHasRole(Role.Admin);
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
        this.professor = data.professor;
        this.cols = data.cols;
      });
  }

  getFirstDateOfWeek() {
    var curr = new Date();
    return new Date(curr.setDate(curr.getDate() - curr.getDay()));
  }

  getLastDateOfWeek() {
    var curr = new Date();
    return new Date(curr.setDate(curr.getDate() - curr.getDay() + 6));
  }

  getDate(date: Date) {
    date.setMinutes(-date.getTimezoneOffset());
    return date.toISOString().substring(0, 10);
  }
}
