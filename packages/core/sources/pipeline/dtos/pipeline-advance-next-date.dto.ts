import { IsDateString, IsString, Validate } from 'class-validator';

import { UpTodayConstraint } from '../../utils';

export default class PipelineAdvanceNextDate {
  @IsString()
  @IsDateString()
  @Validate(UpTodayConstraint)
  readonly next_date: string;
}
