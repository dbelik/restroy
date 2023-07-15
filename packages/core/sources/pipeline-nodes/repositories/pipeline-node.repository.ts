import { Injectable } from '@nestjs/common';

import { IRepositoryClient } from '../../common';
import { PipelineNodeCreateInputDto } from '../dtos';
import { PipelineNodeModel } from '../models';

@Injectable()
export default class PipelineNodeRepository {
  async getPipelineNodes(
    client: IRepositoryClient,
    pipelineId: string,
  ): Promise<PipelineNodeModel[]> {
    const query = `
      SELECT * FROM workspace_management.pipeline_nodes
      WHERE pipeline_id = $1;
    `;
    const parameters = [pipelineId];
    const result = await client.query<PipelineNodeModel>(query, parameters);
    return result;
  }

  async createPipelineNode(
    client: IRepositoryClient,
    pipelineId: string,
    data: PipelineNodeCreateInputDto,
  ): Promise<PipelineNodeModel> {
    const query = `
      INSERT INTO workspace_management.pipeline_nodes (
        settings, pipeline_id, plugin_id
      ) VALUES ($1, $2, $3) RETURNING *;
    `;
    const parameters = [JSON.stringify({}), pipelineId, data.plugin_id];
    const result = await client.query<PipelineNodeModel>(query, parameters);
    return result[0];
  }
}