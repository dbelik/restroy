import {
  IsInt, IsOptional, Max, Min,
} from 'class-validator';

export default class PaginationPageInputDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  public readonly page?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  public readonly limit?: number;
}
