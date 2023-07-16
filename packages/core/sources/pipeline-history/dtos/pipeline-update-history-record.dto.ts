import { Type } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';

import { PipelineStructureNodesOnlyInputDto } from '../../pipelines/dtos';

export default class PipelineUpdateHistoryRecordInputDto {
  @ValidateNested()
  @IsObject()
  @Type(() => PipelineStructureNodesOnlyInputDto)
  readonly structure: PipelineStructureNodesOnlyInputDto;
}
