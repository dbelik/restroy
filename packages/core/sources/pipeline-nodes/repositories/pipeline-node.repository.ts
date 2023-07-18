import { Injectable } from '@nestjs/common';

import { CrudRepository } from '../../common';
import { PipelineNodeEncryptedModel } from '../models';

@Injectable()
export default class PipelineNodeRepository extends CrudRepository<PipelineNodeEncryptedModel> {
  table = 'workspace_management.pipeline_nodes';
}
