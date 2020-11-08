import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { ObjectRef, Page, ROOT_URL } from "./common.service";

@Injectable({
  providedIn: "root",
})
export class PositionService {
  constructor(private httpClient: HttpClient) {}

  getAll(): Observable<ObjectRef[]> {
    return this.httpClient.get<ObjectRef[]>(ROOT_URL + "/position");
  }

  getPage(number: number, size: number): Observable<Page<ObjectRef>> {
    const params = new HttpParams()
      .set("page", number.toString())
      .set("size", size.toString());
    return this.httpClient.get<Page<ObjectRef>>(ROOT_URL + "/position/page", {
      params,
    });
  }

  create(spec: ObjectRef): Observable<ObjectRef> {
    return this.httpClient.post<ObjectRef>(ROOT_URL + "/position", spec);
  }

  update(id: number, spec: ObjectRef): Observable<ObjectRef> {
    return this.httpClient.put<ObjectRef>(ROOT_URL + "/position/" + id, spec);
  }

  delete(id: number): Observable<{}> {
    return this.httpClient.delete(ROOT_URL + "/position/" + id);
  }
}
