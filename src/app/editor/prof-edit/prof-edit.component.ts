import { Component, Inject, OnInit } from "@angular/core";
import { L10nLocale, L10N_LOCALE } from "angular-l10n";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { PageEvent } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { PositionService } from "src/app/service/position.service";
import { ObjectRef } from "src/app/service/common.service";
import { RemoveDialogComponent } from "../remove-dialog/remove-dialog.component";
import { Professor, ProfessorService } from "src/app/service/professor.service";
import { AccountService, Role } from "src/app/service/account.service";

@Component({
  selector: "app-prof-edit",
  templateUrl: "./prof-edit.component.html",
  styleUrls: ["./prof-edit.component.scss"],
})
export class ProfEditComponent implements OnInit {
  displayedColumns: string[] = [
    "edit",
    "remove",
    "position",
    "fullName",
    // "lastName",
    // "firstName",
    // "patronymic",
    "jobPosition",
    "email",
    "phone",
  ];
  dataSource;
  length = 0;
  pageSize = 10;
  currentPage = 0;

  selected: Professor;
  isUpdate: boolean = false;
  profs: Professor[] = [];

  positions: ObjectRef[] = [];

  constructor(
    @Inject(L10N_LOCALE) public locale: L10nLocale,
    private profService: ProfessorService,
    private positionService: PositionService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.positionService.getAll().subscribe((data) => (this.positions = data));
    this.updateList();
  }

  updateList(event?: PageEvent) {
    if (event) {
      if (this.pageSize !== event.pageSize) {
        this.pageSize = event.pageSize;
        this.currentPage = 0;
      } else {
        this.currentPage = event.pageIndex;
      }
    }
    this.profService.getPage(this.currentPage, this.pageSize).subscribe(
      (data) => {
        this.profs = data.content;
        this.length = data.totalElements;
      },
      (error) => console.log(error),
      () => {
        let newList = [];
        let i = this.currentPage * this.pageSize + 1;
        this.profs.forEach((s) => {
          newList.push({
            pos: i++,
            id: s.id,
            lastName: s.lastName,
            firstName: s.firstName,
            patronymic: s.patronymic,
            fullName: s.fullName,
            position: s.position.qualifier,
            email: s.email,
            phone: s.phone,
          });
        });
        this.dataSource = new MatTableDataSource(newList);
      }
    );
  }

  onSelectExisting(id: number) {
    this.selected = this.profs.find((s) => s.id === id);
    this.isUpdate = true;
    this.update();
  }

  clear() {
    this.selected = null;
    this.isUpdate = false;
  }

  create() {
    const dialogRef = this.dialog.open(ProfEditorDialog, {
      data: {
        isUpdate: false,
        positions: this.positions,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.updateList();
        this.clear();
      }
    });
  }

  update() {
    const dialogRef = this.dialog.open(ProfEditorDialog, {
      data: {
        isUpdate: true,
        active: this.selected,
        positions: this.positions,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.updateList();
        this.clear();
      }
    });
  }

  remove(id: number, name: string, email: string) {
    const dialogRef = this.dialog.open(RemoveDialogComponent, {
      data: {
        name: `Вы уверены, что хотите удалить преподавателя: ${name} (${email})?`,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.profService.delete(id).subscribe((data) => this.updateList());
        this.clear();
      }
    });
  }
}

@Component({
  templateUrl: "./prof-editor-dialog.html",
  styleUrls: ["./prof-edit.component.scss"],
})
export class ProfEditorDialog implements OnInit {
  public isUpdate: boolean = false;

  emailExists: boolean = false;

  active: Professor;

  fgc = new FormGroup({
    name: new FormControl("", [Validators.required]),
    lastName: new FormControl("", [Validators.required]),
    patronymic: new FormControl(""),
    email: new FormControl("", [Validators.required, Validators.email]),
    position: new FormControl("", [Validators.required]),
    phone: new FormControl("", [
      Validators.required,
      Validators.pattern(
        `[0-9]{9}|[(][0-9]{2}[)][\\s][0-9]{3}[-][0-9]{2}[-][0-9]{2}`
      ),
    ]),
  });

  constructor(
    @Inject(L10N_LOCALE) public locale: L10nLocale,
    private profService: ProfessorService,
    private accountService: AccountService,
    public dialogRef: MatDialogRef<ProfEditorDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data.isUpdate) {
      this.active = data.active;
      this.fgc.controls.name.setValue(data.active.firstName);
      this.fgc.controls.lastName.setValue(data.active.lastName);
      this.fgc.controls.patronymic.setValue(data.active.patronymic);
      this.fgc.controls.email.setValue(data.active.email);
      this.fgc.controls.position.setValue(data.active.position.id);
      this.fgc.controls.phone.setValue(data.active.phone);
    }
    this.isUpdate = data.isUpdate;
  }
  ngOnInit(): void {}

  isUniqueEmail() {
    if (!this.isUpdate && this.fgc.controls.email.valid) {
      this.accountService
        .isUniqueEmail(this.fgc.value.email)
        .subscribe((data) => (this.emailExists = !data));
    }
  }

  create() {
    let prof: Professor = {
      id: null,
      email: this.fgc.value.email,
      firstName: this.fgc.value.name,
      lastName: this.fgc.value.lastName,
      patronymic: this.fgc.value.patronymic,
      fullName: null,
      roles: [{ id: null, qualifier: "" + Role.PROFESSOR }],
      position: this.fgc.value.position,
      phone: this.fgc.value.phone,
      shortName: null,
    };
    this.profService.create(prof).subscribe((_) => this.close(true));
  }

  update() {
    let prof: Professor = {
      id: null,
      email: this.fgc.value.email,
      firstName: this.fgc.value.name,
      lastName: this.fgc.value.lastName,
      patronymic: this.fgc.value.patronymic,
      fullName: null,
      roles: this.active.roles,
      position: this.fgc.value.position,
      phone: this.fgc.value.phone,
      shortName: null,
    };
    this.profService
      .update(this.active.id, prof)
      .subscribe((_) => this.close(true));
  }

  close(result: boolean): void {
    this.dialogRef.close(result);
  }
}
