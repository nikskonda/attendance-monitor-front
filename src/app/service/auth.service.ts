import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';

export class User{
  constructor(
    public status: string,
     ) {}
}
export class JwtResponse{
  constructor(
    public jwttoken: string,
     ) {}
}
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(private httpClient: HttpClient) { }

  authenticate(username, password) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa('attendance-monitor-client:attendance-monitor-secret')
      })};
    const body = new HttpParams()
      .set('username', username)
      .set('password', password)
      .set('grant_type', 'password');

    return this.httpClient
      .post<any>('http://localhost:8888/oauth/token', body, httpOptions)
      .pipe(map(userData => {
              sessionStorage.setItem('username', username);
              let tokenStr = 'Bearer ' + userData.access_token;
              sessionStorage.setItem('token', tokenStr);
              console.log(userData);
              return userData;
            }));
  }

  isUserLoggedIn() {
    let user = sessionStorage.getItem('username');
    //console.log(!(user === null))
    return !(user === null);
  }

  logOut() {
    sessionStorage.removeItem('username');
  }

}
