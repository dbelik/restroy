import {
  IsDateString, IsEnum, IsOptional, IsString, Length,
} from 'class-validator';

export enum PipelineStatusEnum {
  PENDING = 'pending',
  RUNNING = 'running',
  PAUSED = 'paused',
  FAILED = 'failed',
  SUCCESS = 'success',
}

export default class PipelineNodeWithValueInputDto {
  @IsEnum(PipelineStatusEnum)
  @IsOptional()
  @Length(1, 255)
  readonly status: PipelineStatusEnum;

  @IsString()
  @IsOptional()
  @IsDateString()
  readonly finished_at: string;

  @IsString()
  @IsOptional()
  @IsDateString()
  readonly started_at: string;
}
