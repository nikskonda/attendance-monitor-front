import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { GroupService } from '../service/group.service';
import { ObjectRef } from '../service/lesson.service';
import { Person, PersonService } from '../service/user.service';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-pdf-creator',
  templateUrl: './pdf-creator.component.html',
  styleUrls: ['./pdf-creator.component.css']
})
export class PdfCreatorComponent implements OnInit {

  selected: Person;
  groups: ObjectRef[] = [];
  studs: Person[] = [];

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });


  constructor(
    private personService: PersonService,
    private groupService: GroupService ) { }
    
  ngOnInit() {
    this.groupService.getAll().subscribe(data => {
      data.forEach(ref => this.groups.push(ref));
      console.log(this.groups);
    });
  }

  onGroupSelect(groupId: number){
    this.personService.getStudents(groupId).subscribe(data => this.studs = data);
  }

  onSelect(selected: Person){
    console.log(this.range.value);
    this.selected = selected;
  }

  generatePdf(){
    const documentDefinition = {
      content: [
        {
          text: 'Белорусский национальный технический университет',
          bold: true,
          fontSize: 20,
          alignment: 'right',
        },
        {
          text: 'Факультет информационных технологий и робототехники',
          bold: true,
          fontSize: 20,
          alignment: 'right',
        },
        {
          text: 'Кафедра программирования и программирования',
          bold: true,
          fontSize: 20,
          alignment: 'right',
        },
        {
          text: 'Отчёт о посещаемости студента' + this.selected.fullName + 'за период занятий с ' + ' по '+ '.',
          fontSize: 20,
          alignment: 'left',
        },
        {
          table: {
            body: this.getBody()
          }
        }
      ],
      info: {
        title: 'this.resume.name' + '_RESUME',
        author: 'this.resume.name',
        subject: 'RESUME',
        keywords: 'RESUME, ONLINE RESUME',
      },
        styles: {
          header: {
            fontSize: 18,
            bold: true,
            margin: [0, 20, 0, 10],
            decoration: 'underline'
          },
          name: {
            fontSize: 16,
            bold: true
          },
          jobTitle: {
            fontSize: 14,
            bold: true,
            italics: true
          },
          sign: {
            margin: [0, 50, 0, 10],
            alignment: 'right',
            italics: true
          },
          tableHeader: {
            bold: true,
          }
        }
    };
    pdfMake.createPdf(documentDefinition).open();
   }

   getBody(){

   }

}
