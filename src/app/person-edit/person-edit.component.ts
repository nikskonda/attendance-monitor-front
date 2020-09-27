import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { GroupService } from '../service/group.service';
import { ObjectRef } from '../service/lesson.service';
import { Person, PersonService, Student } from '../service/user.service';

@Component({
  selector: 'app-person-edit',
  templateUrl: './person-edit.component.html',
  styleUrls: ['./person-edit.component.css']
})
export class PersonEditComponent implements OnInit {

  selectedValue: number;

  selected: Person;
  isUpdate: boolean = false;

  studs: Person[] = [];
  groups: ObjectRef[] = [];

  nameFormControl= new FormControl('', [Validators.required]);
  lastNameFormControl= new FormControl('', [Validators.required]);
  patronymicFormControl= new FormControl('', [Validators.required]);
  emailFormControl= new FormControl('', [Validators.required, Validators.email]);
  groupFormControl= new FormControl('', [Validators.required]);

  constructor(
    private personService: PersonService,
    private groupService: GroupService ) { }

  ngOnInit() {
    this.groupService.getAll().subscribe(data => {
      data.forEach(ref => this.groups.push(ref));
      console.log(this.groups);
    });
  }

  onGroupSelect(groupId: number){
    this.personService.getStudents(groupId).subscribe(data => this.studs = data);
  }

  onSelectExisting(selected: Person){
    this.selected = selected;
    this.nameFormControl.setValue(this.selected.firstName);
    this.lastNameFormControl.setValue(this.selected.lastName);
    this.patronymicFormControl.setValue(this.selected.patronymic);
    this.emailFormControl.setValue(this.selected.email);
    this.groupFormControl.setValue(this.selectedValue);
    this.isUpdate = true;
  }

  clear(){
    this.nameFormControl.reset();
    this.lastNameFormControl.reset();
    this.patronymicFormControl.reset();
    this.emailFormControl.reset();
    this.groupFormControl.reset();
    
    this.selected = null;
    this.isUpdate = false;
  }

  create(){
    let stud: Student =  {
      id: null,
      email: this.emailFormControl.value,
      firstName: this.nameFormControl.value,
      lastName: this.lastNameFormControl.value,
      patronymic: this.patronymicFormControl.value,
      fullName: null,
      roles: ["STUDENT"],
      group: {id: this.groupFormControl.value, qualifier: null, speciality: null}
    };
    this.personService.createStudent(stud).subscribe(data => this.onGroupSelect(this.selectedValue));
    this.clear();
  }

  update(){
    let stud: Student =  {
      id: null,
      email: this.emailFormControl.value,
      firstName: this.nameFormControl.value,
      lastName: this.lastNameFormControl.value,
      patronymic: this.patronymicFormControl.value,
      fullName: null,
      roles: this.selected.roles,
      group: {id: this.groupFormControl.value, qualifier: null, speciality: null}
    };
    this.personService.updateStudent(this.selected.id, stud).subscribe(data => this.onGroupSelect(this.selectedValue));
    this.clear();
  }

  remove(stud: Student) {
    this.personService.deleteStudent(stud.id).subscribe(data => this.onGroupSelect(this.selectedValue));
    this.clear();
  }
}
