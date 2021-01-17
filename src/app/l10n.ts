import { NativeDateAdapter } from "@angular/material/core";
import { MatPaginatorIntl } from "@angular/material/paginator";
import { L10nConfig, L10nLoader } from "angular-l10n";

const ruRangeLabel = (page: number, pageSize: number, length: number) => {
  if (length == 0 || pageSize == 0) {
    return `0 из ${length}`;
  }

  length = Math.max(length, 0);

  const startIndex = page * pageSize;

  // If the start index exceeds the list length, do not try and fix the end index to the end.
  const endIndex =
    startIndex < length
      ? Math.min(startIndex + pageSize, length)
      : startIndex + pageSize;

  return `${startIndex + 1} - ${endIndex} из ${length}`;
};

export function getRuPaginatorIntl() {
  const paginatorIntl = new MatPaginatorIntl();

  paginatorIntl.itemsPerPageLabel = "Строк в таблице";
  paginatorIntl.nextPageLabel = "Следующая страница";
  paginatorIntl.previousPageLabel = "Предыдущая страница";
  paginatorIntl.getRangeLabel = ruRangeLabel;

  return paginatorIntl;
}

export class RuDateAdapter extends NativeDateAdapter {
  getFirstDayOfWeek(): number {
    return 1;
  }
}

export function initL10n(l10nLoader: L10nLoader): () => Promise<void> {
  return () => l10nLoader.init();
}

const i18nAsset = {
  // 'en-US': {

  // },
  "ru-RU": {
    // ADMIN: "Администратор",
    EDITOR: "Модератор",
    STUDENT: "Студент",
    PARENT: "Родитель",
    PROFESSOR: "Преподаватель",
    REPORT_VIEW: "Проверяющий",

    FULL: "Группа",
    FIRST: "1",
    SECOND: "2",
    THIRD: "3",

    LECTURE: "Лекция",
    PRACTICE: "Практическое",
    LAB: "Лабораторное",
    LECTURE_SH: "Лек.",
    PRACTICE_SH: "Практ.",
    LAB_SH: "Лаб.",

    button: {
      create: "Создать",
      add: "Добавить",
      remove: "Удалить",
      filter: "Фильтр",
      save: "Сохранить",
      update: "Обновить",
    },
  },
};

export const l10nConfig: L10nConfig = {
  format: "language-region",
  providers: [{ name: "app", asset: i18nAsset }],
  cache: true,
  keySeparator: ".",
  defaultLocale: { language: "ru-RU", currency: "USD" },
  schema: [
    {
      locale: { language: "ru-RU", currency: "USD" },
      dir: "ltr",
      text: "Russian",
    },
    // {
    //   locale: { language: "en-US", currency: "USD" },
    //   dir: "ltr",
    //   text: "United States",
    // },
  ],
};
