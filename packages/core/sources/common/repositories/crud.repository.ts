import { HttpException, HttpStatus } from '@nestjs/common';

import IRepositoryClient from './repository-client';
import SearchRepository from './search.repository';

export type InputData = {
  [key: string]: string | number | boolean | null;
};

export default abstract class CrudRepository<T> extends SearchRepository<T> {
  async getOne(client: IRepositoryClient, id: string): Promise<T> {
    const query = `SELECT * FROM ${this.table} WHERE id = $1`;
    const parameters = [id];
    const result = await client.query<T>(query, parameters);
    if (!result[0]) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return result[0];
  }

  async getManyByField(
    client: IRepositoryClient,
    id: string,
    fieldId: string,
  ) {
    const query = `SELECT * FROM ${this.table} WHERE ${fieldId} = $1`;
    const parameters = [id];
    const result = await client.query<T>(query, parameters);
    return result;
  }

  async getMany(client: IRepositoryClient, ids: string[]): Promise<T[]> {
    const query = `SELECT * FROM ${this.table} WHERE id IN $1`;
    const parameters = [ids];
    const result = await client.query<T>(query, parameters);
    return result;
  }

  async createOne(
    client: IRepositoryClient,
    data: InputData,
  ) {
    let fieldsString = '';
    let parametersString = '';
    const parameters: string[] = [];

    Object.entries(data).forEach(([key, value], index, array) => {
      parametersString += `$${index + 1}`;
      fieldsString += key;
      parameters.push(value.toString());
      if (index !== array.length - 1) {
        parametersString += ', ';
        fieldsString += ', ';
      }
    });

    const query = `
      INSERT INTO ${this.table} (
        ${fieldsString}
      ) VALUES (
        ${parametersString}
      ) RETURNING *;
    `;

    const result = await client.query<T>(query, parameters);
    if (!result[0]) {
      throw new HttpException('Failed to create', HttpStatus.BAD_REQUEST);
    }
    return result[0];
  }

  async update(
    client: IRepositoryClient,
    id: string,
    data: InputData,
  ): Promise<T> {
    let query = `UPDATE ${this.table} SET `;
    const parameters: (string | null)[] = [];
    Object.entries(data).forEach(([key, value], index, array) => {
      const parameter = value === null ? null : value.toString();
      parameters.push(parameter);
      query += `${key} = $${index + 1}`;
      query += index === array.length - 1 ? ' ' : ', ';
    });
    query += `WHERE id = $${parameters.length + 1} RETURNING *;`;
    parameters.push(id);

    const result = await client.query<T>(query, parameters);
    if (!result[0]) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return result[0];
  }

  async deleteOne(client: IRepositoryClient, id: string): Promise<T> {
    const query = `DELETE FROM ${this.table} WHERE id = $1 RETURNING *;`;
    const parameters = [id];
    const result = await client.query<T>(query, parameters);
    if (!result[0]) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return result[0];
  }
}
