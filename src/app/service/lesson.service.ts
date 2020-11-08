import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Person } from "./account.service";
import { ObjectRef, Page, ROOT_URL } from "./common.service";
import { Volume } from "./group.service";

export interface DayOfWeek {
  day: number;
  text: string;
  fullName: string;
}

export const DAYS_OF_WEEK: DayOfWeek[] = [
  { day: 1, text: "Пн", fullName: "Понедельник" },
  { day: 2, text: "Вт", fullName: "Вторник" },
  { day: 3, text: "Ср", fullName: "Среда" },
  { day: 4, text: "Чт", fullName: "Четверг" },
  { day: 5, text: "Пт", fullName: "Пятница" },
  { day: 6, text: "Сб", fullName: "Суббота" },
  // { day: 7, text: "Вс", fullName: "Воскресенье" },
];

export interface Lesson {
  id: number;
  date: string;
  subject: ObjectRef;
  subjectType: string;
  time: LessonTime;
  professor: ObjectRef;
  group: ObjectRef;
  groupVolume: Volume;
}

export interface LessonSeries extends Lesson {
  days: number[];
  start: string;
  finish: string;
}

export interface Cell {
  color: string;
  cols: number;
  rows: number;
  text: string;
  empty: boolean;
  header: boolean;
  lesson: Lesson;
}

export interface Schedule {
  rows: number;
  cols: number;
  professor: Person;
  cells: Cell[];
}

export interface LessonTime {
  id: number;
  order: number;
  startTime: string;
  finishTime: string;
  shift: string;
}

@Injectable({
  providedIn: "root",
})
export class LessonService {
  constructor(private httpClient: HttpClient) {}

  getLessons(
    startDate,
    finalDate,
    personId,
    topDateHeader
  ): Observable<Schedule> {
    let params = new HttpParams()
      .set("startDate", startDate)
      .set("finalDate", finalDate)
      .set("topDateHeader", topDateHeader);
    if (personId) {
      params = new HttpParams()
        .set("startDate", startDate)
        .set("finalDate", finalDate)
        .set("personId", personId)
        .set("topDateHeader", topDateHeader);
    }
    return this.httpClient.get<Schedule>(
      ROOT_URL + "/lesson/findGridByDateRange",
      { params }
    );
  }

  getLessonsPageForDate(
    date,
    number: number,
    size: number
  ): Observable<Page<Lesson>> {
    const params = new HttpParams()
      .set("startDate", date)
      .set("finalDate", date)
      .set("page", number.toString())
      .set("size", size.toString());
    return this.httpClient.get<Page<Lesson>>(
      ROOT_URL + "/lesson/findPageByDateRange",
      { params }
    );
  }

  getLessonTimes(): Observable<LessonTime[]> {
    return this.httpClient.get<LessonTime[]>(ROOT_URL + "/lesson/schedule");
  }

  create(lesson: Lesson): Observable<Lesson> {
    // const params = new HttpParams()
    //   .set('startDate', startDate)
    //   .set('finalDate', finalDate)
    //   .set('personId', personId);
    return this.httpClient.post<Lesson>(ROOT_URL + "/lesson", lesson);
  }

  createSeries(lesson: LessonSeries): Observable<LessonSeries> {
    return this.httpClient.post<LessonSeries>(
      ROOT_URL + "/lesson/series/create",
      lesson
    );
  }

  deleteSeries(lesson: LessonSeries) {
    return this.httpClient.post(ROOT_URL + "/lesson/series/delete", lesson);
  }

  update(id: number, lesson: Lesson): Observable<Lesson> {
    // const params = new HttpParams()
    //   .set('startDate', startDate)
    //   .set('finalDate', finalDate)
    //   .set('personId', personId);
    return this.httpClient.put<Lesson>(ROOT_URL + "/lesson/" + id, lesson);
  }

  remove(id: number): Observable<{}> {
    // const params = new HttpParams()
    //   .set('startDate', startDate)
    //   .set('finalDate', finalDate)
    //   .set('personId', personId);
    return this.httpClient.delete(ROOT_URL + "/lesson/" + id);
  }
}
