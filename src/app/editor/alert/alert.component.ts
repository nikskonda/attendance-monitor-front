import {Component, Inject, OnInit} from '@angular/core';
import {MAT_SNACK_BAR_DATA} from '@angular/material/snack-bar';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styles: [`
    .example-pizza-party {
      color: hotpink;
    }
  `],
})
export class AlertComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data) { }
}
