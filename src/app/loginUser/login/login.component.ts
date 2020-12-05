import { AuthenticationService } from "./../../service/auth.service";
import { Component, EventEmitter, Inject, Output } from "@angular/core";

import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { OnInit } from "@angular/core";
import { Role } from "src/app/service/account.service";
import { GenService } from "src/app/service/generator.service";
import { L10nLocale, L10N_LOCALE } from "angular-l10n";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  fgc = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", Validators.required),
  });

  invalidLogin = false;
  status: string;

  constructor(
    @Inject(L10N_LOCALE) public locale: L10nLocale,
    private router: Router,
    private loginservice: AuthenticationService,
    private genservice: GenService
  ) {}

  generateData(b?: boolean) {
    this.status = "(Загрузка ...)";
    this.genservice.generate().subscribe(
      () => {},
      () => (this.status = "(ошибка)"),
      () => (this.status = "(готово)")
    );
  }

  ngOnInit() {
    this.navigate();
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
          this.navigate();
        }
      );
  }

  navigate() {
    if (this.loginservice.isUserLoggedIn()) {
      if (this.loginservice.isMustUpdatePassword()) {
        this.router.navigate(["changePassword"]);
      } else {
        this.router.navigate(["menu"]);
      }
    } else {
      this.router.navigate(["login"]);
    }
  }
}
