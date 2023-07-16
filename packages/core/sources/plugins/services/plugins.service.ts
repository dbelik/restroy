import {
  HttpException, HttpStatus, Inject, Injectable,
} from '@nestjs/common';

import { DatabaseClient } from '../../common';
import { PluginModel } from '../models';
import { PluginsRepository } from '../repositories';

@Injectable()
export default class PluginsService {
  constructor(
    private readonly pluginsRepository: PluginsRepository,
    @Inject('DATABASE_POSTGRES') private readonly databaseClient: DatabaseClient,
  ) {}

  async getPlugin(id: string): Promise<PluginModel> {
    const result = await this.pluginsRepository.getPlugin(this.databaseClient, id);
    if (!result) {
      throw new HttpException('Plugin not found', HttpStatus.NOT_FOUND);
    }
    return result;
  }
}
