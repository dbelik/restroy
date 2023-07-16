import {
  Controller, Get, Param, Req,
} from '@nestjs/common';
import { PluginModel, PluginsService } from '@restroy/core';
import { FastifyRequest as Request } from 'fastify';

@Controller('plugins')
export default class PluginsController {
  constructor(
    private readonly pluginService: PluginsService,
  ) {}

  @Get(':pluginId')
  public async getPlugin(
    @Req() request: Request,
      @Param('pluginId') pluginId: string,
  ): Promise<PluginModel> {
    return this.pluginService.getPlugin(pluginId);
  }
}
