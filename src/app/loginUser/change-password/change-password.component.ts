import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthenticationService } from "src/app/service/auth.service";
import { AccountService, User } from "src/app/service/account.service";

@Component({
  selector: "app-change-password",
  templateUrl: "./change-password.component.html",
  styleUrls: ["./change-password.component.scss"],
})
export class ChangePasswordComponent implements OnInit {
  fgc = new FormGroup({
    oldPassword: new FormControl("", [
      Validators.required,
      Validators.minLength(8),
    ]),
    newPassword: new FormControl("", [
      Validators.required,
      Validators.minLength(8),
    ]),
    repeatPassword: new FormControl("", [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  constructor(
    private router: Router,
    private AccountService: AccountService,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {}

  isMatchedNewPasswords() {
    const newPw = this.fgc.value.newPassword;
    const repeat = this.fgc.value.repeatPassword;
    return newPw === repeat;
  }

  updatePassword() {
    const old = this.fgc.value.oldPassword;
    const newPw = this.fgc.value.newPassword;
    const user: User = this.authService.getUserData();
    if (user) {
      this.AccountService.updatePassword(user.username, old, newPw).subscribe(
        (data) => {
          this.authService.logOut();
          this.router.navigate(["login"]);
        }
      );
    }
  }
}
