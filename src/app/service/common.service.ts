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
