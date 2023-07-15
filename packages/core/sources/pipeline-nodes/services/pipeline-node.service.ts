import { Inject, Injectable } from '@nestjs/common';

import { DatabaseClient } from '../../common';
import { PipelineNodeCreateInputDto } from '../dtos';
import { PipelineNodeModel } from '../models';
import { PipelineNodeRepository } from '../repositories';

@Injectable()
export default class PipelineNodeService {
  constructor(
    private readonly pipelineRepository: PipelineNodeRepository,
    @Inject('DATABASE_POSTGRES') private readonly databaseClient: DatabaseClient,
  ) {}

  async getPipelineNodes(pipelineId: string): Promise<PipelineNodeModel[]> {
    return this.pipelineRepository.getPipelineNodes(this.databaseClient, pipelineId);
  }

  async createPipelineNode(
    pipelineId: string,
    data: PipelineNodeCreateInputDto,
  ): Promise<PipelineNodeModel> {
    return this.pipelineRepository.createPipelineNode(this.databaseClient, pipelineId, data);
  }
}
