import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { ObjectRef, ROOT_URL } from "./common.service";

export interface AttCell {
  color: string;
  text: string;
  empty: boolean;
  header: boolean;
  lesson: ObjectRef;
  person: ObjectRef;
  goodReason: boolean;
}

export interface Attendance {
  rows: number;
  cols: number;
  subject: ObjectRef;
  group: ObjectRef;
  headers: AttCell[];
  cells: AttCell[];
}

@Injectable({
  providedIn: "root",
})
export class AttendanceService {
  constructor(private httpClient: HttpClient) {}

  getAttendance(
    startDate,
    endDate,
    groupId,
    subjectId,
    subjectType,
    groupVolume
  ): Observable<Attendance> {
    const params = new HttpParams()
      .set("startDate", startDate)
      .set("endDate", endDate)
      .set("groupId", groupId)
      .set("subjectId", subjectId)
      .set("subjectType", subjectType)
      .set("groupVolume", groupVolume);
    return this.httpClient.get<Attendance>(ROOT_URL + "/attendance", {
      params,
    });
  }

  save(list: AttCell[]): Observable<AttCell[]> {
    return this.httpClient.post<AttCell[]>(ROOT_URL + "/attendance", list);
  }
}
