import {
  Component,
  ElementRef,
  Inject,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import { Router } from "@angular/router";
import { L10nLocale, L10nTranslationService, L10N_LOCALE } from "angular-l10n";
import { Volume } from "../service/group.service";
import { Lesson } from "../service/lesson.service";

@Component({
  selector: "app-grid-cell",
  templateUrl: "./grid-cell.component.html",
  styleUrls: ["./grid-cell.component.scss"],
})
export class GridCellComponent implements OnInit {
  @Input() lesson: Lesson;

  text1: string = "";
  text2: string = "";
  fullText: string = "";
  height: number = 100;

  @ViewChild("myDiv") div: ElementRef;

  constructor(
    @Inject(L10N_LOCALE) public locale: L10nLocale,
    private translation: L10nTranslationService,
    private router: Router
  ) {}

  ngOnInit() {
    const subjectType = this.translation.translate(this.lesson.subjectType);
    const groupVolume = this.translation.translate(
      this.lesson.groupVolume.toString()
    );
    this.text1 = `${this.lesson.subject.qualifier} (${subjectType})`;
    this.text2 =
      this.lesson.groupVolume !== Volume.FULL
        ? `${this.lesson.group.qualifier} (${groupVolume})`
        : `${this.lesson.group.qualifier}`;
    this.fullText = `${this.text1} ${this.text2}`;
  }

  goToLesson() {
    this.router.navigate(["/attendance"], {
      queryParams: {
        groupId: this.lesson.group.id,
        subjectId: this.lesson.subject.id,
        subjectTypes: this.lesson.subjectType,
        groupVolume: this.lesson.groupVolume,
        date: this.lesson.date,
      },
    });
  }

  getText(height, text) {
    if (height > 100) {
      var lastIndex = text.lastIndexOf(" ");
      text = text.substring(0, lastIndex) + "...";
      this.height = height;
    }
    return text;
  }
}
