import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray, IsObject, IsOptional, IsString, Length, ValidateNested,
} from 'class-validator';

import FilterInputDto from './filter-input.dto';
import PaginationPageInputDto from './pagination-input.dto';

export default class SearchInputDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Length(1, 255, { each: true })
  @ArrayMaxSize(5)
  readonly sort?: string[];

  @IsOptional()
  @ValidateNested()
  @IsObject()
  @Type(() => PaginationPageInputDto)
  readonly pagination?: PaginationPageInputDto;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(5)
  @Type(() => FilterInputDto)
  @ValidateNested({ each: true })
  readonly filters?: FilterInputDto[];
}
