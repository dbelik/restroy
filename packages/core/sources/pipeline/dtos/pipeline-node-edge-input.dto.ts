import { IsString, Length } from 'class-validator';

export default class PipelineNodeEdgeInputDto {
  @IsString()
  @Length(1, 255)
    v: string;

  @IsString()
  @Length(1, 255)
    w: string;
}
