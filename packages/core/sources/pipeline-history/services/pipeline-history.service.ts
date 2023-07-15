import { Inject, Injectable } from '@nestjs/common';
import { Pipeline } from '@restroy/pipeline-utils';

import { DatabaseClient } from '../../common';
import { PipelineService } from '../../pipeline/services';
import { PipelineNodeService } from '../../pipeline-nodes';
import { PipelineCreateHistoryRecordDto } from '../dtos';
import { PipelineHistoryHelper } from '../helpers';
import { PipelineHistoryModel } from '../models';
import { PipelineHistoryRepository } from '../repositories';

@Injectable()
export default class PipelineHistoryService {
  constructor(
    private readonly pipelineHistoryRepository: PipelineHistoryRepository,
    private readonly pipelineNodeService: PipelineNodeService,
    private readonly pipelineService: PipelineService,
    private readonly pipelineHistoryHelper: PipelineHistoryHelper,
    @Inject('DATABASE_POSTGRES') private readonly databaseClient: DatabaseClient,
  ) {}

  async getPipelineHistoryRecord(historyRecordId: string): Promise<PipelineHistoryModel> {
    return this.pipelineHistoryRepository.getPipelineHistoryRecord(
      this.databaseClient,
      historyRecordId,
    );
  }

  async createPipelineHistory(
    pipelineId: string,
    data: PipelineCreateHistoryRecordDto,
  ): Promise<PipelineHistoryModel> {
    const [nodes, pipeline] = await Promise.all([
      this.pipelineNodeService.getPipelineNodes(pipelineId),
      this.pipelineService.getPipeline(pipelineId),
    ]);
    const originalSettings = this.pipelineHistoryHelper.injectNodesDataIntoStructure(
      Pipeline.tryCreateFromJSON(pipeline.structure),
      nodes,
    );
    return this.pipelineHistoryRepository.createPipelineHistoryRecord(
      this.databaseClient,
      pipelineId,
      Pipeline.pipelineToString(originalSettings),
      data,
    );
  }
}
