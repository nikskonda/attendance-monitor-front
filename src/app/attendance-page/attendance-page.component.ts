import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AttCell, AttendanceService } from '../service/attendance.service';
import { ObjectRef } from '../service/lesson.service';

@Component({
  selector: 'app-attendance-page',
  templateUrl: './attendance-page.component.html',
  styleUrls: ['./attendance-page.component.css']
})
export class AttendancePageComponent implements OnInit {

  att: AttCell[] = [];

  cols: number = 0;

  group: ObjectRef;
  subject: ObjectRef;

  groupId: number;
  subjectId: number;
  subjectTypes: string[] = [];

  selectedValue: string = '';

  listToSave: AttCell[] = [];


  constructor(
    private router: Router,
    private attService: AttendanceService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.groupId = params['groupId'];
      this.subjectId = params['subjectId'];
      this.subjectTypes = params['subjectTypes'];
    });

    var curr = new Date();
    var firstday = new Date(curr.setDate(curr.getDate() - curr.getDay()));
    var lastday = new Date(curr.setDate(curr.getDate() - curr.getDay() + 6));


    this.attService.getAttendance(firstday.toISOString().substring(0, 10), lastday.toISOString().substring(0, 10), this.groupId, this.subjectId, ['LECTURE', 'PRACTICE', 'LAB'])
    .subscribe(data => {
      this.att=data.cells;
      this.cols = data.cols;
      this.group = data.group;
      this.subject = data.subject;
    });
  }

  setValue(value: number, cell: AttCell){
    cell.text = value.toString();
    let found = this.listToSave.find(c => c.lesson.id === cell.lesson.id && c.person.id === cell.person.id);
    if (found){
      found = cell;
    } else {
      this.listToSave.push(cell);
    }
    this.save(false);
  }

  save(isSaveButton:boolean){
    if (isSaveButton || this.listToSave.length > 10) {
        this.attService.save(this.listToSave).subscribe(data => this.listToSave = []);
    }
  }

}
