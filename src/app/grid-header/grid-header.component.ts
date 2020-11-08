import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-grid-header",
  templateUrl: "./grid-header.component.html",
  styleUrls: ["./grid-header.component.css"],
})
export class GridHeaderComponent implements OnInit {
  @Input() text: string[];

  constructor() {}

  ngOnInit() {}
}
