import {
  IsInt, IsOptional, Max, Min,
} from 'class-validator';

export default class PaginationPageInputDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  public offset?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  public limit?: number;
}
