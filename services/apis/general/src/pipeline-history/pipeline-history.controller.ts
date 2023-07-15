import {
  Body,
  Controller, Get, Param, Post,
} from '@nestjs/common';
import { PipelineCreateHistoryRecordDto, PipelineHistoryModel, PipelineHistoryService } from '@restroy/core';

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
      @Body() body: PipelineCreateHistoryRecordDto,
  ): Promise<PipelineHistoryModel> {
    return this.pipelineHistoryService.createPipelineHistory(pipelineId, body);
  }
}
