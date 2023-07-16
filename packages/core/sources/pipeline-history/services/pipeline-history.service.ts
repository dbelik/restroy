import {
  HttpException, HttpStatus, Inject, Injectable,
} from '@nestjs/common';
import { Pipeline } from '@restroy/pipeline-utils';

import { DatabaseClient } from '../../common';
import { PipelineNodeService } from '../../pipeline-nodes';
import { PipelinesService } from '../../pipelines/services';
import { PipelineCreateHistoryRecordInputDto, PipelineUpdateHistoryRecordInputDto } from '../dtos';
import { PipelineHistoryHelper } from '../helpers';
import { PipelineHistoryModel } from '../models';
import { PipelineHistoryRepository } from '../repositories';

@Injectable()
export default class PipelineHistoryService {
  constructor(
    private readonly pipelineHistoryRepository: PipelineHistoryRepository,
    private readonly pipelineNodeService: PipelineNodeService,
    private readonly pipelineService: PipelinesService,
    private readonly pipelineHistoryHelper: PipelineHistoryHelper,
    @Inject('DATABASE_POSTGRES') private readonly databaseClient: DatabaseClient,
  ) {}

  async getPipelineHistoryRecord(historyRecordId: string): Promise<PipelineHistoryModel> {
    const result = await this.pipelineHistoryRepository.getPipelineHistoryRecord(
      this.databaseClient,
      historyRecordId,
    );
    if (!result) {
      throw new HttpException('Pipelines history record not found', HttpStatus.NOT_FOUND);
    }
    return result;
  }

  async createPipelineHistory(
    pipelineId: string,
    data: PipelineCreateHistoryRecordInputDto,
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

  async updatePipelineHistory(
    historyRecordId: string,
    data: PipelineUpdateHistoryRecordInputDto,
  ): Promise<PipelineHistoryModel> {
    const historyRecord = await this.getPipelineHistoryRecord(historyRecordId);
    const newStructure = this.pipelineHistoryHelper.mergeNodesIntoHistoryRecordStructure(
      Pipeline.tryCreateFromJSON(historyRecord.original_structure),
      data.structure,
    );
    return this.pipelineHistoryRepository.updatePipelineHistoryRecordStructure(
      this.databaseClient,
      historyRecordId,
      Pipeline.pipelineToString(newStructure),
    );
  }
}
