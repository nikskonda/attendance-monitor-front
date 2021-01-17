import { DatePipe } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import { L10nLocale, L10N_LOCALE } from "angular-l10n";
import { getDate2 } from "src/app/service/common.service";
import { ReportService } from "src/app/service/report.service";

@Component({
  selector: "app-professors-report",
  templateUrl: "./professors-report.component.html",
  styleUrls: ["./professors-report.component.scss"],
})
export class ProfessorsReportComponent implements OnInit {
  constructor(
    private reportService: ReportService,
    private datePipe: DatePipe
  ) {}

  table: object[][] = [];
  isPdfReady: boolean = false;
  refreshCallback: Function;

  ngOnInit(): void {
    this.refreshCallback = this.refresh.bind(this);
    this.reportService.findProfesors().subscribe(
      (data) => {
        this.table = [];
        for (let i = 0; i < data.length; i++) {
          let row: object[] = [];
          for (let j = 0; j < data[i].length; j++) {
            if (i === 0) {
              row.push({ text: data[i][j], bold: true, alignment: "center" });
            } else {
              row.push({
                text: data[i][j],
                alignment: j < 2 ? "left" : "center",
              });
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
    this.ngOnInit();
  }

  getDocDefinition() {
    if (!this.isPdfReady) return;
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
        {
          text: "Данные всех преподавателей.",
          marginTop: 30,
          marginBottom: 15,
        },
        {
          table: {
            widths: ["*", "*", "*", 80],
            headerRows: 1,
            body: this.table,
          },
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
        title: "Преподаватели",
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
