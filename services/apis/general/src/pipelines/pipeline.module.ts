import { Module } from '@nestjs/common';
import { CronService, PipelineRepository, PipelineService } from '@restroy/core';

import PipelineController from './pipeline.controller';

@Module({
  providers: [PipelineService, PipelineRepository, CronService],
  controllers: [PipelineController],
})
export default class PipelineModule {}
