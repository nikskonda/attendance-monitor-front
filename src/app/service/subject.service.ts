import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ObjectRef } from './lesson.service';


@Injectable({
  providedIn: 'root'
})
export class SubjectService {
  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<ObjectRef[]> {
    return this.httpClient.get<ObjectRef[]>('http://localhost:8888/subject');
  }

  create(spec: ObjectRef): Observable<ObjectRef> {
    console.log(spec);
    return this.httpClient.post<ObjectRef>('http://localhost:8888/subject', spec);
  }

  update(id:number, spec: ObjectRef): Observable<ObjectRef> {
    return this.httpClient.put<ObjectRef>('http://localhost:8888/subject/'+id, spec);
  }

  delete(id:number): Observable<{}> {
    return this.httpClient.delete('http://localhost:8888/subject/'+id);
  }

  getTypes(): Observable<string[]> {
    return this.httpClient.get<string[]>('http://localhost:8888/subject/types');
  }

}
