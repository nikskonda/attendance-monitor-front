import { Route } from "@angular/compiler/src/core";
import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import { Router } from "@angular/router";
import { Lesson } from "../service/lesson.service";

@Component({
  selector: "app-grid-cell",
  templateUrl: "./grid-cell.component.html",
  styleUrls: ["./grid-cell.component.css"],
})
export class GridCellComponent implements OnInit {
  @Input() lesson: Lesson;

  text: string = "";
  fullText: string = "";
  height: number = 100;

  @ViewChild("myDiv") div: ElementRef;

  constructor(private router: Router) {}

  ngOnInit() {
    this.text = `${this.lesson.subject.qualifier} (${this.lesson.subjectType})`;
    this.fullText = `${this.lesson.subject.qualifier} (${this.lesson.subjectType}) ${this.lesson.group.qualifier}`;
  }

  goToLesson() {
    this.router.navigate(["/attendance"], {
      queryParams: {
        groupId: this.lesson.group.id,
        subjectId: this.lesson.subject.id,
        subjectTypes: this.lesson.subjectType,
      },
    });
  }

  getText(height) {
    if (height > 100) {
      var lastIndex = this.text.lastIndexOf(" ");
      this.text = this.text.substring(0, lastIndex) + "...";
      this.height = height;
    }
    return this.text;
  }
}
