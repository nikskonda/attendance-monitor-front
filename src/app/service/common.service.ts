import { Injectable } from "@angular/core";
import { Role, User } from "./account.service";
import { AuthenticationService } from "./auth.service";

export interface ObjectRef {
  id: number;
  qualifier: string;
}

export interface Page<DTO> {
  content: DTO[];
  totalElements: number;
  pageable: Pageable;
}

export interface Pageable {
  page: number;
  size: number;
  sort: any;
}

export interface LinkByRole {
  path: string;
  text: string;
  role: Role[];
}

export const ROOT_URL = "http://localhost:8888";
// export const ROOT_URL = 'https://628b7a1bb9ed.ngrok.io';

export function getDate(date: Date): string {
  const result: Date = new Date(date);
  result.setMinutes(-result.getTimezoneOffset());
  return result.toISOString().substring(0, 10);
}

export function getDateFromStr(str: string): string {
  const date: Date = new Date(str);
  date.setMinutes(-date.getTimezoneOffset());
  return date.toISOString().substring(0, 10);
}

@Injectable({
  providedIn: "root",
})
export class CommonService {
  constructor(private authService: AuthenticationService) {}

  isInclude(roles: Role[]): boolean {
    return this.isInclude2(this.getCurrentUserRoles(), roles);
  }

  isInclude2(currentUserRoles: Role[], roles: Role[]): boolean {
    let result = false;
    roles.forEach((role) => {
      if (currentUserRoles.includes(role)) {
        result = true;
      }
    });
    return result;
  }

  getLinksByRole(links: LinkByRole[]) {
    const result = [];
    const currentUserRoles = this.getCurrentUserRoles();
    links.forEach((l) => {
      if (this.isInclude2(currentUserRoles, l.role)) {
        result.push(l);
      }
    });
    return result;
  }

  getCurrentUserRoles(): Role[] {
    let currentUserRoles: Role[] = [];
    const user: User = this.authService.getUserData();
    user?.roles.forEach((r) => currentUserRoles.push(Role[r.qualifier]));
    return currentUserRoles;
  }
}
