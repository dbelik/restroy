import { Module } from '@nestjs/common';
import {
  CronService,
  EncryptionHelper,
  PipelineHistoryHelper,
  PipelineHistoryRepository, PipelineHistoryService,
  PipelineNodeHelper,
  PipelineNodeRepository, PipelineNodeService, PipelinesRepository, PipelinesService,
} from '@restroy/core';

import PipelineHistoryController from './pipeline-history.controller';

@Module({
  providers: [
    EncryptionHelper,
    PipelineNodeHelper,
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
