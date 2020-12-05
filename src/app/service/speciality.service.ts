import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { ObjectRef, Page, ROOT_URL } from "./common.service";

@Injectable({
  providedIn: "root",
})
export class SpecialityService {
  constructor(private httpClient: HttpClient) {}

  getAll(): Observable<ObjectRef[]> {
    return this.httpClient.get<ObjectRef[]>(ROOT_URL + "/speciality");
  }

  getPage(number: number, size: number): Observable<Page<ObjectRef>> {
    const params = new HttpParams()
      .set("page", number.toString())
      .set("size", size.toString())
      .set("sort", "name");
    return this.httpClient.get<Page<ObjectRef>>(ROOT_URL + "/speciality/page", {
      params,
    });
  }

  create(spec: ObjectRef): Observable<ObjectRef> {
    return this.httpClient.post<ObjectRef>(ROOT_URL + "/speciality", spec);
  }

  update(id: number, spec: ObjectRef): Observable<ObjectRef> {
    return this.httpClient.put<ObjectRef>(ROOT_URL + "/speciality/" + id, spec);
  }

  delete(id: number): Observable<{}> {
    return this.httpClient.delete(ROOT_URL + "/speciality/" + id);
  }
}
