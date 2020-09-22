import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ObjectRef } from '../service/lesson.service';
import { SpecialityService } from '../service/speciality.service';

@Component({
  selector: 'app-speciality-edit',
  templateUrl: './speciality-edit.component.html',
  styleUrls: ['./speciality-edit.component.css']
})
export class SpecialityEditComponent implements OnInit {

  public active: ObjectRef;
  public isUpdate: boolean = false;
  public specList: ObjectRef[] = [];

  constructor(private specService: SpecialityService) { }

  nameFormControl = new FormControl('', [
    Validators.required,
  ]);

  ngOnInit() {
    this.updateList();
  }

  updateList(){
    this.specService.getAll().subscribe(data => this.specList = data);
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
    this.specService.create({id: null, qualifier:this.nameFormControl.value}).subscribe(data =>     this.updateList());
    this.clear();
  }

  update(){
    this.specService.update(this.active.id, {id: null, qualifier:this.nameFormControl.value}).subscribe(data =>  this.updateList());
    this.clear();
  }

  remove(spec: ObjectRef) {
    this.specService.delete(spec.id).subscribe(data => this.updateList());
    this.clear();
  }

}
