import { Component, Inject, OnInit } from "@angular/core";
import { L10nLocale, L10N_LOCALE } from "angular-l10n";
import { ReportService } from "src/app/service/report.service";

@Component({
  selector: "app-professors-report",
  templateUrl: "./professors-report.component.html",
  styleUrls: ["./professors-report.component.scss"],
})
export class ProfessorsReportComponent implements OnInit {
  constructor(private reportService: ReportService) {}

  table: string[][] = [];
  isPdfReady: boolean = false;
  refreshCallback: Function;

  ngOnInit(): void {
    this.refreshCallback = this.refresh.bind(this);
    this.reportService.findProfesors().subscribe(
      (data) => {
        this.table = data;
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
          text: "Данные всех преподавателей.",
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
        title: "Отчёт по прподавателям",
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
