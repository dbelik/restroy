import { IsDateString } from 'class-validator';

export default class PipelineCreateHistoryRecordInputDto {
  @IsDateString()
  readonly started_at: string;
}
