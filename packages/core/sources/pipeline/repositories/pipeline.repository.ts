import { Injectable } from '@nestjs/common';

import { CronService, SearchInputDto } from '../../utils';
import { IRepositoryClient, SearchRepository } from '../../utils/repositories';
import { PipelineModel } from '../models';

export type PipelineUpdateInput = Partial<Pick<PipelineModel, 'name' | 'description' | 'interval' | 'next_date' | 'board_id' | 'structure' | 'deactivated_at'>>;
export type PipelineCreateInput = Pick<PipelineModel, 'name' | 'description' | 'interval' | 'board_id'>;

@Injectable()
export default class PipelineRepository extends SearchRepository<PipelineModel> {
  constructor(
    private readonly cronService: CronService,
  ) {
    super();
  }

  async getPipeline(client: IRepositoryClient, id: string): Promise<PipelineModel> {
    const query = 'SELECT * FROM pipelines WHERE id = $1';
    const parameters = [id];
    const result = await client.query<PipelineModel>(query, parameters);
    return result[0];
  }

  async getPipelines(client: IRepositoryClient, ids: string[]): Promise<PipelineModel[]> {
    const query = 'SELECT * FROM pipelines WHERE id IN $1';
    const parameters = [ids];
    const result = await client.query<PipelineModel>(query, parameters);
    return result;
  }

  async searchPipelines(
    client: IRepositoryClient,
    search: SearchInputDto,
    allowedFields: string[],
  ) {
    return this.searchWithPages(client, search, 'workspace_management.pipelines', allowedFields);
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
    const nextDate = this.cronService.getNextDate(data.interval).toISOString();
    const query = `
      INSERT INTO workspace_management.pipelines (
        name, description, interval, next_date, board_id
      ) VALUES (
        $1, $2, $3, $4, $5
      ) RETURNING *;
    `;

    const parameters = [
      data.name, data.description, data.interval, nextDate, data.board_id,
    ];

    const result = await client.query<PipelineModel>(query, parameters);
    return result[0];
  }

  async advancePipelines(
    client: IRepositoryClient,
    pipelines: PipelineModel[],
    date: Date,
  ): Promise<PipelineModel[]> {
    if (pipelines.length === 0) {
      return [];
    }

    const pipelinesTable = 'workspace_management.pipelines';
    let query = `UPDATE ${pipelinesTable} SET next_date = CASE `;
    const parameters: string[] = [];

    pipelines.forEach((pipeline) => {
      const nextDate = this.cronService.getNextDate(pipeline.interval, date).toISOString();
      parameters.push(pipeline.id, nextDate);
      query += `WHEN id = $${parameters.length - 1} THEN $${parameters.length}::timestamptz `;
    });

    query += 'END WHERE id IN (';

    pipelines.forEach((pipeline, index) => {
      parameters.push(pipeline.id);
      query += `$${parameters.length}`;
      if (index < pipelines.length - 1) {
        query += ', ';
      }
    });

    query += ') RETURNING *;';

    return client.query<PipelineModel>(query, parameters);
  }
}
