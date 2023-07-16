import { Validate } from 'class-validator';

import { StringObjectConstraint } from '../../common';

export default class PipelineNodeSettingsInputDto {
  @Validate(StringObjectConstraint)
  readonly settings: {
    readonly [key: string]: string;
  };
}
