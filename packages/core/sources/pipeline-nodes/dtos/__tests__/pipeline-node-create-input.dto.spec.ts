import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import PipelineNodeCreateInputDto from '../pipeline-node-create-input.dto';

describe('PipelineNodeCreateInputDto class', () => {
  it('should throw an error when plugin_id is not supplied', async () => {
    const pipelineNode = {};
    const dto = plainToInstance(PipelineNodeCreateInputDto, pipelineNode);
    const errors = await validate(dto);

    expect(errors.length).toBe(1);
  });

  it('should throw an error when plugin_id is not a string', async () => {
    const pipelineNode = { plugin_id: 1 };
    const dto = plainToInstance(PipelineNodeCreateInputDto, pipelineNode);
    const errors = await validate(dto);

    expect(errors.length).toBe(1);
  });

  it('should throw an error when plugin_id is an empty string', async () => {
    const pipelineNode = { plugin_id: '' };
    const dto = plainToInstance(PipelineNodeCreateInputDto, pipelineNode);
    const errors = await validate(dto);

    expect(errors.length).toBe(1);
  });

  it('should throw an error when plugin_id is longer than 255 characters', async () => {
    const pipelineNode = { plugin_id: 'a'.repeat(256) };
    const dto = plainToInstance(PipelineNodeCreateInputDto, pipelineNode);
    const errors = await validate(dto);

    expect(errors.length).toBe(1);
  });

  it('should allow passing only plugin_id in pipelineNode object', async () => {
    const pipelineNode = { plugin_id: '1' };
    const dto = plainToInstance(PipelineNodeCreateInputDto, pipelineNode);
    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });
});
