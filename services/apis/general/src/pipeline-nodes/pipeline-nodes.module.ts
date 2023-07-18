import { Module } from '@nestjs/common';
import {
  EncryptionHelper, PipelineNodeHelper, PipelineNodeRepository, PipelineNodeService,
} from '@restroy/core';

import PipelineNodesController from './pipeline-nodes.controller';

@Module({
  providers: [
    EncryptionHelper,
    PipelineNodeHelper,
    PipelineNodeService,
    PipelineNodeRepository,
  ],
  controllers: [PipelineNodesController],
})
export default class PipelineNodesModule {}
