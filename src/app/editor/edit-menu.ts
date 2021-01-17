import { Role } from "../service/account.service";
import { LinkByRole } from "../service/common.service";

export const EDIT_MENU: LinkByRole[] = [
  {
    path: "/edit/speciality",
    text: "Специальности",
    role: [Role.EDITOR],
  },
  { path: "/edit/group", text: "Группы", role: [Role.EDITOR] },
  { path: "/edit/student", text: "Студенты", role: [Role.EDITOR] },
  {
    path: "/edit/position",
    text: "Должности",
    role: [Role.EDITOR],
  },
  {
    path: "/edit/professor",
    text: "Преподаватели",
    role: [Role.EDITOR],
  },
  {
    path: "/edit/subject",
    text: "Дисциплины",
    role: [Role.EDITOR],
  },
  {
    path: "/edit/lesson",
    text: "Занятия",
    role: [Role.EDITOR, Role.PROFESSOR],
  },
  {
    path: "/edit/account",
    text: "Пользователи",
    role: [Role.EDITOR],
  },
];
