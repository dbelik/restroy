import { Module } from '@nestjs/common';
import { PluginsRepository, PluginsService } from '@restroy/core';

import PluginsController from './plugins.controller';

@Module({
  providers: [PluginsService, PluginsRepository],
  controllers: [PluginsController],
})
export default class PluginsModule {}
