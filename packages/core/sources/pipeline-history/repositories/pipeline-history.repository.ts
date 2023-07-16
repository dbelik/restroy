import { Injectable } from '@nestjs/common';

import { IRepositoryClient } from '../../common';
import { PipelineCreateHistoryRecordInputDto } from '../dtos';
import { PipelineHistoryModel } from '../models';

export type PipelineHistoryRecordInput = Pick<PipelineHistoryModel, 'status' | 'finished_at'> & {
  original_structure?: string;
};

@Injectable()
export default class PipelinesRepository {
  async getPipelineHistoryRecord(
    client: IRepositoryClient,
    id: string,
  ): Promise<PipelineHistoryModel> {
    const query = `
      SELECT * FROM workspace_management.pipeline_history
      WHERE id = $1;
    `;
    const parameters = [id];
    const result = await client.query<PipelineHistoryModel>(query, parameters);
    return result[0];
  }

  async createPipelineHistoryRecord(
    client: IRepositoryClient,
    pipelineId: string,
    settings: string,
    data: PipelineCreateHistoryRecordInputDto,
  ): Promise<PipelineHistoryModel> {
    const query = `
      INSERT INTO workspace_management.pipeline_history (
        pipeline_id,
        status,
        original_structure,
        started_at
      ) VALUES ($1, $2, $3, $4) RETURNING *;
    `;
    const parameters = [pipelineId, 'pending', settings, data.start_date];
    const result = await client.query<PipelineHistoryModel>(query, parameters);
    return result[0];
  }

  async updatePipelineHistoryRecord(
    client: IRepositoryClient,
    id: string,
    data: PipelineHistoryRecordInput,
  ): Promise<PipelineHistoryModel> {
    let query = 'UPDATE workspace_management.pipeline_history SET ';
    const parameters: string[] = [];
    Object.entries(data).forEach(([key, value], index, array) => {
      parameters.push(value);
      query += `${key} = $${index + 1}`;
      query += index === array.length - 1 ? ' ' : ', ';
    });
    query += `WHERE id = $${parameters.length + 1} RETURNING *;`;
    parameters.push(id);

    const result = await client.query<PipelineHistoryModel>(query, parameters);
    return result[0];
  }
}
