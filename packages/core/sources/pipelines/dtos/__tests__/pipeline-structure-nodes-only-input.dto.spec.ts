import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import PipelineStructureNodesOnlyInputDto from '../pipeline-structure-nodes-only-input.dto';

describe('PipelineStructureNodesOnlyInputDto class', () => {
  it('should allow passing only pipeline structure', async () => {
    const pipeline = {
      nodes: [
        {
          v: '11',
          value: {
            status: 'success',
          },
        },
      ],
    };
    const dto = plainToInstance(PipelineStructureNodesOnlyInputDto, pipeline);
    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should return errors when pipeline nodes have invalid status', async () => {
    const pipeline = {
      nodes: [
        {
          v: '11',
          value: {
            status: 'success123',
          },
        },
      ],
    };
    const dto = plainToInstance(PipelineStructureNodesOnlyInputDto, pipeline);
    const errors = await validate(dto);

    expect(errors.length).toBe(1);
  });

  it('should return errors when pipeline nodes have invalid finished_at', async () => {
    const pipeline = {
      nodes: [
        {
          v: '11',
          value: {
            finished_at: 'invalid date',
          },
        },
      ],
    };
    const dto = plainToInstance(PipelineStructureNodesOnlyInputDto, pipeline);
    const errors = await validate(dto);

    expect(errors.length).toBe(1);
  });

  it('should allow passing nodes that have valid finished_at', async () => {
    const pipeline = {
      nodes: [
        {
          v: '11',
          value: {
            finished_at: new Date().toISOString(),
          },
        },
      ],
    };
    const dto = plainToInstance(PipelineStructureNodesOnlyInputDto, pipeline);
    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should return errors when pipeline nodes have invalid started_at', async () => {
    const pipeline = {
      nodes: [
        {
          v: '11',
          value: {
            started_at: 'invalid date',
          },
        },
      ],
    };
    const dto = plainToInstance(PipelineStructureNodesOnlyInputDto, pipeline);
    const errors = await validate(dto);

    expect(errors.length).toBe(1);
  });

  it('should allow passing nodes that have valid started_at', async () => {
    const pipeline = {
      nodes: [
        {
          v: '11',
          value: {
            started_at: new Date().toISOString(),
          },
        },
      ],
    };
    const dto = plainToInstance(PipelineStructureNodesOnlyInputDto, pipeline);
    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });
});
