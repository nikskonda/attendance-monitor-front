import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ObjectRef } from './lesson.service';


export interface AttCell {
  color: string;
  text: string;
  empty: boolean;
  header: boolean;
  lesson: ObjectRef;
  person: ObjectRef;
}

export interface Attendance {
  rows: number;
  cols: number;
  subject: ObjectRef;
  group: ObjectRef
  cells: AttCell[]; 
}

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  constructor(private httpClient: HttpClient) { }

  getAttendance(startDate, endDate, groupId, subjectId, subjectType): Observable<Attendance> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate)
      .set('groupId', groupId)
      .set('subjectId', subjectId)
      .set('subjectType', subjectType)      ;
    return this.httpClient.get<Attendance>('http://localhost:8888/attendance', {params});
  }

  save(list: AttCell[]): Observable<AttCell[]> {
    return this.httpClient.post<AttCell[]>('http://localhost:8888/attendance', list);
  }

}
