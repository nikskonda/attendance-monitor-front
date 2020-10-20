import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-editor-page",
  templateUrl: "./editor-page.component.html",
  styleUrls: ["./editor-page.component.css"],
})
export class EditorPageComponent implements OnInit {
  links = [
    { path: "edit/speciality", text: "Специальность" },
    { path: "edit/group", text: "Группа" },
    { path: "edit/student", text: "Студент" },
    { path: "edit/professor", text: "Профессор" },
    { path: "edit/subject", text: "Предмет" },
    { path: "edit/lesson", text: "Занятия" },
    { path: "edit/account", text: "Пользователи" },

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
