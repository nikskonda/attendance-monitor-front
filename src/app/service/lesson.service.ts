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

export interface Subject {
  id: number;
  qualifier: string;
  type: string
}

export interface Lesson {
  id: number;
  date: Date;
  subject: Subject;
  subjectType: string;
  startTime: Date;
  finishTime: Date;
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

}
