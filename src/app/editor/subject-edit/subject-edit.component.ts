import { ThrowStmt } from "@angular/compiler";
import { Component, Inject, Input, OnInit, ViewChild } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { PageEvent } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { ObjectRef } from "../../service/common.service";
import { SubjectService } from "../../service/subject.service";
import { RemoveDialogComponent } from "../remove-dialog/remove-dialog.component";

@Component({
  selector: "app-subject-edit",
  templateUrl: "./subject-edit.component.html",
  styleUrls: ["./subject-edit.component.scss"],
})
export class SubjectEditComponent implements OnInit {
  displayedColumns: string[] = ["edit", "remove", "position", "name"];
  dataSource;
  length = 0;
  pageSize = 10;
  currentPage = 0;

  public active: ObjectRef;
  public isUpdate: boolean = false;
  public subjectList: ObjectRef[] = [];

  constructor(
    private subjectService: SubjectService,
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
    this.subjectService.getPage(this.currentPage, this.pageSize).subscribe(
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
    const dialogRef = this.dialog.open(SubjectEditorDialog, {
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
    const dialogRef = this.dialog.open(SubjectEditorDialog, {
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
        name: name,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.subjectService.delete(id).subscribe((data) => this.updateList());
        this.clear();
      }
    });
  }
}

@Component({
  templateUrl: "./editor-dialog.html",
})
export class SubjectEditorDialog {
  public isUpdate: boolean = false;
  active: ObjectRef;

  nameFormControl = new FormControl("", [
    Validators.required,
    Validators.maxLength(100),
  ]);

  constructor(
    private subjectService: SubjectService,
    public dialogRef: MatDialogRef<SubjectEditorDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data.isUpdate) {
      this.active = data.active;
      this.nameFormControl.setValue(data.active.qualifier);
    }
    this.isUpdate = data.isUpdate;
  }

  create() {
    this.subjectService
      .create({ id: null, qualifier: this.nameFormControl.value })
      .subscribe((_) => this.close(true));
  }

  update() {
    this.subjectService
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
