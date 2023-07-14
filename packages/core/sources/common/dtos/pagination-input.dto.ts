import {
  IsInt, IsOptional, Max, Min,
} from 'class-validator';

export default class PaginationPageInputDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  public page?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  public limit?: number;
}
