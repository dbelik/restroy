import {
  HttpException, HttpStatus, Inject, Injectable,
} from '@nestjs/common';

import { DatabaseClient } from '../../utils';
import CronService from '../../utils/cron/cron.service';
import { PipelineCreateInputDto, PipelineUpdateInputDto } from '../dtos';
import { PipelineModel } from '../models';
import PipelineRepository from './pipeline.repository';

@Injectable()
export default class PipelineService {
  constructor(
    private readonly pipelineRepository: PipelineRepository,
    private readonly cronService: CronService,
    @Inject('DATABASE_POSTGRES') private readonly databaseClient: DatabaseClient,
  ) {}

  async getPipeline(id: PipelineModel['id']): Promise<PipelineModel> {
    const result = await this.pipelineRepository.getPipeline(this.databaseClient, id);
    if (!result) {
      throw new HttpException('Pipeline not found', HttpStatus.NOT_FOUND);
    }
    return result;
  }

  async createPipeline(data: PipelineCreateInputDto): Promise<PipelineModel> {
    const nextDate = this.cronService.getNextDate(data.interval).toISOString();
    const pipeline = {
      ...data,
      next_date: nextDate,
    };
    return this.pipelineRepository.createPipeline(this.databaseClient, pipeline);
  }

  async updatePipeline(id: PipelineModel['id'], data: PipelineUpdateInputDto): Promise<PipelineModel> {
    const { disabled, ...pipelineData } = data;
    const pipeline = {
      ...pipelineData,
      deactivated_at: disabled ? new Date().toISOString() : undefined,
    };
    return this.pipelineRepository.updatePipeline(this.databaseClient, id, pipeline);
  }
}
