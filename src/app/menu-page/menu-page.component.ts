import { Component, OnInit } from '@angular/core';
import { Person, PersonService } from '../service/user.service';

@Component({
  selector: 'app-menu-page',
  templateUrl: './menu-page.component.html',
  styleUrls: ['./menu-page.component.css']
})
export class MenuPageComponent implements OnInit {

  showProfList:boolean = false;
  showCreateMenu:boolean = false;


  profList:Person[] = [];

  constructor(private personService: PersonService ) { }

  ngOnInit() {
  }

  displayProfs() {
    this.showProfList = !this.showProfList;
    if (this.showProfList) {
      this.personService.getProfs().subscribe(data => this.profList = data);
    }
  }

  displayCreateMenu() {
    this.showCreateMenu = !this.showCreateMenu;
  }

}
