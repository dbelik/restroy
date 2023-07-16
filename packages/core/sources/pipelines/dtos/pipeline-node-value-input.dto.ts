import {
  IsDateString, IsOptional, IsString, Length,
} from 'class-validator';

export default class PipelineNodeWithValueInputDto {
  @IsString()
  @IsOptional()
  @Length(1, 255)
  readonly status: string;

  @IsString()
  @IsOptional()
  @IsDateString()
  readonly finished_at: string;

  @IsString()
  @IsOptional()
  @IsDateString()
  readonly started_at: string;
}
