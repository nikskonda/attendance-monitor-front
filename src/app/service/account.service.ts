import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Group, Volume } from "./group.service";
import { ObjectRef, Page, ROOT_URL } from "./common.service";

export enum Role {
  STUDENT,
  PARENT,
  PROFESSOR,
  ADMIN,
  REPORT_VIEW,
}

export function getRoles(): string[] {
  const keys = Object.keys(Role);
  return keys.slice(keys.length / 2);
}

export interface User {
  fullName: string;
  email: string;
  qualifier: string;
  username: string;
  mustUpdatePassword: boolean;
  roles: ObjectRef[];
  accountNonLocked: boolean;
}

export interface Person {
  id: number;
  email: string;
  fullName: string;

  firstName: string;
  lastName: string;
  patronymic: string;

  roles: ObjectRef[];

  phone: string;
}

@Injectable({
  providedIn: "root",
})
export class AccountService {
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

  findUserPage(
    search: string,
    role: string,
    number: number,
    size: number
  ): Observable<Page<User>> {
    const params = new HttpParams()
      .set("search", search)
      .set("role", role)
      .set("page", number.toString())
      .set("size", size.toString())
      .set("sort", "email");
    return this.httpClient.get<Page<User>>(ROOT_URL + "/account/search", {
      params,
    });
  }

  isUniqueEmail(email: string): Observable<boolean> {
    const params = new HttpParams().set("email", email);
    return this.httpClient.get<boolean>(ROOT_URL + "/account/isUniqueEmail", {
      params,
    });
  }

  resetPassword(email: string) {
    return this.httpClient.post(ROOT_URL + "/account/resetPassword", email);
  }

  changeLock(email: string) {
    return this.httpClient.post(ROOT_URL + "/account/changeLock", email);
  }

  get(email: String): Observable<Person> {
    return this.httpClient.get<Person>(ROOT_URL + "/account/" + email);
  }

  create(person: Person): Observable<Person> {
    return this.httpClient.post<Person>(ROOT_URL + "/account/create", person);
  }

  update(person: Person): Observable<Person> {
    return this.httpClient.put<Person>(ROOT_URL + "/account/update", person);
  }
}
