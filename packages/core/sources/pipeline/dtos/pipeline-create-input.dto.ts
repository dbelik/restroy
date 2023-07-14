import {
  IsJSON, IsNotEmpty, IsString, Length, Matches, Validate,
} from 'class-validator';

import regex from '../../common/regex';
import { PipelineStructureConstraint } from '../validators';

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

  @IsJSON()
  @IsString()
  @IsNotEmpty()
  @Validate(PipelineStructureConstraint)
  readonly structure: string;
}
