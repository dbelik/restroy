import { Module } from '@nestjs/common';

import DatabaseModule from './database.module';
import PipelineHistoryModule from './pipeline-history/pipeline-history.module';
import PipelineNodesModule from './pipeline-nodes/pipeline-nodes.module';
import PipelinesModule from './pipelines/pipelines.module';
import PluginsModule from './plugins/plugins.module';

@Module({
  imports: [
    DatabaseModule,
    PipelinesModule,
    PipelineNodesModule,
    PipelineHistoryModule,
    PluginsModule,
  ],
})
export class AppModule {}
