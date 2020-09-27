import { Component, Input, OnInit } from '@angular/core';
import { Lesson } from '../service/lesson.service';

@Component({
  selector: 'app-grid-cell',
  templateUrl: './grid-cell.component.html',
  styleUrls: ['./grid-cell.component.css']
})
export class GridCellComponent implements OnInit {

  @Input() lesson: Lesson

  constructor() { }

  ngOnInit() { 
    console.log(this.lesson)
   }

}
