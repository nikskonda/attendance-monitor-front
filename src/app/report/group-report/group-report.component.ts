import { Component, Inject, OnInit } from "@angular/core";
import { L10nLocale, L10N_LOCALE } from "angular-l10n";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { getDate, ObjectRef } from "src/app/service/common.service";
import { GroupService } from "../../service/group.service";
import { ReportService } from "../../service/report.service";
import { SubjectService } from "../../service/subject.service";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: "app-group-report",
  templateUrl: "./group-report.component.html",
  styleUrls: ["./group-report.component.scss"],
})
export class GroupReportComponent implements OnInit {
  groups: ObjectRef[] = [];
  subjects: ObjectRef[] = [];

  fgc = new FormGroup({
    start: new FormControl(Validators.required),
    end: new FormControl(Validators.required),

    group: new FormControl(Validators.required),
    subject: new FormControl(Validators.required),
  });

  table: string[][] = [];
  refreshCallback: Function;

  isPdfReady: boolean = false;

  constructor(
    @Inject(L10N_LOCALE) public locale: L10nLocale,
    private subjectService: SubjectService,
    private groupService: GroupService,
    private reportService: ReportService
  ) {}

  ngOnInit() {
    this.refreshCallback = this.refresh.bind(this);
    this.groupService.getAll().subscribe((data) => (this.groups = data));
  }

  onGroupSelect() {
    this.subjectService
      .getByGroup(this.fgc.value.group)
      .subscribe((data) => (this.subjects = data));
  }

  onSubjectSelect() {
    if (!this.fgc.controls.start.value || !this.fgc.controls.end.value) return;

    this.reportService
      .findDataByGroupForDateRange(
        this.fgc.value.subject,
        this.fgc.value.group,
        getDate(this.fgc.controls.start.value),
        getDate(this.fgc.controls.end.value)
      )
      .subscribe(
        (data) => {
          this.table = data;
        },
        (error) => console.log(error),
        () => (this.isPdfReady = true)
      );
  }

  refresh() {
    this.isPdfReady = false;
    this.onSubjectSelect();
  }

  getDocDefinition() {
    if (!this.isPdfReady) return;
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
            getDate(this.fgc.controls.start.value) +
            " по " +
            getDate(this.fgc.controls.end.value) +
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
            "* X/Y, где X - пропущено всего, Y - пропущено по уважительной причине (пропущено X из них Y по уважительной)",
          alignment: "left",
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
