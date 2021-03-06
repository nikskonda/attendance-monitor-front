import { Component, Inject, OnInit } from "@angular/core";
import { L10nLocale, L10N_LOCALE } from "angular-l10n";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-remove-dialog",
  templateUrl: "./remove-dialog.component.html",
  styleUrls: ["./remove-dialog.component.scss"],
})
export class RemoveDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
