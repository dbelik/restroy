import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import PipelineUpdateInputDto from '../pipeline-update-input.dto';

describe('PipelineUpdateInputDto class', () => {
  it('should allow passing only pipeline structure', async () => {
    const pipeline = { structure: JSON.stringify({ some: 'value' }) };
    const dto = plainToInstance(PipelineUpdateInputDto, pipeline);
    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should allow disabling pipelines', async () => {
    const pipeline = { disabled: true };
    const dto = plainToInstance(PipelineUpdateInputDto, pipeline);
    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should allow setting intervals', async () => {
    const pipeline = { interval: '5/* * * * *' };
    const dto = plainToInstance(PipelineUpdateInputDto, pipeline);
    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should throw error when interval has invalid format', async () => {
    const pipeline = { interval: 'every 5 minutes' };
    const dto = plainToInstance(PipelineUpdateInputDto, pipeline);
    const errors = await validate(dto);

    expect(errors.length).toBe(1);
  });

  it('should throw error when passing too large string fields', async () => {
    const pipeline = {
      name: 'a'.repeat(256),
      description: 'a'.repeat(4000),
      board_id: 'a'.repeat(256),
    };
    const dto = plainToInstance(PipelineUpdateInputDto, pipeline);
    const errors = await validate(dto);

    expect(errors.length).toBe(3);
  });
});
