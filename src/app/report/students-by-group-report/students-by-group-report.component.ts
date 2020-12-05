import { Component, Inject, OnInit } from "@angular/core";
import { L10nLocale, L10N_LOCALE } from "angular-l10n";
import { ReportService } from "src/app/service/report.service";
import { ObjectRef } from "src/app/service/common.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { GroupService } from "src/app/service/group.service";

@Component({
  selector: "app-students-by-group-report",
  templateUrl: "./students-by-group-report.component.html",
  styleUrls: ["./students-by-group-report.component.scss"],
})
export class StudentsByGroupReportComponent implements OnInit {
  constructor(
    @Inject(L10N_LOCALE) public locale: L10nLocale,
    private reportService: ReportService,
    private groupService: GroupService
  ) {}

  table: string[][] = [];
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
    const group: string = this.groups.find((g) => g.id === this.fgc.value.group)
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
          text: "Данные всех студентов группы " + group + ".",
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
        title: "Отчёт по студентам " + group,
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
