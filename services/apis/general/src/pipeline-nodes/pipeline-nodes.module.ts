import { Module } from '@nestjs/common';
import { PipelineNodeRepository, PipelineNodeService } from '@restroy/core';

import PipelineNodesController from './pipeline-nodes.controller';

@Module({
  providers: [PipelineNodeService, PipelineNodeRepository],
  controllers: [PipelineNodesController],
})
export default class PipelineNodesModule {}
