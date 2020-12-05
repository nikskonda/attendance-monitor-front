import { Component, OnInit } from "@angular/core";
import { MatTabChangeEvent } from "@angular/material/tabs";
import { Router } from "@angular/router";
import { CommonService } from "src/app/service/common.service";
import { EDIT_MENU } from "../edit-menu";

@Component({
  selector: "app-editor-page",
  templateUrl: "./editor-page.component.html",
  styleUrls: ["./editor-page.component.scss"],
})
export class EditorPageComponent implements OnInit {
  links = [];

  selectedIndex: number = 0;

  constructor(private router: Router, private commonService: CommonService) {}

  ngOnInit(): void {
    this.links = this.commonService.getLinksByRole(EDIT_MENU);
    this.links.push({ path: "/menu", text: "Вернуться в меню" });
    this.selectedIndex = this.links.findIndex(
      (l) => l.path === this.router.url
    );
  }

  goTo(tabChangeEvent: MatTabChangeEvent) {
    this.router.navigate([this.links[tabChangeEvent.index].path]);
  }
}
