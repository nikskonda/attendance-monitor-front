import { Component, Inject, OnInit } from "@angular/core";
import { L10nLocale, L10N_LOCALE } from "angular-l10n";
import { MatTabChangeEvent } from "@angular/material/tabs";
import { Router } from "@angular/router";
import { CommonService } from "src/app/service/common.service";
import { REPORT_MENU } from "../report-menu";

@Component({
  selector: "app-report-page",
  templateUrl: "./report-page.component.html",
  styleUrls: ["./report-page.component.scss"],
})
export class ReportPageComponent implements OnInit {
  links = [];

  selectedIndex: number = 0;

  constructor(private router: Router, private commonService: CommonService) {}

  ngOnInit(): void {
    this.links = this.commonService.getLinksByRole(REPORT_MENU);
    this.links.push({ path: "/menu", text: "Вернуться в меню" });
    this.selectedIndex = this.links.findIndex(
      (l) => l.path === this.router.url
    );
  }

  goTo(tabChangeEvent: MatTabChangeEvent) {
    this.router.navigate([this.links[tabChangeEvent.index].path]);
  }
}
