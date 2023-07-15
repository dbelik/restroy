import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import PipelineCreateHistoryRecord from '../pipeline-create-history-record.dto';

describe('PipelineCreateHistoryRecord class', () => {
  it('should throw an error when start_date is not supplied', async () => {
    const pipelineNode = {};
    const dto = plainToInstance(PipelineCreateHistoryRecord, pipelineNode);
    const errors = await validate(dto);

    expect(errors.length).toBe(1);
  });

  it('should throw an error when start_date is not a string', async () => {
    const pipelineNode = { start_date: 1 };
    const dto = plainToInstance(PipelineCreateHistoryRecord, pipelineNode);
    const errors = await validate(dto);

    expect(errors.length).toBe(1);
  });

  it('should throw an error when start_date is an empty string', async () => {
    const pipelineNode = { start_date: '' };
    const dto = plainToInstance(PipelineCreateHistoryRecord, pipelineNode);
    const errors = await validate(dto);

    expect(errors.length).toBe(1);
  });

  it('should throw an error when start_date is invalid date string', async () => {
    const pipelineNode = { start_date: 'a'.repeat(256) };
    const dto = plainToInstance(PipelineCreateHistoryRecord, pipelineNode);
    const errors = await validate(dto);

    expect(errors.length).toBe(1);
  });

  it('should allow passing only start_date in pipelineNode object', async () => {
    const pipelineNode = { start_date: new Date().toISOString() };
    const dto = plainToInstance(PipelineCreateHistoryRecord, pipelineNode);
    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });
});
