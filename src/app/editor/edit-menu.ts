import { Role } from "../service/account.service";
import { LinkByRole } from "../service/common.service";

export const EDIT_MENU: LinkByRole[] = [
  { path: "/edit/speciality", text: "Специальности", role: [Role.ADMIN] },
  { path: "/edit/group", text: "Группы", role: [Role.ADMIN] },
  { path: "/edit/student", text: "Студенты", role: [Role.ADMIN] },
  { path: "/edit/professor", text: "Преподаватели", role: [Role.ADMIN] },
  { path: "/edit/subject", text: "Дисциплины", role: [Role.ADMIN] },
  {
    path: "/edit/lesson",
    text: "Занятия",
    role: [Role.ADMIN, Role.PROFESSOR],
  },
  {
    path: "/edit/account",
    text: "Пользователи",
    role: [Role.ADMIN],
  },
];
