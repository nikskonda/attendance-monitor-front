import { Component, OnInit } from "@angular/core";
import { Person, PersonService } from "../service/user.service";

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
    { path: "/edit/speciality", text: "Специальность" },
    { path: "/edit/group", text: "Группу" },
    { path: "/edit/student", text: "Студентов" },
    { path: "/edit/professor", text: "Профессоров" },
    { path: "/edit/subject", text: "Предмет" },
    { path: "/edit/lesson", text: "Пары" },
  ];

  showReports: boolean = false;
  reportLinks = [
    { path: "/report/student", text: "По студенту" },
    { path: "/report/group", text: "По Группе" },
    { path: "/report/studentDetails", text: "По студенту детальный" },
  ];

  constructor(private personService: PersonService) {}

  ngOnInit() {}

  displayProfs() {
    this.showProfList = !this.showProfList;
    if (this.showProfList) {
      this.personService.getProfs().subscribe((data) => (this.profList = data));
    }
  }

  displayCreateMenu() {
    this.showCreateMenu = !this.showCreateMenu;
  }
}
