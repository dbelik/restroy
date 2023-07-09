import {
  IsBoolean,
  IsJSON,
  IsNotEmpty, IsOptional, IsString, Length, Matches,
} from 'class-validator';

import regex from '../../regex';

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
  @Matches(regex.cron)
  readonly interval?: string;

  @IsJSON()
  @IsNotEmpty()
  // @TODO: Add strcutre validation in here
  @IsOptional()
  readonly structure?: string;

  // @TODO: Add validation that searches for a board with the given id
  @IsOptional()
  @Length(1, 255)
  @IsString()
  readonly board_id?: string;

  @IsOptional()
  @IsBoolean()
  readonly disabled?: boolean;
}
