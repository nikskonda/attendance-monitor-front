import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ObjectRef } from './lesson.service';
import { Student } from './user.service';

export interface ReportByStudentAndSubjects {
  student: Student;
  subject: ObjectRef;
  attendanceHours: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  constructor(private httpClient: HttpClient) { }

  findDataByStudentForDateRange(studentId: number, startDate:string, endDate:string): Observable<ReportByStudentAndSubjects[]> {
    const params = new HttpParams()
      .set('studentId', studentId.toString())
      .set('startDate', startDate)
      .set('endDate', endDate)
      ;
    return this.httpClient.get<ReportByStudentAndSubjects[]>('http://localhost:8888/report/byStudentForDateRange', {params});
  }

}
