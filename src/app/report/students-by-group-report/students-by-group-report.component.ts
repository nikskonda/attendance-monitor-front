import { Component, Inject, OnInit } from "@angular/core";
import { L10nLocale, L10N_LOCALE } from "angular-l10n";
import { ReportService } from "src/app/service/report.service";
import { getDate2, ObjectRef } from "src/app/service/common.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { GroupService } from "src/app/service/group.service";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-students-by-group-report",
  templateUrl: "./students-by-group-report.component.html",
  styleUrls: ["./students-by-group-report.component.scss"],
})
export class StudentsByGroupReportComponent implements OnInit {
  constructor(
    @Inject(L10N_LOCALE) public locale: L10nLocale,
    private reportService: ReportService,
    private groupService: GroupService,
    private datePipe: DatePipe
  ) {}

  table: object[][] = [];
  isPdfReady: boolean = false;
  refreshCallback: Function;

  groups: ObjectRef[] = [];

  fgc = new FormGroup({
    group: new FormControl(Validators.required),
  });

  ngOnInit(): void {
    this.refreshCallback = this.refresh.bind(this);
    this.groupService.getAll().subscribe((data) => (this.groups = data));
  }

  onGroupSelect() {
    this.reportService.findStudents(this.fgc.value.group).subscribe(
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
                alignment: j === 0 ? "left" : "center",
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
    const group: string = this.groups.find((g) => g.id === this.fgc.value.group)
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
        {
          text: "Данные студентов группы " + group + ".",
          marginTop: 30,
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
        title: "Список студенто группы " + group,
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
