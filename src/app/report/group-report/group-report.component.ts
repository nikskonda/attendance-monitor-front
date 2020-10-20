import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { ObjectRef } from "src/app/service/common.service";
import { GroupService } from "../../service/group.service";
import { ReportService } from "../../service/report.service";
import { SubjectService } from "../../service/subject.service";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: "app-group-report",
  templateUrl: "./group-report.component.html",
  styleUrls: ["./group-report.component.css"],
})
export class GroupReportComponent implements OnInit {
  selectedGroup: ObjectRef;
  selectedGroupId: number;
  groups: ObjectRef[] = [];

  selectedSubject: ObjectRef;
  subjectId: number;
  subjects: ObjectRef[] = [];

  fgc = new FormGroup({
    start: new FormControl(Validators.required),
    end: new FormControl(Validators.required),

    group: new FormControl(Validators.required),
    subject: new FormControl(Validators.required),
  });

  table: string[][] = [];

  isPdfReady: boolean = false;

  constructor(
    private subjectService: SubjectService,
    private groupService: GroupService,
    private reportService: ReportService
  ) {}

  ngOnInit() {
    this.groupService.getAll().subscribe((data) => {
      data.forEach((ref) => this.groups.push(ref));
      console.log(this.groups);
    });
  }

  onGroupSelect() {
    this.subjectService
      .getByGroup(this.fgc.value.group)
      .subscribe((data) => (this.subjects = data));
  }

  onSubjectSelect() {
    const start: Date = this.fgc.controls.start.value;
    start.setMinutes(-start.getTimezoneOffset());
    const end: Date = this.fgc.controls.end.value;
    end.setMinutes(-end.getTimezoneOffset());
    this.reportService
      .findDataByGroupForDateRange(
        this.fgc.value.subject,
        this.fgc.value.group,
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
    const group = this.groups.find((g) => g.id == this.fgc.value.group)
      .qualifier;
    const subject = this.subjects.find((g) => g.id == this.fgc.value.subject)
      .qualifier;
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
            "Отчёт о посещаемости группы " +
            group +
            " по предмету '" +
            subject +
            "' за период занятий с " +
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
      ],
      info: {
        title: "Отчёт по группе " + group,
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
