import { Component, Inject, OnInit } from "@angular/core";
import { L10nLocale, L10N_LOCALE } from "angular-l10n";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { getDate, getDate2, ObjectRef } from "src/app/service/common.service";
import { GroupService } from "../../service/group.service";
import { ReportService } from "../../service/report.service";
import { SubjectService } from "../../service/subject.service";
import { DatePipe } from "@angular/common";

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

  table: object[][] = [];
  refreshCallback: Function;

  isPdfReady: boolean = false;

  constructor(
    @Inject(L10N_LOCALE) public locale: L10nLocale,
    private subjectService: SubjectService,
    private groupService: GroupService,
    private reportService: ReportService,
    private datePipe: DatePipe
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
          this.table = [];
          for (let i = 0; i < data.length; i++) {
            let row: object[] = [];
            for (let j = 0; j < data[i].length; j++) {
              if (i === 0) {
                row.push({ text: data[i][j], bold: true, alignment: "center" });
              } else if (j === 0) {
                row.push({ text: data[i][j], alignment: "left" });
              } else {
                row.push({ text: data[i][j], alignment: "center" });
              }
            }
            this.table.push(row);
          }
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
          text: "БЕЛОРУССКИЙ НАЦИОНАЛЬНЫЙ ТЕХНИЧЕСКИЙ УНИВЕРСИТЕТ",
          style: "header",
        },
        {
          text: "Факультет информационных технологий и робототехники",
          style: "header",
        },
        {
          text:
            "Кафедра «Программное обеспечение информационных систем и технологий»",
          style: "header",
        },
        { text: "Отчёт о посещаемости:", marginTop: 30 },
        {
          type: "none",
          ol: [
            "группы - " + group,
            "по предмету - " + subject,
            "за период - с " +
              this.datePipe.transform(
                getDate2(this.fgc.controls.start.value),
                "dd MMMM yyyy"
              ) +
              " по " +
              this.datePipe.transform(
                getDate2(this.fgc.controls.end.value),
                "dd MMMM yyyy"
              ),
          ],
          marginBottom: 15,
        },
        {
          table: {
            headerRows: 1,
            body: this.table,
          },
        },
        {
          text:
            "* X/Y, где X - пропущено всего, Y - пропущено по уважительной причине из Y",
          alignment: "left",
          italics: true,
          fontSize: 10,
        },
        {
          text:
            "\nОтчёт создан с помощью Web-приложение для мониторинга и анализа посещаемости занятий.",
          alignment: "left",
          italics: true,
        },
        {
          text: "Copyright © Сидорик В.В., Шконда Н.А. 2020 Все права защищены",
          alignment: "left",
          italics: true,
        },
        {
          text:
            "\n\n" +
            this.datePipe.transform(getDate2(new Date()), "dd.MM.yyyy"),
          alignment: "right",
        },
      ],
      info: {
        title: "Отчёт по группе " + group,
        author: "Attendance Monitor",
        subject: "Attendance Monitor Report",
        keywords: "Attendance Monitor, Report, BNTU",
      },
      styles: {
        header: {
          fontSize: 14,
          bold: true,
          margin: [0, 0, 0, 10],
          alignment: "center",
        },
      },
    };
  }
}
