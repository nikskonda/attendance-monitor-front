import { Component, OnInit } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { FormControl, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AttCell, AttendanceService } from "../service/attendance.service";
import { ObjectRef } from "../service/common.service";

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
  subjectId: number;

  selectedValue: string = "";

  listToSave: AttCell[] = [];

  range = new FormGroup({
    start: new FormControl(this.get3DaysBefore()),
    end: new FormControl(this.get3DaysAfter()),
  });

  subjectTypes = {
    name: "All",
    completed: false,
    subtasks: [
      { name: "LECTURE", completed: false },
      { name: "PRACTICE", completed: false },
      { name: "LAB", completed: false },
    ],
  };
  allSubjectTypes: boolean = false;

  updateAllComplete() {
    this.allSubjectTypes =
      this.subjectTypes.subtasks != null &&
      this.subjectTypes.subtasks.every((t) => t.completed);
    this.loadTable();
  }

  someComplete(): boolean {
    if (this.subjectTypes.subtasks == null) {
      return false;
    }
    return (
      this.subjectTypes.subtasks.filter((t) => t.completed).length > 0 &&
      !this.allSubjectTypes
    );
  }

  setAll(completed: boolean) {
    this.allSubjectTypes = completed;
    if (this.subjectTypes.subtasks == null) {
      return;
    }
    this.subjectTypes.subtasks.forEach((t) => (t.completed = completed));
    this.loadTable();
  }

  getSelectedSubjectTypes() {
    let types: string[] = [];
    this.subjectTypes.subtasks.forEach((t) => {
      if (t.completed) types.push(t.name);
    });
    return types;
  }

  constructor(
    private router: Router,
    private attService: AttendanceService,
    private route: ActivatedRoute
  ) {}

  getDate(date: Date) {
    date.setMinutes(-date.getTimezoneOffset());
    return date.toISOString().substring(0, 10);
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.groupId = params["groupId"];
      this.subjectId = params["subjectId"];
      this.subjectTypes.subtasks.find(
        (st) => st.name === params["subjectTypes"]
      ).completed = true;
    });
    this.loadTable();
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
      this.subjectTypes.subtasks.find((t) => t.completed === true) === undefined
    )
      return;

    this.attService
      .getAttendance(
        this.getDate(this.range.value.start),
        this.getDate(this.range.value.end),
        this.groupId,
        this.subjectId,
        this.getSelectedSubjectTypes()
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

  isHeader(cell, i) {
    return cell.header || i % this.cols === 0;
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
}
