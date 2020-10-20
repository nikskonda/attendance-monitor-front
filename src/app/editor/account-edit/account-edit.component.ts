import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { PageEvent } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { PersonService, User } from "src/app/service/user.service";
import { RemoveDialogComponent } from "../remove-dialog/remove-dialog.component";

@Component({
  selector: "app-account-edit",
  templateUrl: "./account-edit.component.html",
  styleUrls: ["./account-edit.component.css"],
})
export class AccountEditComponent implements OnInit {
  displayedColumns: string[] = [
    "position",
    "fullName",
    "mustUpdatePassword",
    "email",
    "roles",
    "reset",
  ];
  dataSource;
  length = 0;
  pageSize = 10;
  currentPage = 0;

  list: User[] = [];

  constructor(private personService: PersonService, public dialog: MatDialog) {}

  ngOnInit() {
    this.updateList();
  }

  updateList(event?: PageEvent) {
    if (event) {
      if (this.pageSize !== event.pageSize) {
        this.pageSize = event.pageSize;
        this.currentPage = 0;
      } else {
        this.currentPage = event.pageIndex;
      }
    }
    this.personService.getUsersPage(this.currentPage, this.pageSize).subscribe(
      (data) => {
        this.list = data.content;
        this.length = data.totalElements;
      },
      (error) => console.log(error),
      () => {
        let newList = [];
        let i = this.currentPage * this.pageSize + 1;
        this.list?.forEach((s) => {
          newList.push({
            position: i++,
            fullName: s.fullName,
            mustUpdatePassword: s.mustUpdatePassword,
            email: s.qualifier,
            roles: s.roles.map((a) => a.qualifier),
          });
        });
        this.dataSource = new MatTableDataSource(newList);
      }
    );
  }

  resetPassword(email: string, name: string) {
    const dialogRef = this.dialog.open(RemoveDialogComponent, {
      data: {
        name: `Сбросить пароль для ${name} (${email})?`,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.personService.resetPassword(email).subscribe();
      }
    });
  }
}
