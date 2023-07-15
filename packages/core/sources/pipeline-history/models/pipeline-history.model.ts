export default class PipelineHistoryModel {
  id: string;

  pipeline_id: string;

  status: string;

  original_settings: object;

  started_at: string;

  ended_at?: string;
}
