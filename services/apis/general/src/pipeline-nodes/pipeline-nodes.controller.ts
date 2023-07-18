import {
  Body, Controller, Param, Patch, Post, UsePipes,
} from '@nestjs/common';
import {
  AtLeastOnePipe,
  PipelineNodeCreateInputDto, PipelineNodeDecryptedModel, PipelineNodeService,
  PipelineNodeUpdateInputDto,
} from '@restroy/core';

@Controller('/pipelines/:pipelineId/nodes')
export default class PipelineNodesController {
  constructor(
    private readonly pipelineNodeService: PipelineNodeService,
  ) {}

  @Post()
  public async createPipelineNode(
    @Body() body: PipelineNodeCreateInputDto,
      @Param('pipelineId') pipelineId: string,
  ): Promise<PipelineNodeDecryptedModel> {
    return this.pipelineNodeService.createPipelineNode(pipelineId, body);
  }

  @Patch('/:nodeId')
  @UsePipes(new AtLeastOnePipe())
  public async updatePipelineNode(
    @Param('nodeId') nodeId: string,
      @Body() body: PipelineNodeUpdateInputDto,
  ): Promise<PipelineNodeDecryptedModel> {
    return this.pipelineNodeService.updatePipelineNode(nodeId, body);
  }
}
