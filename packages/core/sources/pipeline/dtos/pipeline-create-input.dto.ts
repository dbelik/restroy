import { IsString, Length, Matches } from 'class-validator';

import regex from '../../regex';

export default class PipelineCreateInputDto {
  @IsString()
  @Length(1, 255)
  readonly name: string;

  @IsString()
  @Length(1, 3000)
  readonly description: string;

  @IsString()
  @Matches(regex.cron)
  readonly interval: string;

  @IsString()
  @Length(1, 255)
  readonly board_id: string;
}
