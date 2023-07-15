import { Validate } from 'class-validator';

import { StringObjectConstraint } from '../../common';

export default class PipelineNodeSettingsInputDto {
  @Validate(StringObjectConstraint)
    settings: {
    [key: string]: string;
  };
}
