import { IsDateString } from 'class-validator';

export default class PipelineCreateHistoryRecordDto {
  @IsDateString()
    start_date: string;
}
