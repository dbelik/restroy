import { FilterInputDto, SearchInputDto } from '../dtos';
import IRepositoryClient from './repository-client';

export type SearchResult<T> = {
  data: T[];

  meta: {
    total: number;
    page: number;
    limit: number;
  }
};

export type SearchDataResult<T> = {
  rows: T[];
  total: number;
};

export default abstract class SearchRepository<T> {
  protected defaultLimit = 50;

  protected defaultPage = 1;

  protected table: string;

  private constructWhereClause(
    parameters: string[],
    filters: FilterInputDto[],
    allowedFields: string[],
  ): string {
    let whereClause = '';
    if (filters && filters.length > 0) {
      const allowedFilters = filters.filter((filter) => allowedFields.includes(filter.name));

      if (allowedFilters.length > 0) {
        whereClause += ' WHERE ';
        allowedFilters.forEach((filter, index, array) => {
          if (filter.operator === 'IS NULL' || filter.operator === 'IS NOT NULL') {
            whereClause += `${JSON.stringify(filter.name)} ${filter.operator}`;
          } else {
            parameters.push(
              JSON.stringify(filter.value),
            );
            whereClause += `${JSON.stringify(filter.name)} ${filter.operator} $${parameters.length}`;
          }
          whereClause += index === array.length - 1 ? ' ' : ' AND ';
        });
      }
    }
    return whereClause;
  }

  private constructSortClause(
    sort: string[],
    allowedFields: string[] = [],
  ) {
    let sortClause = '';
    if (sort) {
      sort
        .filter((sortItem) => allowedFields.includes(sortItem.replace('-', '')))
        .forEach((sortItem, index) => {
          const order = sortItem.startsWith('-') ? 'DESC' : 'ASC';
          const field = sortItem.replace('-', '');
          sortClause += `${index === 0 ? 'ORDER BY' : ','} ${JSON.stringify(field)} ${order} `;
        });
    }
    return sortClause;
  }

  private constructPaginationClause(
    parameters: string[],
    page: number,
    limit: number,
  ): string {
    let paginationClause = '';
    const offset = (page - 1) * limit;
    parameters.push(limit.toString(), offset.toString());
    paginationClause += `LIMIT $${parameters.length - 1} OFFSET $${parameters.length} `;
    return paginationClause;
  }

  async searchWithPages(
    client: IRepositoryClient,
    search: SearchInputDto,
    allowedFields: string[] = [],
  ): Promise<SearchResult<T>> {
    let countQuery = `
    (SELECT COUNT(*)::int
      FROM ${this.table}
    `;
    let dataQuery = `
      (SELECT json_agg(t.*) FROM (
        SELECT * FROM workspace_management.pipelines
    `;

    const parameters: string[] = [];
    const {
      filters, pagination, sort,
    } = search;

    const page = pagination?.page ?? this.defaultPage;
    const limit = pagination?.limit ?? this.defaultLimit;

    const whereClause = this.constructWhereClause(parameters, filters, allowedFields);
    const sortClause = this.constructSortClause(sort, allowedFields);
    const paginationClause = this.constructPaginationClause(parameters, page, limit);

    countQuery += `${whereClause}) AS total`;
    dataQuery += `${whereClause} ${sortClause} ${paginationClause}) AS t) AS rows`;

    const finalQuery = `
      SELECT
        ${countQuery},
        ${dataQuery}
    `;

    const [data] = await client.query<SearchDataResult<T>>(finalQuery, parameters);

    return {
      data: data.rows ?? [],
      meta: {
        total: data.total,
        page,
        limit,
      },
    };
  }
}
