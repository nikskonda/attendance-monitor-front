import { Component, Inject, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import {
  getRoles,
  Person,
  AccountService,
  Role,
  User,
} from "src/app/service/account.service";

@Component({
  selector: "app-account-editor-dialog",
  templateUrl: "./account-editor-dialog.component.html",
  styleUrls: ["./account-editor-dialog.component.scss"],
})
export class AccountEditorDialogComponent implements OnInit {
  public isUpdate: boolean = false;

  active: Person;
  roles;
  selectedRoles = [];

  fgc = new FormGroup({
    name: new FormControl(""),
    lastName: new FormControl(""),
    patronymic: new FormControl(""),
    email: new FormControl("", [Validators.required]),
    phone: new FormControl(""),
  });

  constructor(
    private personService: AccountService,
    public dialogRef: MatDialogRef<AccountEditorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data && data.email) {
      this.personService.get(data.email).subscribe((person) => {
        this.active = person;
        console.log(this.active);
        this.fgc.controls.name.setValue(this.active.firstName);
        this.fgc.controls.lastName.setValue(this.active.lastName);
        this.fgc.controls.patronymic.setValue(this.active.patronymic);
        this.fgc.controls.email.setValue(this.active.email);
        this.fgc.controls.phone.setValue(this.active.phone);
        this.active.roles.forEach((x) => this.selectedRoles.push(x.qualifier));
      });
      this.isUpdate = true;
    }
  }

  ngOnInit(): void {
    this.roles = getRoles();
  }

  changeRoles(role: string) {
    const size = this.selectedRoles.length;
    this.selectedRoles = this.selectedRoles.filter((d) => d !== role);
    if (size === this.selectedRoles.length) this.selectedRoles.push(role);
  }

  isChecked(role: string): boolean {
    return this.selectedRoles.find((d) => d === role) !== undefined;
  }

  isEmptySelectedRole() {
    return this.selectedRoles.length === 0;
  }

  create() {
    let roles = [];
    this.selectedRoles.forEach((r) => roles.push({ id: null, qualifier: r }));
    let person: Person = {
      id: null,
      email: this.fgc.value.email,
      firstName: this.fgc.value.name,
      lastName: this.fgc.value.lastName,
      patronymic: this.fgc.value.patronymic,
      fullName: null,
      roles: roles,
      phone: this.fgc.value.phone,
    };
    this.personService.create(person).subscribe((_) => this.close(true));
  }

  update() {
    let roles = [];
    this.selectedRoles.forEach((r) => roles.push({ id: null, qualifier: r }));
    let user: Person = {
      id: null,
      email: this.fgc.value.email,
      firstName: this.fgc.value.name,
      lastName: this.fgc.value.lastName,
      patronymic: this.fgc.value.patronymic,
      fullName: null,
      roles: roles,
      phone: this.fgc.value.phone,
    };
    this.personService.update(user).subscribe((_) => this.close(true));
  }

  close(result: boolean): void {
    this.dialogRef.close(result);
  }
}
