import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import PipelineCreateHistoryRecord from '../pipeline-create-history-record.dto';

describe('PipelineCreateHistoryRecord class', () => {
  it('should throw an error when started_at is not supplied', async () => {
    const pipelineNode = {};
    const dto = plainToInstance(PipelineCreateHistoryRecord, pipelineNode);
    const errors = await validate(dto);

    expect(errors.length).toBe(1);
  });

  it('should throw an error when started_at is not a string', async () => {
    const pipelineNode = { started_at: 1 };
    const dto = plainToInstance(PipelineCreateHistoryRecord, pipelineNode);
    const errors = await validate(dto);

    expect(errors.length).toBe(1);
  });

  it('should throw an error when started_at is an empty string', async () => {
    const pipelineNode = { started_at: '' };
    const dto = plainToInstance(PipelineCreateHistoryRecord, pipelineNode);
    const errors = await validate(dto);

    expect(errors.length).toBe(1);
  });

  it('should throw an error when started_at is invalid date string', async () => {
    const pipelineNode = { started_at: 'a'.repeat(256) };
    const dto = plainToInstance(PipelineCreateHistoryRecord, pipelineNode);
    const errors = await validate(dto);

    expect(errors.length).toBe(1);
  });

  it('should allow passing only started_at in pipelineNode object', async () => {
    const pipelineNode = { started_at: new Date().toISOString() };
    const dto = plainToInstance(PipelineCreateHistoryRecord, pipelineNode);
    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });
});
