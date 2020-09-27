import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { GroupService } from '../service/group.service';
import { Lesson, LessonService, LessonTime, ObjectRef } from '../service/lesson.service';
import { SubjectService } from '../service/subject.service';
import { Person, PersonService } from '../service/user.service';

@Component({
  selector: 'app-lesson-edit',
  templateUrl: './lesson-edit.component.html',
  styleUrls: ['./lesson-edit.component.css']
})
export class LessonEditComponent implements OnInit {

  dateForListFormControl = new FormControl((new Date()).toISOString());

  dateFormControl = new FormControl((new Date()).toISOString(), [Validators.required]);
  timeFormControl = new FormControl({}, [Validators.required]);
  subjectFormControl = new FormControl('', [Validators.required]);
  subjectTypeFormControl = new FormControl('', [Validators.required]);
  profFormControl = new FormControl('', [Validators.required]);
  groupFormControl = new FormControl('', [Validators.required]);

  times: LessonTime[] = [];
  subjects: ObjectRef[] = [];
  subjectTypes: string[] = [];
  profs: Person[] = [];
  groups: ObjectRef[] = [];

  lessons: Lesson[] = [];
  selected: Lesson;
  isUpdate: boolean = false;


  constructor(private personService: PersonService,
    private lessonService: LessonService,
    private subjectService: SubjectService,
    private groupService: GroupService) { }

  ngOnInit() {
    this.lessonService.getLessonTimes().subscribe(data => this.times = data);
    this.personService.getProfs().subscribe(data => this.profs = data);
    this.groupService.getAll().subscribe(data => this.groups = data);
    this.subjectService.getAll().subscribe(data => this.subjects = data);
    this.subjectService.getTypes().subscribe(data => this.subjectTypes = data);
  }

  clear() {
    this.dateFormControl.reset();
    this.timeFormControl.reset();
    this.subjectFormControl.reset();
    this.subjectTypeFormControl.reset();
    this.profFormControl.reset();
    this.groupFormControl.reset();

    this.selected = null;
    this.isUpdate = false;
  }

  create() {
    const date:Date = this.dateFormControl.value
    date.setMinutes(-date.getTimezoneOffset());

    let toCreate: Lesson = {
      id: null,
      date: date.toISOString().substring(0, 10),
      time: this.times.find(t => t.id===this.timeFormControl.value),
      subject:  {id: this.subjectFormControl.value, qualifier: null},
      subjectType: this.subjectTypeFormControl.value,
      professor: {id: this.profFormControl.value, qualifier: null},
      group: {id: this.groupFormControl.value, qualifier: null}
    };
    this.lessonService.create(toCreate).subscribe(data => {
      this.clear();
      this.selectDate();});
  }

  remove(l: Lesson) {
    this.lessonService.remove(l.id).subscribe(data => {this.clear(); this.selectDate();});
  }

  selectDate(){
    const date:Date = this.dateForListFormControl.value
    date.setMinutes(-date.getTimezoneOffset());
    this.lessonService.getLessonsForDate(date.toISOString().substring(0, 10)).subscribe(data => this.lessons = data)
  }

  onSelectExisting(selected: Lesson){
    this.selected = selected;
    this.dateFormControl.setValue(this.selected.date);
    this.timeFormControl.setValue(this.selected.time.id);
    this.subjectFormControl.setValue(this.selected.subject.id);
    this.subjectTypeFormControl.setValue(this.selected.subjectType);
    this.profFormControl.setValue(this.selected.professor.id);
    this.groupFormControl.setValue(this.selected.group.id);

    this.isUpdate = true;
  }

  update(){
    const date:Date = this.dateFormControl.value
    date.setMinutes(-date.getTimezoneOffset());

    let toUpdate: Lesson = {
      id: null,
      date: date.toISOString().substring(0, 10),
      time: this.times.find(t => t.id===this.timeFormControl.value),
      subject:  {id: this.subjectFormControl.value, qualifier: null},
      subjectType: this.subjectTypeFormControl.value,
      professor: {id: this.profFormControl.value, qualifier: null},
      group: {id: this.groupFormControl.value, qualifier: null}
    };
    this.lessonService.update(this.selected.id, toUpdate).subscribe(data => {
      this.selectDate();
      this.clear();
    });
  }




}
