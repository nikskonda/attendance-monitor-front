import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Time } from '@angular/common';
import { Observable } from 'rxjs';
import { Group } from './group.service';


export interface Person {
  id: number;
  email: string;
  fullName: string;

  firstName: string;
  lastName: string;
  patronymic: string;

  roles: string[];
}

export interface Student extends Person {
  group: Group;
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

  getStudents(groupId): Observable<Student[]> {
    const params = new HttpParams()
      .set('groupId', groupId);
    return this.httpClient.get<Student[]>('http://localhost:8888/person/students', {params});
  }

  createStudent(stud: Student): Observable<Student> {
    return this.httpClient.post<Student>('http://localhost:8888/person/student', stud);
  }

  updateStudent(id:number, stud: Student): Observable<Student> {
    return this.httpClient.put<Student>('http://localhost:8888/person/student/'+id, stud);
  }

  deleteStudent(id): Observable<{}> {
    return this.httpClient.delete('http://localhost:8888/person/student/'+id);
  }

}
