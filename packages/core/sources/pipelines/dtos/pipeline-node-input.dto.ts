import { IsString, Length } from 'class-validator';

export default class PipelineNodeInputDto {
  @IsString()
  @Length(1, 255)
  readonly v: string;
}
