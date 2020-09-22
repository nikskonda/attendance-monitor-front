import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Time } from '@angular/common';
import { Observable } from 'rxjs';


export interface Person {
  id: number;
  email: string;
  fullName: string;
}

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  constructor(private httpClient: HttpClient) { }

  getProfs(): Observable<Person[]> {
    const params = new HttpParams()
      .set('roles', 'PROFESSOR');
    return this.httpClient.get<Person[]>('http://localhost:8888/person/byRoles', {params});
  }

}
