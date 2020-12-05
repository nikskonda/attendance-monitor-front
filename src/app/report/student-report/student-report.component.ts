import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import {
  CommonService,
  getDate,
  ObjectRef,
} from "src/app/service/common.service";
import { GroupService } from "../../service/group.service";
import { ReportService } from "../../service/report.service";
import { Person, AccountService, Role } from "../../service/account.service";
import { Student, StudentService } from "src/app/service/student.service";
import { AuthenticationService } from "src/app/service/auth.service";

@Component({
  selector: "app-student-report",
  templateUrl: "./student-report.component.html",
  styleUrls: ["./student-report.component.scss"],
})
export class StudentReportComponent implements OnInit {
  studs: Student[] = [];
  groups: ObjectRef[] = [];

  fgc = new FormGroup({
    start: new FormControl(Validators.required),
    end: new FormControl(Validators.required),

    group: new FormControl(Validators.required),
    student: new FormControl(Validators.required),
  });

  table: string[][] = [];
  isPdfReady: boolean = false;
  refreshCallback: Function;

  isParentMode: boolean = false;

  constructor(
    private studentService: StudentService,
    private groupService: GroupService,
    private reportService: ReportService,
    private commonService: CommonService,
    private authService: AuthenticationService
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
  }

  loadTableData() {
    if (this.isParentMode) {
      const stud = this.studs.find((st) => st.id === this.fgc.value.student);
      if (stud) {
        this.fgc.controls.group.setValue(stud?.group.id);
      }
    }
    if (!this.fgc.valid) return;
    if (!this.fgc.controls.start.value || !this.fgc.controls.end.value) return;

    this.reportService
      .findDataByStudentForDateRange(
        this.fgc.value.student,
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
    this.loadTableData();
  }

  getDocDefinition() {
    if (!this.isPdfReady) return;
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
