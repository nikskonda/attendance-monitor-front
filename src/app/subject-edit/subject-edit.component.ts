import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ObjectRef } from '../service/lesson.service';
import { SubjectService } from '../service/subject.service';

@Component({
  selector: 'app-subject-edit',
  templateUrl: './subject-edit.component.html',
  styleUrls: ['./subject-edit.component.css']
})
export class SubjectEditComponent implements OnInit {

  public active: ObjectRef;
  public isUpdate: boolean = false;
  public subjectList: ObjectRef[] = [];

  constructor(private subjectService: SubjectService) { }

  nameFormControl = new FormControl('', [
    Validators.required,
  ]);

  ngOnInit() {
    this.updateList();
  }

  updateList(){
    this.subjectService.getAll().subscribe(data => this.subjectList = data);
  }

  onSelectExisting(selected: ObjectRef){
    this.active = selected;
    this.nameFormControl.setValue(this.active.qualifier);
    this.isUpdate = true;
  }

  clear(){
    this.nameFormControl = new FormControl('', [
      Validators.required,
    ]);
    this.active = null;
    this.isUpdate = false;
  }

  create(){
    this.subjectService.create({id: null, qualifier:this.nameFormControl.value}).subscribe(data =>     this.updateList());
    this.clear();
  }

  update(){
    this.subjectService.update(this.active.id, {id: null, qualifier:this.nameFormControl.value}).subscribe(data =>  this.updateList());
    this.clear();
  }

  remove(spec: ObjectRef) {
    this.subjectService.delete(spec.id).subscribe(data => this.updateList());
    this.clear();
  }

}
