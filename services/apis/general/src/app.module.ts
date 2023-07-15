import { Module } from '@nestjs/common';

import DatabaseModule from './database.module';
import PipelineHistoryModule from './pipeline-history/pipeline-history.module';
import PipelineNodeModule from './pipeline-nodes/pipeline-node.module';
import PipelineModule from './pipelines/pipeline.module';

@Module({
  imports: [
    DatabaseModule,
    PipelineModule,
    PipelineNodeModule,
    PipelineHistoryModule,
  ],
})
export class AppModule {}
