import { Injectable } from '@nestjs/common';

import { CrudRepository } from '../../common';
import { PipelineHistoryModel } from '../models';

@Injectable()
export default class PipelinesRepository extends CrudRepository<PipelineHistoryModel> {
  table = 'workspace_management.pipeline_history';
}
