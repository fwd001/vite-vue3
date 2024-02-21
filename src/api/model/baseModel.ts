export interface BasicPageParams {
  page: number;
  pageSize: number;
}

export interface BasicFetchResult<T> {
  data: { items: T[]; total: number };
  msg?: string;
  code?: string;
}
