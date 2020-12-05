import { Component, Inject, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Group, GroupService } from "../../service/group.service";
import { SpecialityService } from "../../service/speciality.service";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { PageEvent } from "@angular/material/paginator";
import { RemoveDialogComponent } from "../remove-dialog/remove-dialog.component";
import { ObjectRef } from "src/app/service/common.service";

@Component({
  selector: "app-group-edit",
  templateUrl: "./group-edit.component.html",
  styleUrls: ["./group-edit.component.scss"],
})
export class GroupEditComponent implements OnInit {
  displayedColumns: string[] = [
    "edit",
    "remove",
    "position",
    "name",
    "speciality",
  ];
  dataSource;
  length = 0;
  pageSize = 10;
  currentPage = 0;

  public selected: Group;
  public isUpdate: boolean = false;
  public groupList: Group[] = [];
  public specList: ObjectRef[] = [];

  constructor(private groupService: GroupService, public dialog: MatDialog) {}

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
    this.groupService.getPage(this.currentPage, this.pageSize).subscribe(
      (data) => {
        this.groupList = data.content;
        this.length = data.totalElements;
      },
      (error) => console.log(error),
      () => {
        let newList = [];
        let i = this.currentPage * this.pageSize + 1;
        this.groupList.forEach((s) => {
          newList.push({
            position: i++,
            id: s.id,
            name: s.qualifier,
            speciality: s.speciality.qualifier,
          });
        });
        this.dataSource = new MatTableDataSource(newList);
      }
    );
  }

  onSelectExisting(id: number) {
    this.selected = this.groupList.find((s) => s.id === id);
    this.isUpdate = true;
    this.update();
  }

  clear() {
    this.selected = null;
    this.isUpdate = false;
  }

  create() {
    const dialogRef = this.dialog.open(GroupEditorDialog, {
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
    const dialogRef = this.dialog.open(GroupEditorDialog, {
      data: {
        isUpdate: true,
        active: this.selected,
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
        this.groupService.delete(id).subscribe((data) => this.updateList());
        this.clear();
      }
    });
  }
}

@Component({
  templateUrl: "./group-editor-dialog.html",
  styleUrls: ["./group-edit.component.scss"],
})
export class GroupEditorDialog implements OnInit {
  public isUpdate: boolean = false;
  active: Group;

  fgc = new FormGroup({
    name: new FormControl("", [
      Validators.required,
      Validators.maxLength(8),
      Validators.maxLength(8),
    ]),
    spec: new FormControl("", Validators.required),
  });

  specList: ObjectRef[] = [];

  constructor(
    private specService: SpecialityService,
    private groupService: GroupService,
    public dialogRef: MatDialogRef<GroupEditorDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data.isUpdate) {
      this.active = data.active;
      this.fgc.controls.name.setValue(data.active.qualifier);
      this.fgc.controls.spec.setValue(data.active.speciality.id);
    }
    this.isUpdate = data.isUpdate;
  }
  ngOnInit(): void {
    this.specService.getAll().subscribe((data) => (this.specList = data));
  }

  create() {
    let group = {
      id: null,
      qualifier: this.fgc.value.name,
      speciality: {
        id: this.fgc.value.spec,
        qualifier: null,
      },
    };
    this.groupService.create(group).subscribe((_) => this.close(true));
  }

  update() {
    this.groupService
      .update(this.active.id, {
        id: null,
        qualifier: this.fgc.value.name,
        speciality: {
          id: this.fgc.value.spec,
          qualifier: null,
        },
      })
      .subscribe((_) => this.close(true));
  }

  close(result: boolean): void {
    this.dialogRef.close(result);
  }
}
