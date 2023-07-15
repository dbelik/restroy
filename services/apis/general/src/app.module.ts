import { Module } from '@nestjs/common';

import DatabaseModule from './database.module';
import PipelineNodeModule from './pipeline-nodes/pipeline-node.module';
import PipelineModule from './pipelines/pipeline.module';

@Module({
  imports: [
    DatabaseModule,
    PipelineModule,
    PipelineNodeModule,
  ],
})
export class AppModule {}
