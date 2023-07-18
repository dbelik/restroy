import { Inject, Injectable } from '@nestjs/common';

import { DatabaseClient, InputData } from '../../common';
import { PipelineNodeCreateInputDto, PipelineNodeUpdateInputDto } from '../dtos';
import { PipelineNodeHelper } from '../helpers';
import { PipelineNodeDecryptedModel } from '../models';
import { PipelineNodeRepository } from '../repositories';

@Injectable()
export default class PipelineNodeService {
  constructor(
    private readonly pipelineNodeRepository: PipelineNodeRepository,
    private readonly pipelineNodeHelper: PipelineNodeHelper,
    @Inject('DATABASE_POSTGRES') private readonly databaseClient: DatabaseClient,
  ) {}

  async getPipelineNodes(pipelineId: string): Promise<PipelineNodeDecryptedModel[]> {
    const nodes = await this.pipelineNodeRepository.getManyByField(this.databaseClient, pipelineId, 'pipeline_id');
    return nodes.map((node) => ({
      ...node,
      settings: this.pipelineNodeHelper.decryptNodeSettings(node.settings),
    }));
  }

  async updatePipelineNode(
    nodeId: string,
    data: PipelineNodeUpdateInputDto,
  ): Promise<PipelineNodeDecryptedModel> {
    const { settings, ...rest } = data;
    const updates: InputData = { ...rest };

    if (settings) {
      updates.settings = this.pipelineNodeHelper.encryptNodeSettings(settings);
    }

    const result = await this.pipelineNodeRepository.update(
      this.databaseClient,
      nodeId,
      updates,
    );
    return {
      ...result,
      settings: this.pipelineNodeHelper.decryptNodeSettings(result.settings),
    };
  }

  async createPipelineNode(
    pipelineId: string,
    data: PipelineNodeCreateInputDto,
  ): Promise<PipelineNodeDecryptedModel> {
    const result = await this.pipelineNodeRepository.createOne(
      this.databaseClient,
      {
        ...data,
        settings: this.pipelineNodeHelper.encryptNodeSettings({}),
        pipeline_id: pipelineId,
      },
    );
    return {
      ...result,
      settings: this.pipelineNodeHelper.decryptNodeSettings(result.settings),
    };
  }
}
