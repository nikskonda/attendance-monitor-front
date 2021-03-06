import { Component, Inject, OnInit } from "@angular/core";
import { L10nLocale, L10N_LOCALE } from "angular-l10n";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import {
  CommonService,
  getDate,
  getDate2,
  ObjectRef,
} from "src/app/service/common.service";
import { GroupService } from "../../service/group.service";
import { ReportService } from "../../service/report.service";
import { Person, Role } from "../../service/account.service";
import { Student, StudentService } from "src/app/service/student.service";
import { SubjectService } from "src/app/service/subject.service";
import { AuthenticationService } from "src/app/service/auth.service";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-student-detail",
  templateUrl: "./student-detail.component.html",
  styleUrls: ["./student-detail.component.scss"],
})
export class StudentDetailComponent implements OnInit {
  studs: Student[] = [];
  subjects: ObjectRef[] = [];
  groups: ObjectRef[] = [];

  fgc = new FormGroup({
    start: new FormControl(Validators.required),
    end: new FormControl(Validators.required),

    group: new FormControl(Validators.required),
    student: new FormControl(Validators.required),
    subject: new FormControl(),
  });

  table: object[][] = [];
  isPdfReady: boolean = false;
  refreshCallback: Function;

  isParentMode: boolean = false;

  constructor(
    @Inject(L10N_LOCALE) public locale: L10nLocale,
    private studentService: StudentService,
    private groupService: GroupService,
    private subjectService: SubjectService,
    private reportService: ReportService,
    private commonService: CommonService,
    private authService: AuthenticationService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.refreshCallback = this.refresh.bind(this);

    const roles = this.commonService.getCurrentUserRoles();
    if (roles.length === 1 && roles[0] === Role.PARENT) {
      this.isParentMode = true;
      this.studentService
        .findByParent(this.authService.getUserData().username)
        .subscribe((data) => (this.studs = data));
    } else {
      this.groupService.getAll().subscribe((data) => {
        data.forEach((ref) => this.groups.push(ref));
      });
    }
  }

  onGroupSelect() {
    this.studentService
      .getByGroup(this.fgc.value.group)
      .subscribe((data) => (this.studs = data));
    this.subjectService
      .getByGroup(this.fgc.value.group)
      .subscribe((data) => (this.subjects = data));
  }

  loadTableData() {
    if (this.isParentMode) {
      const stud = this.studs.find((st) => st.id === this.fgc.value.student);
      if (stud) {
        this.fgc.controls.group.setValue(stud?.group.id);
        this.subjectService
          .getByGroup(this.fgc.value.group)
          .subscribe((data) => (this.subjects = data));
      }
    }
    if (!this.fgc.valid) return;
    if (!this.fgc.controls.start.value || !this.fgc.controls.end.value) return;

    this.reportService
      .findDataByStudentAndSubjectDetailsForDateRange(
        this.fgc.value.student,
        this.fgc.value.subject,
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
    this.loadTableData();
  }

  getDocDefinition() {
    if (!this.isPdfReady) return;
    const fullName = this.studs.find((s) => s.id === this.fgc.value.student)
      .fullName;
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
            "студента - " + fullName,
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
        title: "Детальный отчёт по студенту " + fullName,
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
