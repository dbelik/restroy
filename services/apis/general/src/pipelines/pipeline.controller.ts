import {
  Body,
  Controller, Get, Param,
  Patch, Post, Req, UsePipes,
} from '@nestjs/common';
import {
  AtLeastOnePipe,
  PipelineCreateInputDto, PipelineModel, PipelineService, PipelineUpdateInputDto, SearchInputDto,
} from '@restroy/core';
import { FastifyRequest as Request } from 'fastify';

@Controller('pipelines')
export default class PipelineController {
  constructor(
    private readonly pipelineService: PipelineService,
  ) {}

  @Get(':pipelineId')
  public async getPipeline(
    @Req() request: Request,
      @Param('pipelineId') pipelineId: string,
  ): Promise<PipelineModel> {
    return this.pipelineService.getPipeline(pipelineId);
  }

  @Post('/search')
  public async getPipelines(
    @Req() request: Request,
      @Body() body: SearchInputDto,
  ): Promise<PipelineModel[]> {
    return this.pipelineService.searchPipelines(body);
  }

  @Patch(':pipelineId')
  @UsePipes(new AtLeastOnePipe())
  public async updatePipeline(
    @Req() request: Request,
      @Param('pipelineId') pipelineId: string,
      @Body() body: PipelineUpdateInputDto,
  ): Promise<PipelineModel> {
    return this.pipelineService.updatePipeline(pipelineId, body);
  }

  @Post()
  public async createPipeline(
    @Req() request: Request,
      @Body() body: PipelineCreateInputDto,
  ): Promise<PipelineModel> {
    return this.pipelineService.createPipeline(body);
  }
}
