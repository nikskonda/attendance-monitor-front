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
import { PositionService } from "src/app/service/position.service";
import { ObjectRef } from "src/app/service/common.service";
import { RemoveDialogComponent } from "../remove-dialog/remove-dialog.component";
import { AlertComponent } from "../alert/alert.component";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-position-edit",
  templateUrl: "./position-edit.component.html",
  styleUrls: ["./position-edit.component.scss"],
})
export class PositionEditComponent implements OnInit {
  displayedColumns: string[] = ["edit", "remove", "position", "name"];
  dataSource;
  length = 0;
  pageSize = 10;
  currentPage = 0;

  public active: ObjectRef;
  public isUpdate: boolean = false;
  public subjectList: ObjectRef[] = [];

  constructor(
    private posService: PositionService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
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
    this.posService.getPage(this.currentPage, this.pageSize).subscribe(
      (data) => {
        this.subjectList = data.content;
        this.length = data.totalElements;
      },
      (error) => console.log(error),
      () => {
        let newList = [];
        let i = this.currentPage * this.pageSize + 1;
        this.subjectList.forEach((s) => {
          newList.push({ position: i++, id: s.id, name: s.qualifier });
        });
        this.dataSource = new MatTableDataSource(newList);
      }
    );
  }

  clear() {
    this.active = null;
    this.isUpdate = false;
  }

  create() {
    const dialogRef = this.dialog.open(PositionEditorDialog, {
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

  update(id: number) {
    this.active = this.subjectList.find((s) => s.id === id);
    this.isUpdate = true;
    const dialogRef = this.dialog.open(PositionEditorDialog, {
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
        name: `Вы уверены, что хотите удалить должность: ${name}?`,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.posService.delete(id).subscribe(
          (data) => this.updateList(),
          (error) => {
            this.snackBar.openFromComponent(AlertComponent, {
              data: {
                text: error.error?.message,
              },
              duration: 5000,
            });
          }
        );
        this.clear();
      }
    });
  }
}

@Component({
  templateUrl: "./position-editor-dialog.html",
})
export class PositionEditorDialog {
  public isUpdate: boolean = false;
  active: ObjectRef;

  nameFormControl = new FormControl("", [
    Validators.required,
    Validators.maxLength(100),
  ]);

  constructor(
    @Inject(L10N_LOCALE) public locale: L10nLocale,
    private adService: PositionService,
    public dialogRef: MatDialogRef<PositionEditorDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data.isUpdate) {
      this.active = data.active;
      this.nameFormControl.setValue(data.active.qualifier);
    }
    this.isUpdate = data.isUpdate;
  }

  create() {
    this.adService
      .create({ id: null, qualifier: this.nameFormControl.value })
      .subscribe((_) => this.close(true));
  }

  update() {
    this.adService
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
