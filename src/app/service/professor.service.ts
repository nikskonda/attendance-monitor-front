import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Group, Volume } from "./group.service";
import { ObjectRef, Page, ROOT_URL } from "./common.service";
import { Person } from "./account.service";

export interface Professor extends Person {
  position: ObjectRef;
}

@Injectable({
  providedIn: "root",
})
export class ProfessorService {
  constructor(private httpClient: HttpClient) {}

  getProfs(): Observable<Professor[]> {
    return this.httpClient.get<Professor[]>(ROOT_URL + "/professor");
  }

  getPage(number: number, size: number): Observable<Page<Professor>> {
    const params = new HttpParams()
      .set("page", number.toString())
      .set("size", size.toString());
    return this.httpClient.get<Page<Professor>>(ROOT_URL + "/professor/page", {
      params,
    });
  }

  create(prof: Professor): Observable<Professor> {
    return this.httpClient.post<Professor>(ROOT_URL + "/professor", prof);
  }

  update(id: number, prof: Professor): Observable<Professor> {
    return this.httpClient.put<Professor>(ROOT_URL + "/professor/" + id, prof);
  }

  delete(id): Observable<{}> {
    return this.httpClient.delete(ROOT_URL + "/professor/" + id);
  }
}
