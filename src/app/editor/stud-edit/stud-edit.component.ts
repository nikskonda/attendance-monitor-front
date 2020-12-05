import { Component, Inject, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { PageEvent } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { ObjectRef } from "src/app/service/common.service";
import { GroupService, Volume } from "../../service/group.service";
import { AccountService, Person, Role } from "../../service/account.service";
import { RemoveDialogComponent } from "../remove-dialog/remove-dialog.component";
import {
  StudentService,
  StudentWithParent,
} from "src/app/service/student.service";

@Component({
  selector: "app-stud-edit",
  templateUrl: "./stud-edit.component.html",
  styleUrls: ["./stud-edit.component.scss"],
})
export class StudEditComponent implements OnInit {
  displayedColumns: string[] = [
    "edit",
    "remove",
    "position",
    "lastName",
    "firstName",
    "patronymic",
    "groupVolume",
    "email",
    "parentEmail",
  ];
  dataSource;
  length = 0;
  pageSize = 10;
  currentPage = 0;

  selected: StudentWithParent;
  isUpdate: boolean = false;
  studs: StudentWithParent[] = [];
  selectedGroupId: number;
  groups: ObjectRef[] = [];
  volumes: Volume[] = [];

  constructor(
    private studentService: StudentService,
    private groupService: GroupService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.groupService.getAll().subscribe((data) => (this.groups = data));
    this.groupService
      .getGroupVolumes()
      .subscribe(
        (data) => (this.volumes = data.filter((v) => v !== Volume.FULL))
      );
  }

  onGroupSelect(groupId: number) {
    this.selectedGroupId = groupId;
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
    this.studentService
      .getPage(this.selectedGroupId, this.currentPage, this.pageSize)
      .subscribe(
        (data) => {
          this.studs = data.content || [];
          this.length = data.totalElements;
        },
        (error) => console.log(error),
        () => {
          let newList = [];
          let i = this.currentPage * this.pageSize + 1;
          this.studs.forEach((s) => {
            newList.push({
              position: i++,
              id: s.id,
              lastName: s.lastName,
              firstName: s.firstName,
              patronymic: s.patronymic,
              fullName: s.fullName,
              email: s.email,
              parentEmail: s.parentEmail,
              groupVolume: s.groupVolume,
            });
          });
          this.dataSource = new MatTableDataSource(newList);
        }
      );
  }

  onSelectExisting(id: number) {
    this.selected = this.studs.find((s) => s.id === id);
    this.isUpdate = true;
    this.update();
  }

  clear() {
    this.selected = null;
    this.isUpdate = false;
  }

  create() {
    const dialogRef = this.dialog.open(StudEditorDialog, {
      data: {
        isUpdate: false,
        groups: this.groups,
        volumes: this.volumes,
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
    const dialogRef = this.dialog.open(StudEditorDialog, {
      data: {
        isUpdate: true,
        active: this.selected,
        groups: this.groups,
        volumes: this.volumes,
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
        this.studentService.delete(id).subscribe((data) => this.updateList());
        this.clear();
      }
    });
  }
}

@Component({
  templateUrl: "./stud-editor-dialog.html",
  styleUrls: ["./stud-edit.component.scss"],
})
export class StudEditorDialog implements OnInit {
  public isUpdate: boolean = false;
  emailExists: boolean = false;

  active: Person;

  fgc = new FormGroup({
    name: new FormControl(""),
    lastName: new FormControl("", [Validators.required]),
    patronymic: new FormControl(""),
    email: new FormControl("", [Validators.required, Validators.email]),
    group: new FormControl("", [Validators.required]),
    volume: new FormControl("FULL", [Validators.required]),
    parent: new FormControl("", [Validators.email]),
  });

  constructor(
    private studentService: StudentService,
    private accountService: AccountService,
    public dialogRef: MatDialogRef<StudEditorDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data.isUpdate) {
      this.active = data.active;
      this.fgc.controls.name.setValue(data.active.firstName);
      this.fgc.controls.lastName.setValue(data.active.lastName);
      this.fgc.controls.patronymic.setValue(data.active.patronymic);
      this.fgc.controls.email.setValue(data.active.email);
      this.fgc.controls.group.setValue(data.active.group.id);
      this.fgc.controls.volume.setValue(data.active.groupVolume);
      this.fgc.controls.parent.setValue(data.active.parentEmail);
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
    let stud: StudentWithParent = {
      id: null,
      email: this.fgc.value.email,
      firstName: this.fgc.value.name,
      lastName: this.fgc.value.lastName,
      patronymic: this.fgc.value.patronymic,
      fullName: null,
      phone: null,
      roles: [{ id: null, qualifier: "" + Role.STUDENT }],
      group: {
        id: this.fgc.value.group,
        qualifier: null,
      },
      groupVolume: this.fgc.value.volume,
      parentEmail: this.fgc.value.parent,
    };
    this.studentService.create(stud).subscribe((_) => this.close(true));
  }

  update() {
    let stud: StudentWithParent = {
      id: null,
      email: this.fgc.value.email,
      firstName: this.fgc.value.name,
      lastName: this.fgc.value.lastName,
      patronymic: this.fgc.value.patronymic,
      fullName: null,
      phone: null,
      roles: this.active.roles,
      group: {
        id: this.fgc.value.group,
        qualifier: null,
      },
      groupVolume: this.fgc.value.volume,
      parentEmail: this.fgc.value.parent,
    };
    this.studentService
      .update(this.active.id, stud)
      .subscribe((_) => this.close(true));
  }

  close(result: boolean): void {
    this.dialogRef.close(result);
  }
}
