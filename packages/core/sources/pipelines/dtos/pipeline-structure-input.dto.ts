import { Type } from 'class-transformer';
import {
  ArrayMaxSize, ArrayMinSize, IsArray, ValidateNested,
} from 'class-validator';

import PipelineNodeEdgeInputDto from './pipeline-node-edge-input.dto';
import PipelineNodeInputDto from './pipeline-node-input.dto';

export default class PipelineStructureInputDto {
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMaxSize(32)
  @ArrayMinSize(1)
  @Type(() => PipelineNodeInputDto)
  readonly nodes: PipelineNodeInputDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMaxSize(32)
  @ArrayMinSize(1)
  @Type(() => PipelineNodeEdgeInputDto)
  readonly edges: PipelineNodeEdgeInputDto[];
}
