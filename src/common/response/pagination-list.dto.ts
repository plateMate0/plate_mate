export class PaginationListDto<T> {
  count: number;
  data: T[];

  constructor(count: number, data: T[]) {
    Object.assign(this, { count, data });
  }
}
