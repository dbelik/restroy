import { Injectable } from '@nestjs/common';

import { CrudRepository } from '../../common';
import { PluginModel } from '../models';

@Injectable()
export default class PluginsRepository extends CrudRepository<PluginModel> {
  table = 'workspace_management.plugins';
}
