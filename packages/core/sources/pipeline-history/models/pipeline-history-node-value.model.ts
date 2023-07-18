import { PipelineStatusEnum } from '../../pipelines/dtos';

export default class PipelineHistoryNodeEncryptedModelValueModel {
  status: PipelineStatusEnum;

  started_at: string;

  finished_at: string;

  plugin_id: string;
}
