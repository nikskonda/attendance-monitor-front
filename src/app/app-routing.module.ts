import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ScheduleComponent } from "./schedule/schedule.component";
import { LoginComponent } from "./loginUser/login/login.component";
import { AttendancePageComponent } from "./attendancePage/attendance-page/attendance-page.component";
import { MenuPageComponent } from "./menu-page/menu-page.component";
import { GroupEditComponent } from "./editor/group-edit/group-edit.component";
import { LessonEditComponent } from "./editor/lesson-edit/lesson-edit.component";
import { SubjectEditComponent } from "./editor/subject-edit/subject-edit.component";
import { SpecialityEditComponent } from "./editor/speciality-edit/speciality-edit.component";
import { ProfEditComponent } from "./editor/prof-edit/prof-edit.component";
import { ChangePasswordComponent } from "./loginUser/change-password/change-password.component";
import { EditorPageComponent } from "./editor/editor-page/editor-page.component";
import { StudentReportComponent } from "./report/student-report/student-report.component";
import { StudentDetailComponent } from "./report/student-detail/student-detail.component";
import { GroupReportComponent } from "./report/group-report/group-report.component";
import { ReportPageComponent } from "./report/report-page/report-page.component";
import { StudEditComponent } from "./editor/stud-edit/stud-edit.component";
import { AccountEditComponent } from "./editor/account-edit/account-edit.component";
import { PositionEditComponent } from "./editor/position-edit/position-edit.component";
import { ProfessorsReportComponent } from "./report/professors-report/professors-report.component";
import { StudentsByGroupReportComponent } from "./report/students-by-group-report/students-by-group-report.component";

const routes: Routes = [
  { path: "", redirectTo: "login", pathMatch: "full" },
  { path: "login", component: LoginComponent },
  { path: "changePassword", component: ChangePasswordComponent },

  { path: "schedule", component: ScheduleComponent },
  { path: "attendance", component: AttendancePageComponent },
  { path: "menu", component: MenuPageComponent },
  {
    path: "edit",
    component: EditorPageComponent,
    children: [
      { path: "speciality", component: SpecialityEditComponent },
      { path: "group", component: GroupEditComponent },
      { path: "student", component: StudEditComponent },
      { path: "position", component: PositionEditComponent },
      { path: "professor", component: ProfEditComponent },
      { path: "subject", component: SubjectEditComponent },
      { path: "lesson", component: LessonEditComponent },
      { path: "account", component: AccountEditComponent },
    ],
  },

  {
    path: "report",
    component: ReportPageComponent,
    children: [
      { path: "student", component: StudentReportComponent },
      { path: "group", component: GroupReportComponent },
      { path: "studentDetails", component: StudentDetailComponent },
      { path: "professors", component: ProfessorsReportComponent },
      { path: "students", component: StudentsByGroupReportComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

export const routingComponents = [
  ScheduleComponent,
  LoginComponent,
  AttendancePageComponent,
  MenuPageComponent,
  GroupEditComponent,
  LessonEditComponent,
  SubjectEditComponent,
  StudEditComponent,
  SpecialityEditComponent,
  PositionEditComponent,
  ProfEditComponent,
  ChangePasswordComponent,
  EditorPageComponent,
  StudentReportComponent,
  StudentDetailComponent,
  GroupReportComponent,
  ProfessorsReportComponent,
  StudentsByGroupReportComponent,
  ReportPageComponent,
  AccountEditComponent,
];
