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

export const ROOT_URL = "http://localhost:8888";
// export const ROOT_URL = 'https://628b7a1bb9ed.ngrok.io';

export function getDate(date: Date): string {
  date.setMinutes(-date.getTimezoneOffset());
  return date.toISOString().substring(0, 10);
}

export function getDateFromStr(str: string): string {
  const date: Date = new Date(str);
  date.setMinutes(-date.getTimezoneOffset());
  return date.toISOString().substring(0, 10);
}
