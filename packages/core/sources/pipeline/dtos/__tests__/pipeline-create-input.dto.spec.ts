import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import PipelineCreateInputDto from '../pipeline-create-input.dto';

describe('PipelineCreateInputDto class', () => {
  it('should allow passing only pipeline data', async () => {
    const pipeline = {
      interval: '5/* * * * *',
      name: 'test',
      description: 'test',
      board_id: 'test',
      structure: '{"nodes":[{"v":"START"},{"v":"11"},{"v":"10"}],"edges":[{"v":"START","w":"11"},{"v":"START","w":"10"}]}',
    };
    const dto = plainToInstance(PipelineCreateInputDto, pipeline);
    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should throw error when interval has invalid format', async () => {
    const pipeline = {
      board_id: 'test',
      interval: 'every 5 mins I guess',
      name: 'test',
      description: 'test',
      structure: '{"nodes":[{"v":"START"},{"v":"11"},{"v":"10"}],"edges":[{"v":"START","w":"11"},{"v":"START","w":"10"}]}',
    };
    const dto = plainToInstance(PipelineCreateInputDto, pipeline);
    const errors = await validate(dto);

    expect(errors.length).toBe(1);
  });

  it('should throw error when structure has invalid format', async () => {
    const pipeline = {
      board_id: 'test',
      interval: '* * * * *',
      name: 'test',
      description: 'test',
      structure: 'Hey there!',
    };
    const dto = plainToInstance(PipelineCreateInputDto, pipeline);
    const errors = await validate(dto);

    expect(errors.length).toBe(1);
  });

  it('should throw error when not passing required fields', async () => {
    const pipeline = {
      structure: { some: 'value' },
    };
    const dto = plainToInstance(PipelineCreateInputDto, pipeline);
    const errors = await validate(dto);

    expect(errors.length).toBe(5);
  });

  it('should throw error when passing too large string fields', async () => {
    const pipeline = {
      name: 'a'.repeat(256),
      description: 'a'.repeat(4000),
      interval: '5/* * * * *',
      board_id: 'a'.repeat(256),
      structure: '{"nodes":[{"v":"START"},{"v":"11"},{"v":"10"}],"edges":[{"v":"START","w":"11"},{"v":"START","w":"10"}]}',
    };
    const dto = plainToInstance(PipelineCreateInputDto, pipeline);
    const errors = await validate(dto);

    expect(errors.length).toBe(3);
  });
});
