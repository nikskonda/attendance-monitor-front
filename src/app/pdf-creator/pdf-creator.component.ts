import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { GroupService } from '../service/group.service';
import { ObjectRef } from '../service/lesson.service';
import { ReportService } from '../service/report.service';
import { Person, PersonService } from '../service/user.service';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-pdf-creator',
  templateUrl: './pdf-creator.component.html',
  styleUrls: ['./pdf-creator.component.css']
})
export class PdfCreatorComponent implements OnInit {

  selected: Person;
  selectedValue: number;
  groups: ObjectRef[] = [];
  studs: Person[] = [];

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  table: string[][] = [];

  isPdfReady: boolean = false;


  constructor(
    private personService: PersonService,
    private groupService: GroupService,
    private reportService: ReportService) { }
    
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
    const start:Date = this.range.value.start
    start.setMinutes(-start.getTimezoneOffset());
    const end:Date = this.range.value.end
    end.setMinutes(-end.getTimezoneOffset());
    this.reportService.findDataByStudentForDateRange(selected.id, start.toISOString().substring(0, 10), end.toISOString().substring(0, 10)).subscribe(data => {
      console.log(data);
      this.table = [];
      this.table.push(['Предмет','Пропущено часов']);
      data.forEach(e => this.table.push([e.subject.qualifier, e.attendanceHours.toString()]));
    });
    this.isPdfReady = true;
  }

  getDate(date: Date) {
    date.setMinutes(-date.getTimezoneOffset());
    return date.toISOString().substring(0, 10);
  }

  open(){
    pdfMake.createPdf(this.getDocDefinition()).open();
  }

  download(){
    pdfMake.createPdf(this.getDocDefinition()).download();
  }

  print() {
    pdfMake.createPdf(this.getDocDefinition()).print();
  }



   getDocDefinition() {
     return {
      content: [
        {
          text: 'Белорусский национальный технический университет',
          alignment: 'right',
        },
        {
          text: 'Факультет информационных технологий и робототехники',
          alignment: 'right',
        },
        {
          text: 'Кафедра программирования и программирования',
          alignment: 'right',
        },
        {
          text: 'Отчёт о посещаемости студента ' + this.selected.fullName + ' за период занятий с ' + this.getDate(this.range.value.start) +' по '+ this.getDate(this.range.value.end)  +  '.',
          marginTop: 100,
          marginBottom: 50,
        },
        {
          table: {
            body: this.table
          }
        }
      ],
      info: {
        title:  'Отчёт по студенту ' + this.selected.fullName,
        author: '4eburek',
        subject: '4eburek',
        keywords: '4eburek, lol, kek',
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
   }
}
