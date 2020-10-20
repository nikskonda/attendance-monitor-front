import { Component, Input, OnInit } from "@angular/core";
import { NavigationStart, Router } from "@angular/router";
import { AuthenticationService } from "src/app/service/auth.service";
import { Role } from "src/app/service/user.service";

@Component({
  selector: "app-current-accout",
  templateUrl: "./current-accout.component.html",
  styleUrls: ["./current-accout.component.css"],
})
export class CurrentAccoutComponent {
  fullName: string = "";
  @Input() show: boolean = false;

  hideToggle: boolean = false;

  constructor(
    private router: Router,
    private loginservice: AuthenticationService
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.calcShow();
        if (!this.show && event.url !== "/login") {
          this.router.navigate(["login"]);
        }
      }
    });
  }

  calcShow() {
    this.show = this.loginservice.isUserLoggedIn();
    if (this.show) {
      const userData = this.loginservice.getUserData();
      this.fullName = userData.fullName;
      this.show = !userData.mustUpdatePassword;
    }
  }

  isAdmin() {
    return this.loginservice.isHasRole(Role.Admin);
  }

  logout() {
    this.loginservice.logOut();
    this.router.navigate(["login"]);
  }
}
