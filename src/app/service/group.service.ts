import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ObjectRef } from './lesson.service';

export interface Group {
  id: number;
  qualifier: string;
  speciality: ObjectRef;
}

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<Group[]> {
    return this.httpClient.get<Group[]>('http://localhost:8888/group');
  }

  create(group: Group): Observable<Group> {
    return this.httpClient.post<Group>('http://localhost:8888/group', group);
  }

  update(id:number, group: Group): Observable<ObjectRef> {
    return this.httpClient.put<Group>('http://localhost:8888/group/'+id, group);
  }

  delete(id:number): Observable<{}> {
    return this.httpClient.delete('http://localhost:8888/group/'+id);
  }

}
