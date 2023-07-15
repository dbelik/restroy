import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import PipelineNodeSettingsInputDto from '../pipeline-node-settings-input.dto';

describe('PipelineNodeSettingsInputDto class', () => {
  it('should not return any error when settings is an object with string values', async () => {
    const node = {
      settings: {
        API_KEY: 'example',
      },
    };
    const dto = plainToInstance(PipelineNodeSettingsInputDto, node);
    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should return an error when settings contains values that are not strings', async () => {
    const node = {
      settings: {
        API_KEY: {
          key: 'value',
        },
      },
    };
    const dto = plainToInstance(PipelineNodeSettingsInputDto, node);
    const errors = await validate(dto);

    expect(errors.length).toBe(1);
  });
});
