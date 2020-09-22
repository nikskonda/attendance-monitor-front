import { Cell, Lesson, LessonService } from './../service/lesson.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Person } from '../service/user.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {

  lessons: Lesson[] = [];
  cells: Cell[] = [];
  professor: Person;
  personId: number;
  cols: number = 0;

  constructor(
    private router: Router,
    private lessonService: LessonService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    var curr = new Date();
    var firstday = new Date(curr.setDate(curr.getDate() - curr.getDay()));
    var lastday = new Date(curr.setDate(curr.getDate() - curr.getDay() + 6));

    this.route.queryParams.subscribe(params => {
      this.personId = params['personId'];
    });

    this.lessonService.getLessons(firstday.toISOString().substring(0, 10), lastday.toISOString().substring(0, 10), this.personId)
    .subscribe(data => {
      this.cells=data.cells;
      this.professor = data.professor;
      this.cols = data.cols;
    });
  }

}
