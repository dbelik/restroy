import { Module } from '@nestjs/common';

import { DatabaseModule } from './database.module';
import { PipelineModule } from './pipelines/pipeline.module';

@Module({
  imports: [DatabaseModule, PipelineModule],
})
export class AppModule {}
