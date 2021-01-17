import { Role } from "../service/account.service";
import { LinkByRole } from "../service/common.service";

export interface LinkWithIconByRole extends LinkByRole {
  icon: string;
}

export const MENU: LinkWithIconByRole[] = [
  {
    icon: "schedule",
    path: "/schedule",
    text: "Расписание",
    role: [Role.PROFESSOR, Role.STUDENT],
  },
  {
    icon: "transfer_within_a_station",
    path: "/attendance",
    text: "Посещаемость",
    role: [Role.PROFESSOR],
  },
];
