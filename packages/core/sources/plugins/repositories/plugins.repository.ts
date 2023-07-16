import { Injectable } from '@nestjs/common';

import { IRepositoryClient } from '../../common';
import { PluginModel } from '../models';

@Injectable()
export default class PluginsRepository {
  async getPlugin(client: IRepositoryClient, id: string): Promise<PluginModel> {
    const query = 'SELECT * FROM workspace_management.plugins WHERE id = $1';
    const parameters = [id];
    const result = await client.query<PluginModel>(query, parameters);
    return result[0];
  }
}
