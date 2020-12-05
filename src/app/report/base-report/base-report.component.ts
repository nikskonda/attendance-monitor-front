import { Component, Input, OnInit } from "@angular/core";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: "app-base-report",
  templateUrl: "./base-report.component.html",
  styleUrls: ["./base-report.component.scss"],
})
export class BaseReportComponent implements OnInit {
  @Input() show: boolean = false;
  @Input() docDefinition;
  @Input() refreshFunction: Function;

  constructor() {}

  ngOnInit(): void {}

  refreshData() {
    this.show = false;
    this.refreshFunction();
  }

  open() {
    pdfMake.createPdf(this.docDefinition).open();
  }

  download() {
    pdfMake.createPdf(this.docDefinition).download();
  }

  print() {
    pdfMake.createPdf(this.docDefinition).print();
  }
}
