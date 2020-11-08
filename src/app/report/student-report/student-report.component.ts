import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { ObjectRef } from "src/app/service/common.service";
import { GroupService } from "../../service/group.service";
import { ReportService } from "../../service/report.service";
import { Person, PersonService } from "../../service/account.service";
import { StudentService } from "src/app/service/student.service";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: "app-student-report",
  templateUrl: "./student-report.component.html",
  styleUrls: ["./student-report.component.css"],
})
export class StudentReportComponent implements OnInit {
  studs: Person[] = [];
  groups: ObjectRef[] = [];

  fgc = new FormGroup({
    start: new FormControl(Validators.required),
    end: new FormControl(Validators.required),

    group: new FormControl(Validators.required),
    student: new FormControl(Validators.required),
  });

  table: string[][] = [];

  isPdfReady: boolean = false;

  constructor(
    private studentService: StudentService,
    private groupService: GroupService,
    private reportService: ReportService
  ) {}

  ngOnInit() {
    this.groupService.getAll().subscribe((data) => {
      data.forEach((ref) => this.groups.push(ref));
    });
  }

  onGroupSelect() {
    this.studentService
      .getByGroup(this.fgc.value.group)
      .subscribe((data) => (this.studs = data));
  }

  onStudentSelect() {
    const start: Date = this.fgc.controls.start.value;
    start.setMinutes(-start.getTimezoneOffset());
    const end: Date = this.fgc.controls.end.value;
    end.setMinutes(-end.getTimezoneOffset());
    this.reportService
      .findDataByStudentForDateRange(
        this.fgc.value.student,
        start.toISOString().substring(0, 10),
        end.toISOString().substring(0, 10)
      )
      .subscribe(
        (data) => {
          console.log(data);
          this.table = data;
        },
        (error) => console.log(error),
        () => (this.isPdfReady = true)
      );
  }

  getDate(date: Date) {
    date.setMinutes(-date.getTimezoneOffset());
    return date.toISOString().substring(0, 10);
  }

  refresh() {
    this.isPdfReady = false;
    this.onStudentSelect();
  }

  open() {
    pdfMake.createPdf(this.getDocDefinition()).open();
  }

  download() {
    pdfMake.createPdf(this.getDocDefinition()).download();
  }

  print() {
    pdfMake.createPdf(this.getDocDefinition()).print();
  }

  getDocDefinition() {
    const fullName = this.studs.find((s) => s.id === this.fgc.value.student)
      .fullName;
    return {
      content: [
        {
          text: "Белорусский национальный технический университет",
          alignment: "right",
        },
        {
          text: "Факультет информационных технологий и робототехники",
          alignment: "right",
        },
        {
          text: "Кафедра программирования и программирования",
          alignment: "right",
        },
        {
          text:
            "Отчёт о посещаемости студента " +
            fullName +
            " за период занятий с " +
            this.getDate(this.fgc.controls.start.value) +
            " по " +
            this.getDate(this.fgc.controls.end.value) +
            ".",
          marginTop: 100,
          marginBottom: 50,
        },
        {
          table: {
            body: this.table,
          },
        },
        {
          text:
            "* X/Y/Z, где X - пропущено всего, Y - пропущено по уважительной причине (из X), Z - всего занятий",
          alignment: "left",
        },
      ],
      info: {
        title: "Отчёт по студенту " + fullName,
        author: "4eburek",
        subject: "4eburek",
        keywords: "4eburek, lol, kek",
      },
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 20, 0, 10],
          decoration: "underline",
        },
        name: {
          fontSize: 16,
          bold: true,
        },
        jobTitle: {
          fontSize: 14,
          bold: true,
          italics: true,
        },
        sign: {
          margin: [0, 50, 0, 10],
          alignment: "right",
          italics: true,
        },
        tableHeader: {
          bold: true,
        },
      },
    };
  }
}
