import { Module } from '@nestjs/common';
import {
  CronService,
  PipelineHistoryHelper,
  PipelineHistoryRepository, PipelineHistoryService,
  PipelineNodeRepository, PipelineNodeService, PipelinesRepository, PipelinesService,
} from '@restroy/core';

import PipelineHistoryController from './pipeline-history.controller';

@Module({
  providers: [
    PipelineNodeService,
    PipelineNodeRepository,
    PipelinesService,
    PipelinesRepository,
    PipelineHistoryHelper,
    PipelineHistoryService,
    CronService,
    PipelineHistoryRepository,
  ],
  controllers: [PipelineHistoryController],
})
export default class PipelineHistoryModule {}
