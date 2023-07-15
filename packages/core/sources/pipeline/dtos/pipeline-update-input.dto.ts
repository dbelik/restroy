import { plainToInstance, Transform } from 'class-transformer';
import {
  IsBoolean, IsObject, IsOptional, IsString, Length, Matches, Validate, ValidateNested,
} from 'class-validator';

import { Regex } from '../../common';
import { PipelineStructureConstraint } from '../validators';
import PipelineStructureInputDto from './pipeline-structure-input.dto';

export default class PipelineUpdateInputDto {
  @IsString()
  @Length(1, 255)
  @IsOptional()
  readonly name?: string;

  @IsString()
  @IsOptional()
  @Length(1, 3000)
  readonly description?: string;

  @IsString()
  @IsOptional()
  @Matches(Regex.cron)
  readonly interval?: string;

  @ValidateNested()
  @Transform(
    ({ value }) => plainToInstance(PipelineStructureInputDto, value),
  )
  @IsObject()
  @Validate(PipelineStructureConstraint)
  @IsOptional()
  readonly structure?: PipelineStructureInputDto;

  // @TODO: Add validation that searches for a board with the given id
  @IsOptional()
  @Length(1, 255)
  @IsString()
  readonly board_id?: string;

  @IsOptional()
  @IsBoolean()
  readonly disabled?: boolean;
}
