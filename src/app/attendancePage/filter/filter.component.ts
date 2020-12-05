import { Component, Inject, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { L10nLocale, L10N_LOCALE } from "angular-l10n";
import { Volume } from "src/app/service/group.service";

@Component({
  templateUrl: "./filter.component.html",
  styleUrls: ["./filter.component.scss"],
})
export class FilterComponent implements OnInit {
  fgc = new FormGroup({
    subject: new FormControl("", [Validators.required]),
    group: new FormControl("", [Validators.required]),
    volume: new FormControl(Volume.FULL, [Validators.required]),
  });

  subjectTypesSelect = {
    name: "Все",
    completed: false,
    subtasks: [
      { name: "LECTURE", completed: false },
      { name: "PRACTICE", completed: false },
      { name: "LAB", completed: false },
    ],
  };
  allSubjectTypes: boolean = false;

  constructor(
    @Inject(L10N_LOCALE) public locale: L10nLocale,

    public dialogRef: MatDialogRef<FilterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.fgc.controls.subject.setValue(Number.parseInt(data.subjectId));
    this.fgc.controls.group.setValue(Number.parseInt(data.groupId));
    this.fgc.controls.volume.setValue(data.groupVolume);
    data.subjectTypes.forEach(
      (type) =>
        (this.subjectTypesSelect.subtasks.find(
          (st) => type === st.name
        ).completed = true)
    );
  }

  ngOnInit(): void {}

  close(toChange: boolean): void {
    this.dialogRef.close(
      toChange
        ? {
            subjectId: this.fgc.value.subject,
            subjectTypes: this.getSelectedSubjectTypes(),
            groupId: this.fgc.value.group,
            groupVolume: this.fgc.value.volume,
          }
        : null
    );
  }

  updateAllComplete() {
    this.allSubjectTypes =
      this.subjectTypesSelect.subtasks != null &&
      this.subjectTypesSelect.subtasks.every((t) => t.completed);
  }

  someComplete(): boolean {
    if (this.subjectTypesSelect.subtasks == null) {
      return false;
    }
    return (
      this.subjectTypesSelect.subtasks.filter((t) => t.completed).length > 0 &&
      !this.allSubjectTypes
    );
  }

  setAll(completed: boolean) {
    this.allSubjectTypes = completed;
    if (this.subjectTypesSelect.subtasks == null) {
      return;
    }
    this.subjectTypesSelect.subtasks.forEach((t) => (t.completed = completed));
  }

  getSelectedSubjectTypes() {
    let types: string[] = [];
    this.subjectTypesSelect.subtasks.forEach((t) => {
      if (t.completed) types.push(t.name);
    });
    return types;
  }

  isSubjectTypeEmpty() {
    return this.getSelectedSubjectTypes().length === 0;
  }
}
