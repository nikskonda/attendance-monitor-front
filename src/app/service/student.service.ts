import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Group, Volume } from "./group.service";
import { ObjectRef, Page, ROOT_URL } from "./common.service";
import { Person } from "./account.service";

export interface Student extends Person {
  group: ObjectRef;
  groupVolume: Volume;
}

export interface StudentWithParent extends Student {
  parentEmail: string;
}

@Injectable({
  providedIn: "root",
})
export class StudentService {
  constructor(private httpClient: HttpClient) {}

  getByGroup(groupId): Observable<StudentWithParent[]> {
    return this.httpClient.get<StudentWithParent[]>(
      ROOT_URL + "/student/group/" + groupId
    );
  }

  getPage(
    groupId: number,
    number: number,
    size: number
  ): Observable<Page<StudentWithParent>> {
    let params = new HttpParams()
      .set("page", number.toString())
      .set("size", size.toString());
    ["last_name", "first_name", "patronymic"].forEach((sort) => {
      params = params.append("sort", sort);
    });
    return this.httpClient.get<Page<StudentWithParent>>(
      ROOT_URL + "/student/group/" + groupId + "/page",
      { params }
    );
  }

  create(stud: StudentWithParent): Observable<StudentWithParent> {
    return this.httpClient.post<StudentWithParent>(ROOT_URL + "/student", stud);
  }

  update(id: number, stud: StudentWithParent): Observable<StudentWithParent> {
    return this.httpClient.put<StudentWithParent>(
      ROOT_URL + "/student/" + id,
      stud
    );
  }

  delete(id): Observable<{}> {
    return this.httpClient.delete(ROOT_URL + "/student/" + id);
  }

  findByParent(parentEmail: string): Observable<StudentWithParent[]> {
    let params = new HttpParams().set("parentEmail", parentEmail);
    return this.httpClient.get<StudentWithParent[]>(
      ROOT_URL + "/student/byParent/",
      { params }
    );
  }
}
