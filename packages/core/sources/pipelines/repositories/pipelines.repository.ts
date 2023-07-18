import { Injectable } from '@nestjs/common';

import { CronService } from '../../common';
import { CrudRepository, IRepositoryClient } from '../../common/repositories';
import { PipelineModel } from '../models';

export type PipelineUpdateInput = Partial<Pick<PipelineModel, 'name' | 'description' | 'interval' | 'next_date' | 'board_id' | 'deactivated_at'> & {
  structure: string;
}>;
export type PipelineCreateInput = Pick<PipelineModel, 'name' | 'description' | 'interval' | 'board_id'>;

@Injectable()
export default class PipelinesRepository extends CrudRepository<PipelineModel> {
  constructor(
    private readonly cronService: CronService,
  ) {
    super();
  }

  table = 'workspace_management.pipelines';

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
