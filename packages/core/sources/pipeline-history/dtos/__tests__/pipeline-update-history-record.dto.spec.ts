import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import PipelineUpdateHistoryRecordInputDto from '../pipeline-update-history-record.dto';

describe('PipelineUpdateHistoryRecordInputDto class', () => {
  it('should allow passing only pipeline structure', async () => {
    const pipeline = {
      structure: {
        nodes: [
          {
            v: '11',
            value: {
              status: 'running',
            },
          },
          {
            v: '10',
            value: {
              finished_at: new Date().toISOString(),
            },
          },
        ],
      },
    };
    const dto = plainToInstance(PipelineUpdateHistoryRecordInputDto, pipeline);
    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should return errors when nodes is empty array', async () => {
    const pipeline = {
      structure: {
        nodes: [],
      },
    };
    const dto = plainToInstance(PipelineUpdateHistoryRecordInputDto, pipeline);
    const errors = await validate(dto);

    expect(errors.length).toBe(1);
  });

  it('should return errors when nodes do not have field v', async () => {
    const pipeline = {
      structure: {
        nodes: [
          {
            value: {
              finished_at: new Date().toISOString(),
            },
          }],
      },
    };
    const dto = plainToInstance(PipelineUpdateHistoryRecordInputDto, pipeline);
    const errors = await validate(dto);

    expect(errors.length).toBe(1);
  });

  it('should return errors when nodes do not have field value', async () => {
    const pipeline = {
      structure: {
        nodes: [
          {
            v: '1',
          }],
      },
    };
    const dto = plainToInstance(PipelineUpdateHistoryRecordInputDto, pipeline);
    const errors = await validate(dto);

    expect(errors.length).toBe(1);
  });

  it('should return errors when nodes have field value with status being not a string', async () => {
    const pipeline = {
      structure: {
        nodes: [
          {
            v: '1',
            value: {
              status: 123,
            },
          }],
      },
    };
    const dto = plainToInstance(PipelineUpdateHistoryRecordInputDto, pipeline);
    const errors = await validate(dto);

    expect(errors.length).toBe(1);
  });

  it('should return errors when nodes have field value with finished_at being not a string', async () => {
    const pipeline = {
      structure: {
        nodes: [
          {
            v: '1',
            value: {
              finished_at: 123,
            },
          }],
      },
    };
    const dto = plainToInstance(PipelineUpdateHistoryRecordInputDto, pipeline);
    const errors = await validate(dto);

    expect(errors.length).toBe(1);
  });

  it('should return errors when nodes have field value with finished_at being not a date string', async () => {
    const pipeline = {
      structure: {
        nodes: [
          {
            v: '1',
            value: {
              finished_at: '123',
            },
          }],
      },
    };
    const dto = plainToInstance(PipelineUpdateHistoryRecordInputDto, pipeline);
    const errors = await validate(dto);

    expect(errors.length).toBe(1);
  });
});
