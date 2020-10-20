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
import { GroupService } from "../../service/group.service";
import {
  Person,
  PersonService,
  Role,
  Student,
} from "../../service/user.service";
import { RemoveDialogComponent } from "../remove-dialog/remove-dialog.component";

@Component({
  selector: "app-stud-edit",
  templateUrl: "./stud-edit.component.html",
  styleUrls: ["./stud-edit.component.css"],
})
export class StudEditComponent implements OnInit {
  displayedColumns: string[] = [
    "position",
    "lastName",
    "firstName",
    "patronymic",
    "email",
    "group",
    "edit",
    "remove",
  ];
  dataSource;
  length = 0;
  pageSize = 10;
  currentPage = 0;

  selected: Student;
  isUpdate: boolean = false;
  studs: Student[] = [];
  selectedGroupId: number;
  groups: ObjectRef[] = [];

  constructor(
    private personService: PersonService,
    private groupService: GroupService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.groupService.getAll().subscribe((data) => (this.groups = data));
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
    this.personService
      .getStudentsPage(this.selectedGroupId, this.currentPage, this.pageSize)
      .subscribe(
        (data) => {
          this.studs = data.content || [];
          console.log(data);
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
              group: s.group.qualifier,
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
        this.personService
          .deletePerson(id)
          .subscribe((data) => this.updateList());
        this.clear();
      }
    });
  }
}

@Component({
  templateUrl: "./stud-editor-dialog.html",
  styleUrls: ["./stud-edit.component.css"],
})
export class StudEditorDialog implements OnInit {
  public isUpdate: boolean = false;

  active: Person;

  fgc = new FormGroup({
    name: new FormControl(""),
    lastName: new FormControl("", [Validators.required]),
    patronymic: new FormControl(""),
    email: new FormControl("", [Validators.required, Validators.email]),
    group: new FormControl("", [Validators.required]),
  });

  constructor(
    private personService: PersonService,
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
    }
    this.isUpdate = data.isUpdate;
  }
  ngOnInit(): void {}

  create() {
    let stud: Student = {
      id: null,
      email: this.fgc.value.email,
      firstName: this.fgc.value.name,
      lastName: this.fgc.value.lastName,
      patronymic: this.fgc.value.patronymic,
      fullName: null,
      roles: [Role.Student],
      group: {
        id: this.fgc.value.group,
        qualifier: null,
        speciality: null,
      },
    };
    this.personService.createStudent(stud).subscribe((_) => this.close(true));
  }

  update() {
    let stud: Student = {
      id: null,
      email: this.fgc.value.email,
      firstName: this.fgc.value.name,
      lastName: this.fgc.value.lastName,
      patronymic: this.fgc.value.patronymic,
      fullName: null,
      roles: [Role.Student],
      group: {
        id: this.fgc.value.group,
        qualifier: null,
        speciality: null,
      },
    };
    this.personService
      .updateStudent(this.active.id, stud)
      .subscribe((_) => this.close(true));
  }

  close(result: boolean): void {
    this.dialogRef.close(result);
  }
}
