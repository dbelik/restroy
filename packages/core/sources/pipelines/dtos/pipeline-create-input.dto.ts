import { IsString, Length, Matches } from 'class-validator';

import { Regex } from '../../common';

export default class PipelineCreateInputDto {
  @IsString()
  @Length(1, 255)
  readonly name: string;

  @IsString()
  @Length(1, 3000)
  readonly description: string;

  @IsString()
  @Matches(Regex.cron)
  readonly interval: string;

  @IsString()
  @Length(1, 255)
  readonly board_id: string;
}
