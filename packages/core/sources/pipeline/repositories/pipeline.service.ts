import {
  HttpException, HttpStatus, Inject, Injectable,
} from '@nestjs/common';

import { DatabaseClient, SearchInputDto } from '../../utils';
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

  async searchPipelines(search: SearchInputDto): Promise<PipelineModel[]> {
    const allowedFields = [
      'id', 'name', 'description', 'interval', 'next_date', 'structure', 'executed_times',
      'board_id', 'hourly_executed_times', 'hourly_failed_times', 'daily_executed_times',
      'daily_failed_times', 'weekly_executed_times', 'weekly_failed_times', 'monthly_executed_times',
      'monthly_failed_times', 'yearly_executed_times', 'yearly_failed_times', 'created_at',
      'updated_at', 'deactivated_at', 'deleted_at',
    ];
    const result = await this.pipelineRepository.search(
      this.databaseClient,
      search,
      allowedFields,
    );
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
