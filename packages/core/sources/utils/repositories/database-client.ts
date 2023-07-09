import { Pool } from 'pg';

import IRepositoryClient from './repository-client';

export default class DatabaseClient implements IRepositoryClient {
  constructor(
    user: string,
    host: string,
    database: string,
    password: string,
    port: number,
  ) {
    this.pool = new Pool({
      user,
      host,
      database,
      password,
      port,
    });
  }

  private pool: Pool;

  async init() {
    await this.pool.connect();
  }

  async query<T>(query: string, parameters: unknown[]): Promise<T[]> {
    const data = await this.pool.query<T>(query, parameters);
    return data.rows;
  }
}
