export default class PipelineModel {
  id: string;

  name: string;

  description: string;

  interval: string;

  next_date: string;

  structure: string;

  executed_times: number;

  board_id: string;

  hourly_executed_times: number;

  hourly_failed_times: number;

  daily_executed_times: number;

  daily_failed_times: number;

  weekly_executed_times: number;

  weekly_failed_times: number;

  monthly_executed_times: number;

  monthly_failed_times: number;

  yearly_executed_times: number;

  yearly_failed_times: number;

  created_at: string;

  updated_at: string;

  deactivated_at?: string;

  deleted_at?: string;
}
