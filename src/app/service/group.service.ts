import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { ObjectRef, Page, ROOT_URL } from "./common.service";

export enum Volume {
  FULL = "FULL",
  FIRST = "FIRST",
  SECOND = "SECOND",
  THIRD = "THIRD",
}

export interface Group {
  id: number;
  qualifier: string;
  speciality: ObjectRef;
}

@Injectable({
  providedIn: "root",
})
export class GroupService {
  constructor(private httpClient: HttpClient) {}

  getAll(): Observable<Group[]> {
    return this.httpClient.get<Group[]>(ROOT_URL + "/group");
  }

  getGroupVolumes(): Observable<Volume[]> {
    return this.httpClient.get<Volume[]>(ROOT_URL + "/group/volume");
  }

  getPage(number: number, size: number): Observable<Page<Group>> {
    const params = new HttpParams()
      .set("page", number.toString())
      .set("size", size.toString())
      .set("sort", "key");
    return this.httpClient.get<Page<Group>>(ROOT_URL + "/group/page", {
      params,
    });
  }

  create(group: Group): Observable<Group> {
    return this.httpClient.post<Group>(ROOT_URL + "/group", group);
  }

  update(id: number, group: Group): Observable<ObjectRef> {
    return this.httpClient.put<Group>(ROOT_URL + "/group/" + id, group);
  }

  delete(id: number): Observable<{}> {
    return this.httpClient.delete(ROOT_URL + "/group/" + id);
  }
}
