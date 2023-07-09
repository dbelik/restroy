import { Injectable } from '@nestjs/common';

import { IRepositoryClient, SearchRepository } from '../../utils/repositories';
import { PipelineModel } from '../models';

export type PipelineUpdateInput = Partial<Pick<PipelineModel, 'name' | 'description' | 'interval' | 'next_date' | 'board_id' | 'structure' | 'deactivated_at'>>;
export type PipelineCreateInput = Pick<PipelineModel, 'name' | 'description' | 'interval' | 'next_date' | 'board_id'>;

@Injectable()
export default class PipelineRepository extends SearchRepository<PipelineModel> {
  async getPipeline(client: IRepositoryClient, id: string): Promise<PipelineModel> {
    const query = 'SELECT * FROM pipelines WHERE id = $1';
    const parameters = [id];
    const result = await client.query<PipelineModel>(query, parameters);
    return result[0];
  }

  async updatePipeline(
    client: IRepositoryClient,
    id: string,
    data: PipelineUpdateInput,
  ): Promise<PipelineModel> {
    let query = 'UPDATE workspace_management.pipelines SET ';
    const parameters: string[] = [];
    Object.entries(data).forEach(([key, value], index, array) => {
      parameters.push(value);
      query += `${key} = $${index + 1}`;
      query += index === array.length - 1 ? ' ' : ', ';
    });
    query += `WHERE id = $${parameters.length + 1} RETURNING *;`;
    parameters.push(id);

    const result = await client.query<PipelineModel>(query, parameters);
    return result[0];
  }

  async createPipeline(
    client: IRepositoryClient,
    data: PipelineCreateInput,
  ): Promise<PipelineModel> {
    const query = `
      INSERT INTO workspace_management.pipelines (
        name, description, interval, next_date, board_id
      ) VALUES (
        $1, $2, $3, $4, $5
      ) RETURNING *;
    `;

    const parameters = [
      data.name, data.description, data.interval, data.next_date, data.board_id,
    ];

    const result = await client.query<PipelineModel>(query, parameters);
    return result[0];
  }
}
