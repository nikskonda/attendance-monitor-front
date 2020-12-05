import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { ROOT_URL } from "./common.service";

@Injectable({
  providedIn: "root",
})
export class ReportService {
  constructor(private httpClient: HttpClient) {}

  findDataByStudentForDateRange(
    studentId: number,
    startDate: string,
    endDate: string
  ): Observable<string[][]> {
    const params = new HttpParams()
      .set("studentId", studentId.toString())
      .set("startDate", startDate)
      .set("endDate", endDate);
    return this.httpClient.get<string[][]>(ROOT_URL + "/report/byStudent", {
      params,
    });
  }

  findDataByStudentDetailsForDateRange(
    studentId: number,
    startDate: string,
    endDate: string
  ): Observable<string[][]> {
    const params = new HttpParams()
      .set("studentId", studentId.toString())
      .set("startDate", startDate)
      .set("endDate", endDate);
    return this.httpClient.get<string[][]>(
      ROOT_URL + "/report/byStudentDetails",
      { params }
    );
  }

  findDataByStudentAndSubjectDetailsForDateRange(
    studentId: number,
    subjectId: number,
    startDate: string,
    endDate: string
  ): Observable<string[][]> {
    const params = new HttpParams()
      .set("studentId", studentId.toString())
      .set("subjectId", subjectId ? subjectId.toString() : "")
      .set("startDate", startDate)
      .set("endDate", endDate);
    return this.httpClient.get<string[][]>(
      ROOT_URL + "/report/byStudentAndSubjectDetails",
      { params }
    );
  }

  findDataByGroupForDateRange(
    subjectId: number,
    groupId: number,
    startDate: string,
    endDate: string
  ): Observable<string[][]> {
    const params = new HttpParams()
      .set("subjectId", subjectId.toString())
      .set("groupId", groupId.toString())
      .set("startDate", startDate)
      .set("endDate", endDate);
    return this.httpClient.get<string[][]>(
      ROOT_URL + "/report/byGroupAndSubject",
      { params }
    );
  }

  findProfesors(): Observable<string[][]> {
    return this.httpClient.get<string[][]>(ROOT_URL + "/report/professors");
  }

  findStudents(groupId: number): Observable<string[][]> {
    const params = new HttpParams().set("groupId", groupId.toString());
    return this.httpClient.get<string[][]>(ROOT_URL + "/report/students", {
      params,
    });
  }
}
