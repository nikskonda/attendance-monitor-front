import { Component, Inject, Input } from "@angular/core";
import { NavigationStart, Router } from "@angular/router";
import { AuthenticationService } from "src/app/service/auth.service";
import { Role } from "src/app/service/account.service";
import { LinkWithIconByRole, MENU } from "src/app/menu-page/menu";
import { CommonService } from "src/app/service/common.service";
import { L10nLocale, L10N_LOCALE } from "angular-l10n";

@Component({
  selector: "app-current-accout",
  templateUrl: "./current-accout.component.html",
  styleUrls: ["./current-accout.component.scss"],
})
export class CurrentAccoutComponent {
  fullName: string = "";
  @Input() show: boolean = false;

  isMustChangePassword: boolean = false;

  hideToggle: boolean = false;

  links: LinkWithIconByRole[] = MENU;

  constructor(
    @Inject(L10N_LOCALE) public locale: L10nLocale,
    private router: Router,
    private commonService: CommonService,
    private loginservice: AuthenticationService
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.calcShow();
        if (
          !this.show &&
          event.url !== "/login" &&
          !this.isMustChangePassword
        ) {
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
      this.isMustChangePassword = userData.mustUpdatePassword;
    }
  }

  getLinksByRole(links: LinkWithIconByRole[]) {
    return this.commonService.getLinksByRole(links);
  }

  logout() {
    this.loginservice.logOut();
    this.router.navigate(["login"]);
  }
}
