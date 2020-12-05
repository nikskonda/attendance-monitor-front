import { Role } from "../service/account.service";
import { LinkByRole } from "../service/common.service";

export const REPORT_MENU: LinkByRole[] = [
  {
    path: "/report/student",
    text: "По студенту",
    role: [Role.ADMIN, Role.PARENT, Role.PROFESSOR, Role.REPORT_VIEW],
  },
  {
    path: "/report/group",
    text: "По группе",
    role: [Role.ADMIN, Role.PROFESSOR, Role.REPORT_VIEW],
  },
  {
    path: "/report/studentDetails",
    text: "По студенту детальный",
    role: [Role.ADMIN, Role.PARENT, Role.PROFESSOR, Role.REPORT_VIEW],
  },
  {
    path: "/report/professors",
    text: "Преподаватели",
    role: [Role.ADMIN, Role.REPORT_VIEW],
  },
  {
    path: "/report/students",
    text: "Студенты",
    role: [Role.ADMIN, Role.PROFESSOR, Role.REPORT_VIEW],
  },
];
