import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Time } from '@angular/common';
import { Observable } from 'rxjs';
import { ObjectRef } from './lesson.service';


@Injectable({
  providedIn: 'root'
})
export class SpecialityService {
  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<ObjectRef[]> {
    return this.httpClient.get<ObjectRef[]>('http://localhost:8888/speciality');
  }

  create(spec: ObjectRef): Observable<ObjectRef> {
    console.log(spec);
    return this.httpClient.post<ObjectRef>('http://localhost:8888/speciality', spec);
  }

  update(id:number, spec: ObjectRef): Observable<ObjectRef> {
    return this.httpClient.put<ObjectRef>('http://localhost:8888/speciality/'+id, spec);
  }

  delete(id:number): Observable<{}> {
    return this.httpClient.delete('http://localhost:8888/speciality/'+id);
  }

}
