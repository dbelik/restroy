import { IsString, Length } from 'class-validator';

export default class PipelineNodeCreateInputDto {
  @IsString()
  @Length(1, 255)
  readonly plugin_id: string;
}
