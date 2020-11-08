import { Component, OnInit } from "@angular/core";
import { Person, PersonService } from "../service/account.service";
import { ProfessorService } from "../service/professor.service";

@Component({
  selector: "app-menu-page",
  templateUrl: "./menu-page.component.html",
  styleUrls: ["./menu-page.component.css"],
})
export class MenuPageComponent implements OnInit {
  showProfList: boolean = false;
  showCreateMenu: boolean = false;

  profList: Person[] = [];

  showEditors: boolean = false;
  editorLinks = [
    { path: "/edit/speciality", text: "Специальности" },
    { path: "/edit/group", text: "Группы" },
    { path: "/edit/student", text: "Студенты" },
    { path: "/edit/professor", text: "Преподаватели" },
    { path: "/edit/subject", text: "Дисциплины" },
    { path: "/edit/lesson", text: "Занятия" },
  ];

  showReports: boolean = false;
  reportLinks = [
    { path: "/report/student", text: "По студенту" },
    { path: "/report/group", text: "По группе" },
    { path: "/report/studentDetails", text: "По студенту детальный" },
  ];

  constructor(private profService: ProfessorService) {}

  ngOnInit() {}

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
}
