import {
  HttpException, HttpStatus, Inject, Injectable,
} from '@nestjs/common';

import { DatabaseClient, SearchInputDto, SearchResult } from '../../common';
import { FilterOperatorsEnum } from '../../common/dtos/filter-input.dto';
import { PipelineCreateInputDto, PipelineUpdateInputDto } from '../dtos';
import { PipelineModel } from '../models';
import PipelineRepository, { PipelineUpdateInput } from '../repositories/pipeline.repository';

@Injectable()
export default class PipelineService {
  constructor(
    private readonly pipelineRepository: PipelineRepository,
    @Inject('DATABASE_POSTGRES') private readonly databaseClient: DatabaseClient,
  ) {}

  async getPipeline(id: PipelineModel['id']): Promise<PipelineModel> {
    const result = await this.pipelineRepository.getPipeline(this.databaseClient, id);
    if (!result) {
      throw new HttpException('Pipeline not found', HttpStatus.NOT_FOUND);
    }
    return result;
  }

  async getPipelines(ids: PipelineModel['id'][]): Promise<PipelineModel[]> {
    const result = await this.pipelineRepository.getPipelines(this.databaseClient, ids);
    if (!result) {
      throw new HttpException('Pipelines not found', HttpStatus.NOT_FOUND);
    }
    return result;
  }

  async searchPipelines(search: SearchInputDto): Promise<SearchResult<PipelineModel>> {
    const allowedFields = [
      'id', 'name', 'description', 'interval', 'next_date', 'structure', 'executed_times',
      'board_id', 'hourly_executed_times', 'hourly_failed_times', 'daily_executed_times',
      'daily_failed_times', 'weekly_executed_times', 'weekly_failed_times', 'monthly_executed_times',
      'monthly_failed_times', 'yearly_executed_times', 'yearly_failed_times', 'created_at',
      'updated_at', 'deactivated_at', 'deleted_at',
    ];
    const result = await this.pipelineRepository.searchPipelines(
      this.databaseClient,
      search,
      allowedFields,
    );
    return result;
  }

  async createPipeline(data: PipelineCreateInputDto): Promise<PipelineModel> {
    return this.pipelineRepository.createPipeline(this.databaseClient, data);
  }

  async updatePipeline(id: PipelineModel['id'], data: PipelineUpdateInputDto): Promise<PipelineModel> {
    const { disabled, structure, ...pipelineData } = data;
    const pipeline: PipelineUpdateInput = {
      ...pipelineData,
    };
    if (structure) {
      pipeline.structure = JSON.stringify(structure);
    }
    if (disabled) {
      pipeline.deactivated_at = new Date().toISOString();
    }

    const result = await this.pipelineRepository.updatePipeline(this.databaseClient, id, pipeline);
    if (!result) {
      throw new HttpException('Pipeline not found', HttpStatus.NOT_FOUND);
    }
    return result;
  }

  async advanceNextDate(dateString: string): Promise<SearchResult<PipelineModel>> {
    const date = new Date(dateString);
    const pipelines = await this.pipelineRepository.searchPipelines(this.databaseClient, {
      filters: [{
        name: 'next_date',
        operator: FilterOperatorsEnum.LESS_THAN_OR_EQUALS,
        value: date.toISOString(),
      }],
    }, ['next_date']);

    if (pipelines.meta.total === 0) {
      return pipelines;
    }

    const result = await this.pipelineRepository.advancePipelines(
      this.databaseClient,
      pipelines.data,
      date,
    );

    return {
      data: result,
      meta: {
        total: pipelines.meta.total,
        page: pipelines.meta.page,
        limit: pipelines.meta.limit,
      },
    };
  }

  async deletePipeline(id: PipelineModel['id']): Promise<PipelineModel> {
    const data = await this.pipelineRepository.deletePipeline(this.databaseClient, id);
    if (!data) {
      throw new HttpException('Pipeline not found', HttpStatus.NOT_FOUND);
    }
    return data;
  }
}
