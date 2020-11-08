import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Group, Volume } from "./group.service";
import { ObjectRef, Page, ROOT_URL } from "./common.service";

export enum Role {
  Student = "STUDENT",
  Professor = "PROFESSOR",
  Admin = "ADMIN",
}

export interface User {
  fullName: string;
  email: string;
  qualifier: string;
  username: string;
  mustUpdatePassword: boolean;
  roles: ObjectRef[];
}

export interface Person {
  id: number;
  email: string;
  fullName: string;

  firstName: string;
  lastName: string;
  patronymic: string;

  roles: Role[];
}

@Injectable({
  providedIn: "root",
})
export class PersonService {
  constructor(private httpClient: HttpClient) {}

  findByEmail(email: string): Observable<User> {
    const params = new HttpParams().set("email", email);
    return this.httpClient.get<User>(ROOT_URL + "/account/byEmail", {
      params,
    });
  }

  updatePassword(
    email: string,
    oldPassword: string,
    newPassword: string
  ): Observable<User> {
    const body = {
      email: email,
      oldPassword: oldPassword,
      newPassword: newPassword,
    };
    console.log("body");
    console.log(body);
    return this.httpClient.post<User>(
      ROOT_URL + "/account/updatePassword",
      body
    );
  }

  login(username: string, password: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          btoa("attendance-monitor-client:attendance-monitor-secret"),
      }),
    };
    const body = new HttpParams()
      .set("username", username)
      .set("password", password)
      .set("grant_type", "password");

    return this.httpClient.post<any>(
      ROOT_URL + "/oauth/token",
      body,
      httpOptions
    );
  }

  getUsersPage(number: number, size: number): Observable<Page<User>> {
    const params = new HttpParams()
      .set("page", number.toString())
      .set("size", size.toString());
    return this.httpClient.get<Page<User>>(ROOT_URL + "/account/page", {
      params,
    });
  }

  resetPassword(email: string) {
    return this.httpClient.post(ROOT_URL + "/account/resetPassword", email);
  }
}
