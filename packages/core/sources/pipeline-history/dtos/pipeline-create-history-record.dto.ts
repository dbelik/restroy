import { IsDateString } from 'class-validator';

export default class PipelineCreateHistoryRecordInputDto {
  @IsDateString()
  readonly start_date: string;
}
