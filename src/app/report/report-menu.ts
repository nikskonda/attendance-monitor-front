import { Role } from "../service/account.service";
import { LinkByRole } from "../service/common.service";

export const REPORT_MENU: LinkByRole[] = [
  {
    path: "/report/student",
    text: "По студенту",
    role: [Role.PARENT, Role.PROFESSOR, Role.REPORT_VIEW],
  },
  {
    path: "/report/group",
    text: "По группе",
    role: [Role.PROFESSOR, Role.REPORT_VIEW],
  },
  {
    path: "/report/studentDetails",
    text: "По студенту детальный",
    role: [Role.PARENT, Role.PROFESSOR, Role.REPORT_VIEW],
  },
  {
    path: "/report/professors",
    text: "Преподаватели",
    role: [Role.REPORT_VIEW],
  },
  {
    path: "/report/students",
    text: "Студенты",
    role: [Role.PROFESSOR, Role.REPORT_VIEW],
  },
];
