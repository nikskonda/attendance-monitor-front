import { AuthenticationService } from "./../../service/auth.service";
import { Component, EventEmitter, Output } from "@angular/core";

import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { OnInit } from "@angular/core";
import { Role } from "src/app/service/account.service";
import { GenService } from "src/app/service/generator.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  fgc = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", Validators.required),
  });

  invalidLogin = false;
  status: string;

  constructor(
    private router: Router,
    private loginservice: AuthenticationService,
    private genservice: GenService
  ) {}

  generateData(b?: boolean) {
    this.status = "(Загрузка ...)";
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
    this.navigateByRole();
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
          this.navigateByRole();
        }
      );
  }

  navigateByRole() {
    if (this.loginservice.isUserLoggedIn()) {
      if (this.loginservice.isMustUpdatePassword()) {
        console.log("changePassword");
        this.router.navigate(["changePassword"]);
      } else if (this.loginservice.isHasRole(Role.Admin)) {
        console.log("menu");
        this.router.navigate(["menu"]);
      } else {
        console.log("schedule");
        this.router.navigate(["schedule"]);
      }
    }
  }
}
