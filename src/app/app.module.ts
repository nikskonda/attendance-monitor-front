import { BasicAuthHtppInterceptorService } from "./service/basic-auth-http-interceptor.service";
import { AppRoutingModule, routingComponents } from "./app-routing.module";
import { CommonModule, registerLocaleData } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { LOCALE_ID, NgModule } from "@angular/core";

import { AppComponent } from "./app.component";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

import { GridCellComponent } from "./grid-cell/grid-cell.component";
import { GridHeaderComponent } from "./grid-header/grid-header.component";
import { GroupReportComponent } from "./report/group-report/group-report.component";
import { StudentReportComponent } from "./report/student-report/student-report.component";
import { CurrentAccoutComponent } from "./loginUser/current-accout/current-accout.component";

import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatBadgeModule } from "@angular/material/badge";
import { MatBottomSheetModule } from "@angular/material/bottom-sheet";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatChipsModule } from "@angular/material/chips";
import { MatStepperModule } from "@angular/material/stepper";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatNativeDateModule, MatRippleModule } from "@angular/material/core";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSliderModule } from "@angular/material/slider";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatTreeModule } from "@angular/material/tree";
import { EditorPageComponent } from "./editor/editor-page/editor-page.component";
import { ReportPageComponent } from "./report/report-page/report-page.component";
import { StudentDetailComponent } from "./report/student-detail/student-detail.component";
import { RemoveDialogComponent } from "./editor/remove-dialog/remove-dialog.component";
import { SubjectEditorDialog } from "./editor/subject-edit/subject-edit.component";
import { SpecEditorDialog } from "./editor/speciality-edit/speciality-edit.component";
import { GroupEditorDialog } from "./editor/group-edit/group-edit.component";
import { ProfEditorDialog } from "./editor/prof-edit/prof-edit.component";
import { StudEditorDialog } from "./editor/stud-edit/stud-edit.component";
import { LessonEditorDialog } from "./editor/lesson-edit/lesson-edit.component";
import { DigitOnlyDirective } from "./directive/digit-only.directive";
import localeRu from "@angular/common/locales/ru";

registerLocaleData(localeRu);

@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    GridCellComponent,
    GridHeaderComponent,
    GroupReportComponent,
    StudentReportComponent,
    CurrentAccoutComponent,
    EditorPageComponent,
    ReportPageComponent,
    StudentDetailComponent,
    RemoveDialogComponent,
    SubjectEditorDialog,
    SpecEditorDialog,
    GroupEditorDialog,
    ProfEditorDialog,
    StudEditorDialog,
    LessonEditorDialog,
    DigitOnlyDirective,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BasicAuthHtppInterceptorService,
      multi: true,
    },
    { provide: LOCALE_ID, useValue: "ru" },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
