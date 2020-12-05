import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AccountService, Role, User } from "./account.service";
import { Observable } from "rxjs";
import { tokenName } from "@angular/compiler";

import jwt_decode from "jwt-decode";

export interface UserWithToken extends User {
  token: string;
}

@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  constructor(private AccountService: AccountService) {}

  authenticate(username, password) {
    let token = "";
    return new Observable((obs) => {
      this.AccountService.login(username, password).subscribe(
        (userData) => {
          token = userData.access_token;
          let tokenStr = "Bearer " + userData.access_token;
          localStorage.setItem("token", tokenStr);
        },
        (error) => obs.error(error),
        () => {
          this.AccountService.findByEmail(username).subscribe(
            (data) => {
              const qwer: UserWithToken = {
                fullName: data.fullName,
                email: data.email,
                qualifier: data.qualifier,
                username: data.username,
                mustUpdatePassword: data.mustUpdatePassword,
                accountNonLocked: data.accountNonLocked,
                roles: data.roles,
                token: token,
              };
              localStorage.setItem("userdata", JSON.stringify(qwer));
            },
            (error) => obs.error(error),
            () => obs.complete()
          );
        }
      );
    });
  }

  getUserData(): UserWithToken {
    if (this.isUserLoggedIn()) {
      const user: UserWithToken = JSON.parse(localStorage.getItem("userdata"));
      return user;
    }
  }

  isHasRole(role: Role): boolean {
    let result = false;
    const user: UserWithToken = this.getUserData();
    if (user.token) {
      let roles = jwt_decode(user.token).authorities;
      roles.forEach((r) => {
        if (r == role) result = true;
      });
    }
    return result;
  }

  isMustUpdatePassword(): boolean {
    if (this.isUserLoggedIn()) {
      const user: User = JSON.parse(localStorage.getItem("userdata"));
      return user.mustUpdatePassword;
    }
    return false;
  }

  isUserLoggedIn(): boolean {
    let user = localStorage.getItem("userdata");
    let token = localStorage.getItem("token");
    return !(!user || !token);
  }

  logOut() {
    localStorage.removeItem("userdata");
    localStorage.removeItem("token");
  }
}
