import { SearchInputDto } from '../dtos';
import IRepositoryClient from './repository-client';

export default abstract class SearchRepository<T> {
  async search(
    client: IRepositoryClient,
    search: SearchInputDto,
    allowedFields: string[] = [],
  ): Promise<T[]> {
    let query = 'SELECT * FROM workspace_management.pipelines';
    const parameters: string[] = [];
    const {
      filters, page, sort,
    } = search;
    if (filters && Object.keys(filters).length > 0) {
      query += ' WHERE ';

      Object.values(filters)
        .filter((filter) => allowedFields.includes(filter.name))
        .forEach((filter, index, array) => {
          if (filter.operator === 'IS NULL' || filter.operator === 'IS NOT NULL') {
            query += `${JSON.stringify(filter.name)} ${filter.operator}`;
          } else {
            parameters.push(
              JSON.stringify(filter.value),
            );
            query += `${JSON.stringify(filter.name)} ${filter.operator} $${parameters.length}`;
          }
          query += index === array.length - 1 ? ' ' : ' AND ';
        });
    }
    if (sort) {
      sort
        .filter((sortItem) => allowedFields.includes(sortItem.replace('-', '')))
        .forEach((sortItem, index) => {
          const order = sortItem.startsWith('-') ? 'DESC' : 'ASC';
          const field = sortItem.replace('-', '');
          query += `${index === 0 ? 'ORDER BY' : ','} ${JSON.stringify(field)} ${order} `;
        });
    }
    if (page) {
      const limit = page.limit || 50;
      const offset = page.offset || 0;
      parameters.push(limit.toString(), offset.toString());
      query += `LIMIT $${parameters.length - 1} OFFSET $${parameters.length} `;
    }
    query += ';';

    const result = await client.query<T>(query, parameters);
    return result;
  }
}
