import { Component, HostListener, Inject, OnInit } from "@angular/core";
import { L10nLocale, L10N_LOCALE } from "angular-l10n";
import { fromEvent } from "rxjs";
import { EDIT_MENU } from "../editor/edit-menu";
import { REPORT_MENU } from "../report/report-menu";
import { Person, AccountService, Role, User } from "../service/account.service";
import { AuthenticationService } from "../service/auth.service";
import { CommonService, LinkByRole } from "../service/common.service";
import { ProfessorService } from "../service/professor.service";
import { LinkWithIconByRole, MENU } from "./menu";

@Component({
  selector: "app-menu-page",
  templateUrl: "./menu-page.component.html",
  styleUrls: ["./menu-page.component.scss"],
})
export class MenuPageComponent implements OnInit {
  showProfList: boolean = false;
  showCreateMenu: boolean = false;

  profList: Person[] = [];

  showEditors: boolean = false;
  editorLinks: LinkByRole[] = EDIT_MENU;

  showReports: boolean = false;
  reportLinks: LinkByRole[] = REPORT_MENU;

  links: LinkWithIconByRole[] = MENU;

  rightMenuHeight: number;

  constructor(
    @Inject(L10N_LOCALE) public locale: L10nLocale,
    private profService: ProfessorService,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    this.setRightMenuHeight(window.innerHeight);
  }

  displayProfs() {
    this.showProfList = !this.showProfList;
    this.showReports = false;
    this.showEditors = false;
    if (this.showProfList) {
      this.profService.getProfs().subscribe((data) => (this.profList = data));
    }
  }

  displayEditors() {
    this.showEditors = !this.showEditors;
    this.showReports = false;
    this.showProfList = false;
  }

  displayRepots() {
    this.showReports = !this.showReports;
    this.showEditors = false;
    this.showProfList = false;
  }

  displayCreateMenu() {
    this.showCreateMenu = !this.showCreateMenu;
  }

  showImage() {
    return !(this.showReports || this.showEditors || this.showProfList);
  }

  isShowProfs() {
    return this.commonService.isInclude([Role.REPORT_VIEW]);
  }

  isShowEditor() {
    return this.commonService.isInclude([Role.PROFESSOR, Role.EDITOR]);
  }

  isShowReports() {
    return this.commonService.isInclude([
      Role.PROFESSOR,
      Role.PARENT,
      Role.REPORT_VIEW,
    ]);
  }

  getLinksByRole(links: LinkByRole[]) {
    return this.commonService.getLinksByRole(links);
  }

  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.setRightMenuHeight(window.innerHeight);
  }

  setRightMenuHeight(height) {
    console.log(height);
    this.rightMenuHeight = height - 36 - 40 - 50 - 40 - 40 - 40 - 50 - 30;
    console.log(this.rightMenuHeight);
  }
}
