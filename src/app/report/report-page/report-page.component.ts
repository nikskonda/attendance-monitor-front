import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-report-page",
  templateUrl: "./report-page.component.html",
  styleUrls: ["./report-page.component.css"],
})
export class ReportPageComponent implements OnInit {
  links = [
    { path: "report/student", text: "По Студенту" },
    { path: "report/group", text: "По группе" },
    { path: "report/studentDetails", text: "По студенту детальный" },
    { path: "menu", text: "Вернуться в меню" },
  ];

  activeLink;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.activeLink = this.links.find((l) => l.path === this.router.url);
  }

  goTo(link) {
    this.activeLink == link;
    this.router.navigate([link.path]);
  }
}
