import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Time } from '@angular/common';
import { Observable } from 'rxjs';
import { Person } from './user.service';

export interface ObjectRef {
  id: number;
  qualifier: string;
}

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
  providedIn: 'root'
})
export class LessonService {
  constructor(private httpClient: HttpClient) { }

  getLessons(startDate, finalDate, personId): Observable<Schedule> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('finalDate', finalDate)
      .set('personId', personId);
    return this.httpClient.get<Schedule>('http://localhost:8888/lesson/findGridByDateRange', {params});
  }

  getLessonsForDate(date): Observable<Lesson[]> {
    const params = new HttpParams()
      .set('startDate', date)
      .set('finalDate', date);
    return this.httpClient.get<Lesson[]>('http://localhost:8888/lesson/findByDateRange', {params});
  }

  getLessonTimes(): Observable<LessonTime[]> {
       return this.httpClient.get<LessonTime[]>('http://localhost:8888/lesson/schedule');
  }

  create(lesson: Lesson): Observable<Lesson> {
    // const params = new HttpParams()
    //   .set('startDate', startDate)
    //   .set('finalDate', finalDate)
    //   .set('personId', personId);
    return this.httpClient.post<Lesson>('http://localhost:8888/lesson', lesson);
  }

  update(id:number, lesson: Lesson): Observable<Lesson> {
    // const params = new HttpParams()
    //   .set('startDate', startDate)
    //   .set('finalDate', finalDate)
    //   .set('personId', personId);
    return this.httpClient.put<Lesson>('http://localhost:8888/lesson/'+id, lesson);
  }

  remove(id:number): Observable<{}> {
    // const params = new HttpParams()
    //   .set('startDate', startDate)
    //   .set('finalDate', finalDate)
    //   .set('personId', personId);
    return this.httpClient.delete('http://localhost:8888/lesson/'+id);
  }
}
