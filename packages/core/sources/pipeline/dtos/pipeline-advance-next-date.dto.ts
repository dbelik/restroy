import { IsDateString, IsString, Validate } from 'class-validator';

import { UpTodayConstraint } from '../../common';

export default class PipelineAdvanceNextDate {
  @IsString()
  @IsDateString()
  @Validate(UpTodayConstraint)
  readonly next_date: string;
}
