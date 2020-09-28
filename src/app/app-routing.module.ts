import { ScheduleComponent } from './schedule/schedule.component';
import { NgModule, OnInit, Component } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AttendancePageComponent } from './attendance-page/attendance-page.component';
import { MenuPageComponent } from './menu-page/menu-page.component';
import { GroupEditComponent } from './group-edit/group-edit.component';
import { LessonEditComponent } from './lesson-edit/lesson-edit.component';
import { SubjectEditComponent } from './subject-edit/subject-edit.component';
import { PersonEditComponent } from './person-edit/person-edit.component';
import { SpecialityEditComponent } from './speciality-edit/speciality-edit.component';
import { PdfCreatorComponent } from './pdf-creator/pdf-creator.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent},
  { path: 'schedule', component: ScheduleComponent},
  { path: 'attendance', component: AttendancePageComponent},
  { path: 'menu', component: MenuPageComponent},
  { path: 'edit/speciality', component: SpecialityEditComponent},
  { path: 'edit/group', component: GroupEditComponent},
  { path: 'edit/person', component: PersonEditComponent},
  { path: 'edit/subject', component: SubjectEditComponent},
  { path: 'edit/lesson', component: LessonEditComponent},
  { path: 'report/pdf', component: PdfCreatorComponent},


]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const routingComponents = [
        LoginComponent,
        ScheduleComponent,
        AttendancePageComponent,
        MenuPageComponent,
        SpecialityEditComponent,
        GroupEditComponent, 
        PersonEditComponent, 
        SubjectEditComponent, 
        LessonEditComponent, 
        PdfCreatorComponent,

      ];


