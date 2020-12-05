import { Component, Inject, OnInit } from "@angular/core";
import { L10nLocale, L10N_LOCALE } from "angular-l10n";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import {
  CommonService,
  getDate,
  ObjectRef,
} from "src/app/service/common.service";
import { GroupService } from "../../service/group.service";
import { ReportService } from "../../service/report.service";
import { Person, Role } from "../../service/account.service";
import { Student, StudentService } from "src/app/service/student.service";
import { SubjectService } from "src/app/service/subject.service";
import { AuthenticationService } from "src/app/service/auth.service";

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

  table: string[][] = [];
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
