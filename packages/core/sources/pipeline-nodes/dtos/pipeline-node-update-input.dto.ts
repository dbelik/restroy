import {
  IsOptional, IsString, Length, Validate,
} from 'class-validator';

import { StringObjectConstraint } from '../../common';

export default class PipelineNodeUpdateInputDto {
  @IsString()
  @Length(1, 255)
  @IsOptional()
  readonly plugin_id?: string;

  @IsOptional()
  @Validate(StringObjectConstraint)
  readonly settings?: {
    readonly [key: string]: string;
  };
}
