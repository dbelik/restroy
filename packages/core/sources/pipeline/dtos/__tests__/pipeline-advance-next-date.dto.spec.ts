import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import PipelineAdvanceNextDateInputDto from '../pipeline-advance-next-date-input.dto';

describe('PipelineAdvanceNextDateInputDto class', () => {
  it('should enforce next_date to be passed', async () => {
    const date = new Date();
    date.setMinutes(date.getMinutes() - 1);
    const pipeline = { next_date: date.toISOString() };
    const dto = plainToInstance(PipelineAdvanceNextDateInputDto, pipeline);
    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should throw an error when next_date is passed current time', async () => {
    const date = new Date();
    date.setMinutes(date.getMinutes() + 1);
    const pipeline = { next_date: date.toISOString() };
    const dto = plainToInstance(PipelineAdvanceNextDateInputDto, pipeline);
    const errors = await validate(dto);

    expect(errors.length).toBe(1);
  });

  it('should throw an error when next_date is not passed', async () => {
    const pipeline = {};
    const dto = plainToInstance(PipelineAdvanceNextDateInputDto, pipeline);
    const errors = await validate(dto);

    expect(errors.length).toBe(1);
  });
});
