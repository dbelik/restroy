import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import PipelineNodeUpdateInputDto from '../pipeline-node-update-input.dto';

describe('PipelineNodeUpdateInputDto class', () => {
  it('should not return any error when settings is an object with string values', async () => {
    const node = {
      settings: {
        API_KEY: 'example',
      },
    };
    const dto = plainToInstance(PipelineNodeUpdateInputDto, node);
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
    const dto = plainToInstance(PipelineNodeUpdateInputDto, node);
    const errors = await validate(dto);

    expect(errors.length).toBe(1);
  });

  it('should return an error when settings is not an object', async () => {
    const node = {
      settings: 'not an object',
    };
    const dto = plainToInstance(PipelineNodeUpdateInputDto, node);
    const errors = await validate(dto);

    expect(errors.length).toBe(1);
  });

  it('should return an error when plugin_id is not a string', async () => {
    const node = {
      plugin_id: 123,
    };
    const dto = plainToInstance(PipelineNodeUpdateInputDto, node);
    const errors = await validate(dto);

    expect(errors.length).toBe(1);
  });

  it('should return an error when plugin_id is an empty string', async () => {
    const node = {
      plugin_id: '',
    };
    const dto = plainToInstance(PipelineNodeUpdateInputDto, node);
    const errors = await validate(dto);

    expect(errors.length).toBe(1);
  });

  it('should return an error when plugin_id is longer than 255 characters', async () => {
    const node = {
      plugin_id: 'a'.repeat(256),
    };
    const dto = plainToInstance(PipelineNodeUpdateInputDto, node);
    const errors = await validate(dto);

    expect(errors.length).toBe(1);
  });
});
