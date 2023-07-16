import {
  Body,
  Controller, Get, Param, Patch, Post,
} from '@nestjs/common';
import {
  PipelineCreateHistoryRecordInputDto, PipelineHistoryModel,
  PipelineHistoryService, PipelineUpdateHistoryRecordInputDto,
} from '@restroy/core';

@Controller('/pipelines/:pipelineId/history')
export default class PipelineHistoryController {
  constructor(
    private readonly pipelineHistoryService: PipelineHistoryService,
  ) {}

  @Get('/:historyRecordId')
  public async getPipelineHistoryRecord(
    @Param('historyRecordId') historyRecordId: string,
  ): Promise<PipelineHistoryModel> {
    return this.pipelineHistoryService.getPipelineHistoryRecord(historyRecordId);
  }

  @Post()
  public async createPipelineHistoryRecord(
    @Param('pipelineId') pipelineId: string,
      @Body() body: PipelineCreateHistoryRecordInputDto,
  ): Promise<PipelineHistoryModel> {
    return this.pipelineHistoryService.createPipelineHistory(pipelineId, body);
  }

  @Patch('/:historyRecordId')
  public async updatePipelineHistoryRecord(
    @Param('historyRecordId') historyRecordId: string,
      @Body() body: PipelineUpdateHistoryRecordInputDto,
  ): Promise<PipelineHistoryModel> {
    return this.pipelineHistoryService.updatePipelineHistory(historyRecordId, body);
  }
}
