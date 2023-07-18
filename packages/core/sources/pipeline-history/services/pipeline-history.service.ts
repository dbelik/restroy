import { Inject, Injectable } from '@nestjs/common';
import { Pipeline } from '@restroy/pipeline-utils';

import { DatabaseClient } from '../../common';
import { PipelineNodeService } from '../../pipeline-nodes';
import { PipelineStatusEnum } from '../../pipelines/dtos';
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
    const result = await this.pipelineHistoryRepository.getOne(
      this.databaseClient,
      historyRecordId,
    );
    result.original_structure = Pipeline.pipelineToObject(
      this.pipelineHistoryHelper.decryptHistoryRecordStructure(
        Pipeline.tryCreateFromJSON(result.original_structure),
      ),
    );
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
    const originalSettings = this.pipelineHistoryHelper.encryptHistoryRecordStructure(
      this.pipelineHistoryHelper.injectNodesDataIntoStructure(
        Pipeline.tryCreateFromJSON(pipeline.structure),
        nodes,
      ),
    );

    const result = await this.pipelineHistoryRepository.createOne(
      this.databaseClient,
      {
        ...data,
        pipeline_id: pipelineId,
        original_structure: Pipeline.pipelineToString(originalSettings),
        status: PipelineStatusEnum.PENDING,
      },
    );
    result.original_structure = Pipeline.pipelineToObject(
      this.pipelineHistoryHelper.decryptHistoryRecordStructure(
        Pipeline.tryCreateFromJSON(result.original_structure),
      ),
    );
    return result;
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
    const status = this.pipelineHistoryHelper.chooseHistoryRecordStatusFromStructure(newStructure);
    const result = await this.pipelineHistoryRepository.update(
      this.databaseClient,
      historyRecordId,
      {
        original_structure: Pipeline.pipelineToString(
          this.pipelineHistoryHelper.encryptHistoryRecordStructure(
            newStructure,
          ),
        ),
        status,
        finished_at: status === PipelineStatusEnum.SUCCESS ? new Date().toISOString() : null,
      },
    );
    result.original_structure = Pipeline.pipelineToObject(
      this.pipelineHistoryHelper.decryptHistoryRecordStructure(
        Pipeline.tryCreateFromJSON(result.original_structure),
      ),
    );
    return result;
  }
}
