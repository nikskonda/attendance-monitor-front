import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { PageEvent } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import {
  getRoles,
  AccountService,
  Role,
  User,
} from "src/app/service/account.service";
import { RemoveDialogComponent } from "../remove-dialog/remove-dialog.component";
import { AccountEditorDialogComponent } from "./account-editor-dialog/account-editor-dialog.component";

@Component({
  selector: "app-account-edit",
  templateUrl: "./account-edit.component.html",
  styleUrls: ["./account-edit.component.scss"],
})
export class AccountEditComponent implements OnInit {
  displayedColumns: string[] = [
    "reset",
    "lock",
    "edit",
    "position",
    "email",
    "mustUpdatePassword",
    "accountNonLocked",
    "roles",
    "fullName",
  ];
  dataSource;
  length = 0;
  pageSize = 10;
  currentPage = 0;

  list: User[] = [];

  search: string = "";

  selectedRole: string = "";
  roles: string[] = getRoles();

  constructor(
    private AccountService: AccountService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.searchList();
  }

  create() {
    const dialogRef = this.dialog.open(AccountEditorDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.searchList();
      }
    });
  }

  update(email) {
    const dialogRef = this.dialog.open(AccountEditorDialogComponent, {
      data: {
        email: email,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.searchList();
      }
    });
  }

  resetPassword(email: string, name: string) {
    const dialogRef = this.dialog.open(RemoveDialogComponent, {
      data: {
        name: `Сбросить пароль аккаунта ${email} ${
          name ? "(" + name + ")" : ""
        }?`,
        button: "Сбросить",
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.AccountService.resetPassword(email).subscribe();
      }
    });
  }

  changeLock(email: string, name: string, isLock: boolean) {
    const dialogRef = this.dialog.open(RemoveDialogComponent, {
      data: {
        name: `${
          isLock ? "Разблокировать" : "Заблокировать"
        } аккаунт ${email} ${name ? "(" + name + ")" : ""}?`,
        button: isLock ? "Разблокировать" : "Заблокировать",
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.AccountService.changeLock(email).subscribe(
          () => (isLock = !isLock),
          (error) => console.log(error),
          () => this.searchList()
        );
      }
    });
  }

  searchList(event?: PageEvent) {
    if (event) {
      if (this.pageSize !== event.pageSize) {
        this.pageSize = event.pageSize;
        this.currentPage = 0;
      } else {
        this.currentPage = event.pageIndex;
      }
    }
    this.AccountService.findUserPage(
      this.search,
      this.selectedRole,
      this.currentPage,
      this.pageSize
    ).subscribe(
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
            accountNonLocked: s.accountNonLocked,
          });
        });
        this.dataSource = new MatTableDataSource(newList);
      }
    );
  }
}
