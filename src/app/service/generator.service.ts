import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { ROOT_URL } from "./common.service";

@Injectable({
  providedIn: "root",
})
export class GenService {
  constructor(private httpClient: HttpClient) {}

  generateBase(): Observable<any> {
    return this.httpClient.get<any>(ROOT_URL + "/rest/for/test/generateBase");
  }

  generate(): Observable<any> {
    return this.httpClient.get<any>(ROOT_URL + "/rest/for/test/generate");
  }
}
