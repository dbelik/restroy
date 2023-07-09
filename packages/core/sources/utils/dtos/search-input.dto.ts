import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray, IsOptional, IsString, ValidateNested,
} from 'class-validator';

import FilterInputDto from './filter-input.dto';
import PaginationPageInputDto from './pagination-input.dto';

export default class SearchInputDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(5)
    sort?: string[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => PaginationPageInputDto)
    page?: PaginationPageInputDto;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(5)
  @Type(() => FilterInputDto)
  @ValidateNested({ each: true })
    filters?: FilterInputDto[];
}
