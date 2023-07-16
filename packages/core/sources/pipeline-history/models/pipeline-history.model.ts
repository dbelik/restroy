import { PipelineStatusEnum } from '../../pipelines/dtos';

export default class PipelineHistoryModel {
  id: string;

  pipeline_id: string;

  status: PipelineStatusEnum;

  original_structure: object;

  started_at: string;

  finished_at?: string;
}
