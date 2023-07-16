import { Injectable } from '@nestjs/common';

import { IRepositoryClient } from '../../common';
import { PipelineCreateHistoryRecordInputDto } from '../dtos';
import { PipelineHistoryModel } from '../models';

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

  async updatePipelineHistoryRecordStructure(
    client: IRepositoryClient,
    id: string,
    structure: string,
  ): Promise<PipelineHistoryModel> {
    const query = `
      UPDATE workspace_management.pipeline_history
      SET original_structure = $1
      WHERE id = $2
      RETURNING *;
    `;
    const parameters = [structure, id];
    const result = await client.query<PipelineHistoryModel>(query, parameters);
    return result[0];
  }
}
