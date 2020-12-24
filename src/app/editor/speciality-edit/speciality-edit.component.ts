import { Component, Inject, OnInit } from "@angular/core";
import { L10nLocale, L10N_LOCALE } from "angular-l10n";
import { FormControl, Validators } from "@angular/forms";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { PageEvent } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { ObjectRef } from "src/app/service/common.service";
import { SpecialityService } from "../../service/speciality.service";
import { RemoveDialogComponent } from "../remove-dialog/remove-dialog.component";

@Component({
  selector: "app-speciality-edit",
  templateUrl: "./speciality-edit.component.html",
  styleUrls: ["./speciality-edit.component.scss"],
})
export class SpecialityEditComponent implements OnInit {
  displayedColumns: string[] = ["edit", "remove", "position", "name"];
  dataSource;
  length = 0;
  pageSize = 10;
  currentPage = 0;

  public active: ObjectRef;
  public isUpdate: boolean = false;
  public specList: ObjectRef[] = [];

  constructor(
    @Inject(L10N_LOCALE) public locale: L10nLocale,
    private specService: SpecialityService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
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
    this.specService.getPage(this.currentPage, this.pageSize).subscribe(
      (data) => {
        this.specList = data.content;
        this.length = data.totalElements;
      },
      (error) => console.log(error),
      () => {
        let newList = [];
        let i = this.currentPage * this.pageSize + 1;
        this.specList.forEach((s) => {
          newList.push({ position: i++, id: s.id, name: s.qualifier });
        });
        this.dataSource = new MatTableDataSource(newList);
      }
    );
  }

  onSelectExisting(id: number) {
    this.active = this.specList.find((s) => s.id === id);
    this.isUpdate = true;
    this.update();
  }

  clear() {
    this.active = null;
    this.isUpdate = false;
  }

  create() {
    const dialogRef = this.dialog.open(SpecEditorDialog, {
      data: {
        isUpdate: false,
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
    const dialogRef = this.dialog.open(SpecEditorDialog, {
      data: {
        isUpdate: true,
        active: this.active,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.updateList();
        this.clear();
      }
    });
  }

  remove(id: number, name: string) {
    const dialogRef = this.dialog.open(RemoveDialogComponent, {
      data: {
        name: `Вы уверены, что хотите удалить специальность: ${name}?`,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.specService.delete(id).subscribe((data) => this.updateList());
        this.clear();
      }
    });
  }
}

@Component({
  selector: "spec-editor-dialog",
  templateUrl: "./spec-editor-dialog.html",
  styleUrls: ["./speciality-edit.component.scss"],
})
export class SpecEditorDialog {
  public isUpdate: boolean = false;
  active: ObjectRef;
  nameFormControl = new FormControl("", [
    Validators.required,
    Validators.maxLength(10),
  ]);

  constructor(
    @Inject(L10N_LOCALE) public locale: L10nLocale,
    private specialityService: SpecialityService,
    public dialogRef: MatDialogRef<SpecEditorDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data.isUpdate) {
      this.active = data.active;
      this.nameFormControl.setValue(data.active.qualifier);
    }
    this.isUpdate = data.isUpdate;
  }

  create() {
    this.specialityService
      .create({ id: null, qualifier: this.nameFormControl.value })
      .subscribe((_) => this.close(true));
  }

  update() {
    this.specialityService
      .update(this.active.id, {
        id: null,
        qualifier: this.nameFormControl.value,
      })
      .subscribe((_) => this.close(true));
  }

  close(result: boolean): void {
    this.dialogRef.close(result);
  }
}
