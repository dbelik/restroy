import { Type } from 'class-transformer';
import {
  IsObject, IsString, Length, ValidateNested,
} from 'class-validator';

import PipelineNodeValueInputDto from './pipeline-node-value-input.dto';

export default class PipelineNodeWithValueInputDto {
  @IsString()
  @Length(1, 255)
  readonly v: string;

  @IsObject()
  @ValidateNested()
  @Type(() => PipelineNodeValueInputDto)
  readonly value: PipelineNodeValueInputDto;
}
