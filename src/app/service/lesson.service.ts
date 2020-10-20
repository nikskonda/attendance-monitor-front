import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Person } from "./user.service";
import { ObjectRef, Page, ROOT_URL } from "./common.service";

export interface Lesson {
  id: number;
  date: string;
  subject: ObjectRef;
  subjectType: string;
  time: LessonTime;
  professor: ObjectRef;
  group: ObjectRef;
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

  getLessons(startDate, finalDate, personId): Observable<Schedule> {
    let params = new HttpParams()
      .set("startDate", startDate)
      .set("finalDate", finalDate);
    if (personId) {
      params = new HttpParams()
        .set("startDate", startDate)
        .set("finalDate", finalDate)
        .set("personId", personId);
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

  createSeries(
    lesson: Lesson,
    inWeek: number,
    count: number
  ): Observable<Lesson> {
    const params = new HttpParams()
      .set("inWeek", inWeek.toString())
      .set("count", count.toString());
    return this.httpClient.post<Lesson>(ROOT_URL + "/lesson/series", lesson, {
      params,
    });
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
