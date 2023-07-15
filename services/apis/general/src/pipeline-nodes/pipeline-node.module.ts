import { Module } from '@nestjs/common';
import { PipelineNodeRepository, PipelineNodeService } from '@restroy/core';

import PipelineNodeController from './pipeline-node.controller';

@Module({
  providers: [PipelineNodeService, PipelineNodeRepository],
  controllers: [PipelineNodeController],
})
export default class PipelineNodeModule {}
