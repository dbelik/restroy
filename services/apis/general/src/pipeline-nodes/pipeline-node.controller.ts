import {
  Body, Controller, Param, Post,
} from '@nestjs/common';
import { PipelineNodeCreateInputDto, PipelineNodeModel, PipelineNodeService } from '@restroy/core';

@Controller('/pipelines/:pipelineId/nodes')
export default class PipelineNodeController {
  constructor(
    private readonly pipelineNodeService: PipelineNodeService,
  ) {}

  @Post()
  public async createPipelineNode(
    @Body() body: PipelineNodeCreateInputDto,
      @Param('pipelineId') pipelineId: string,
  ): Promise<PipelineNodeModel> {
    return this.pipelineNodeService.createPipelineNode(pipelineId, body);
  }
}
