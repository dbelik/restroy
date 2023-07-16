import { Module } from '@nestjs/common';
import { CronService, PipelinesRepository, PipelinesService } from '@restroy/core';

import PipelinesController from './pipelines.controller';

@Module({
  providers: [PipelinesService, PipelinesRepository, CronService],
  controllers: [PipelinesController],
})
export default class PipelinesModule {}
