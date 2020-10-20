import { Component, Inject, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { PageEvent } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Person, PersonService, Role } from "../../service/user.service";
import { RemoveDialogComponent } from "../remove-dialog/remove-dialog.component";

@Component({
  selector: "app-prof-edit",
  templateUrl: "./prof-edit.component.html",
  styleUrls: ["./prof-edit.component.css"],
})
export class ProfEditComponent implements OnInit {
  displayedColumns: string[] = [
    "position",
    "lastName",
    "firstName",
    "patronymic",
    "email",
    "edit",
    "remove",
  ];
  dataSource;
  length = 0;
  pageSize = 10;
  currentPage = 0;

  selected: Person;
  isUpdate: boolean = false;
  profs: Person[] = [];

  constructor(private personService: PersonService, public dialog: MatDialog) {}

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
    this.personService.getProfsPage(this.currentPage, this.pageSize).subscribe(
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
            position: i++,
            id: s.id,
            lastName: s.lastName,
            firstName: s.firstName,
            patronymic: s.patronymic,
            fullName: s.fullName,
            email: s.email,
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
  templateUrl: "./prof-editor-dialog.html",
  styleUrls: ["./prof-edit.component.css"],
})
export class ProfEditorDialog implements OnInit {
  public isUpdate: boolean = false;

  active: Person;

  fgc = new FormGroup({
    name: new FormControl(""),
    lastName: new FormControl("", [Validators.required]),
    patronymic: new FormControl(""),
    email: new FormControl("", [Validators.required, Validators.email]),
  });

  constructor(
    private personService: PersonService,
    public dialogRef: MatDialogRef<ProfEditorDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data.isUpdate) {
      this.active = data.active;
      this.fgc.controls.name.setValue(data.active.firstName);
      this.fgc.controls.last.setValue(data.active.lastName);
      this.fgc.controls.patronymic.setValue(data.active.patronymic);
      this.fgc.controls.email.setValue(data.active.email);
    }
    this.isUpdate = data.isUpdate;
  }
  ngOnInit(): void {}

  create() {
    let prof: Person = {
      id: null,
      email: this.fgc.value.email,
      firstName: this.fgc.value.name,
      lastName: this.fgc.value.last,
      patronymic: this.fgc.value.patronymic,
      fullName: null,
      roles: [Role.Professor],
    };
    this.personService.createProfessor(prof).subscribe((_) => this.close(true));
  }

  update() {
    let prof: Person = {
      id: null,
      email: this.fgc.value.email,
      firstName: this.fgc.value.name,
      lastName: this.fgc.value.last,
      patronymic: this.fgc.value.patronymic,
      fullName: null,
      roles: this.active.roles,
    };
    this.personService
      .updateProfessor(this.active.id, prof)
      .subscribe((_) => this.close(true));
  }

  close(result: boolean): void {
    this.dialogRef.close(result);
  }
}
