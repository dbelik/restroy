import { Module } from '@nestjs/common';
import {
  CronService,
  PipelineNodeRepository, PipelineNodeService, PipelineRepository, PipelineService,
} from '@restroy/core';
import { PipelineHistoryRepository, PipelineHistoryService } from '@restroy/core/sources/pipeline-history';
import { PipelineHistoryHelper } from '@restroy/core/sources/pipeline-history/helpers';

import PipelineHistoryController from './pipeline-history.controller';

@Module({
  providers: [
    PipelineNodeService,
    PipelineNodeRepository,
    PipelineService,
    PipelineRepository,
    PipelineHistoryHelper,
    PipelineHistoryService,
    CronService,
    PipelineHistoryRepository,
  ],
  controllers: [PipelineHistoryController],
})
export default class PipelineHistoryModule {}
