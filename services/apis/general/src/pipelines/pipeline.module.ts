import { Module } from '@nestjs/common';
import { PipelineRepository, PipelineService } from '@restroy/core';
import CronService from '@restroy/core/sources/utils/cron/cron.service';

import PipelineController from './pipeline.controller';

@Module({
  providers: [PipelineService, PipelineRepository, CronService],
  controllers: [PipelineController],
})
export class PipelineModule {}
