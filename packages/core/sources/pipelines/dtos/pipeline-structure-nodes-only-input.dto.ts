import { Type } from 'class-transformer';
import {
  ArrayMaxSize, ArrayMinSize, IsArray, ValidateNested,
} from 'class-validator';

import PipelineNodeWithValueInputDto from './pipeline-node-with-value-input.dto';

export default class PipelineStructureNodesOnlyInputDto {
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(32)
  @Type(() => PipelineNodeWithValueInputDto)
  readonly nodes: PipelineNodeWithValueInputDto[];
}
