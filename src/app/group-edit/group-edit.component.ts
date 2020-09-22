import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ObjectRef } from '../service/lesson.service';
import { Group, GroupService } from '../service/group.service';
import { SpecialityService } from '../service/speciality.service';

@Component({
  selector: 'app-group-edit',
  templateUrl: './group-edit.component.html',
  styleUrls: ['./group-edit.component.css']
})
export class GroupEditComponent implements OnInit {

  public selected: Group;
  public isUpdate: boolean = false;
  public groupList: Group[] = [];
  public specList: ObjectRef[] = [];

  constructor(private groupService: GroupService, private specService: SpecialityService) { }

  nameFormControl = new FormControl('', [
    Validators.required,
  ]);

  specFormControl = new FormControl('', Validators.required);

  ngOnInit() {
    this.updateList();
    this.specService.getAll().subscribe(data => this.specList = data);
  }

  updateList(){
    this.groupService.getAll().subscribe(data => this.groupList = data);
  }

  onSelectExisting(selected: Group){
    this.selected = selected;
    this.nameFormControl.setValue(this.selected.qualifier);
    this.specFormControl.setValue(this.selected.speciality.id);
    this.isUpdate = true;
  }

  clear(){
    this.nameFormControl = new FormControl('', Validators.required);
    this.specFormControl = new FormControl('', Validators.required);
    this.selected = null;
    this.isUpdate = false;
  }

  create(){
    let group = {
      id: null,
      qualifier:this.nameFormControl.value,
      speciality: {
        id: this.specFormControl.value,
        qualifier: null
      }
    };
    this.groupService.create(group).subscribe(data =>     this.updateList());
    this.clear();
  }

  update(){
    this.groupService.update(this.selected.id, 
      {
        id: null,
        qualifier:this.nameFormControl.value,
        speciality: {
          id: this.specFormControl.value,
          qualifier: null
        }
      }).subscribe(data =>  this.updateList());
    this.clear();
  }

  remove(spec: Group) {
    this.groupService.delete(spec.id).subscribe(data => this.updateList());
    this.clear();
  }

}
