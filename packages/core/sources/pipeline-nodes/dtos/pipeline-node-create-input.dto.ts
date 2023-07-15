import { IsString, Length } from 'class-validator';

export default class PipelineNodeCreateInputDto {
  @IsString()
  @Length(1, 255)
    plugin_id: string;
}
