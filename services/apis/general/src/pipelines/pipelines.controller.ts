import {
  Body,
  Controller, Delete, Get, Param,
  Patch, Post, Req, UsePipes,
} from '@nestjs/common';
import {
  AtLeastOnePipe,
  PipelineAdvanceNextDateInputDto,
  PipelineCreateInputDto, PipelineModel, PipelinesService,
  PipelineUpdateInputDto, SearchInputDto, SearchResult,
} from '@restroy/core';
import { FastifyRequest as Request } from 'fastify';

@Controller('pipelines')
export default class PipelinesController {
  constructor(
    private readonly pipelineService: PipelinesService,
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
  ): Promise<SearchResult<PipelineModel>> {
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

  @Patch('/due')
  public async updateAndReturnDuePipelines(
    @Req() request: Request,
      @Body() body: PipelineAdvanceNextDateInputDto,
  ): Promise<SearchResult<PipelineModel>> {
    return this.pipelineService.advanceNextDate(body.next_date);
  }

  @Post()
  public async createPipeline(
    @Req() request: Request,
      @Body() body: PipelineCreateInputDto,
  ): Promise<PipelineModel> {
    return this.pipelineService.createPipeline(body);
  }

  @Delete(':pipelineId')
  public async deletePipeline(
    @Req() request: Request,
      @Param('pipelineId') pipelineId: string,
  ): Promise<PipelineModel> {
    return this.pipelineService.deletePipeline(pipelineId);
  }
}
