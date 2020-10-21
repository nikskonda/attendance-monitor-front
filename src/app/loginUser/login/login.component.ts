import { AuthenticationService } from "./../../service/auth.service";
import { Component, EventEmitter, Output } from "@angular/core";

import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { OnInit } from "@angular/core";
import { Role } from "src/app/service/user.service";
import { GenService } from "src/app/service/generator.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  fgc = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", [
      Validators.required,
      Validators.minLength(3),
    ]),
  });

  invalidLogin = false;
  status: string;

  constructor(
    private router: Router,
    private loginservice: AuthenticationService,
    private genservice: GenService
  ) {}

  generateData(b?: boolean) {
  this.status = "(Загрузка ...)"
    if (b) {
      this.genservice.generate().subscribe(
        () => {},
        () => (this.status = "(ошибка)"),
        () => (this.status = "(готово)")
      );
    } else {
      this.genservice.generateBase().subscribe(
        () => {},
        () => (this.status = "(ошибка)"),
        () => (this.status = "(готово)")
      );
    }
  }

  ngOnInit() {
    if (this.loginservice.isUserLoggedIn()) {
      this.navigateByRole();
    }
  }

  checkLogin() {
    this.loginservice
      .authenticate(this.fgc.value.email, this.fgc.value.password)
      .subscribe(
        (_) => {},
        (error) => {
          this.invalidLogin = true;
        },
        () => {
          this.invalidLogin = false;
          if (this.loginservice.isMustUpdatePassword()) {
            this.router.navigate(["changePassword"]);
          } else {
            this.navigateByRole();
          }
        }
      );
  }

  navigateByRole() {
    if (this.loginservice.isHasRole(Role.Admin)) {
      this.router.navigate(["menu"]);
    } else {
      this.router.navigate(["schedule"]);
    }
  }
}
