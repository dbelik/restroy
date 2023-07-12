import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import SearchInputDto from '../search-input.dto';

describe('SearchInputDto class', () => {
  it('should allow passing only sort', async () => {
    const search = { sort: ['-name', 'description'] };
    const dto = plainToInstance(SearchInputDto, search);
    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should allow passing only pagination', async () => {
    const search = { pagination: { page: 1, limit: 10 } };
    const dto = plainToInstance(SearchInputDto, search);
    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should allow passing only filters', async () => {
    const search = { filters: [{ name: 'test', value: 'any', operator: '=' }] };
    const dto = plainToInstance(SearchInputDto, search);
    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should throw error when passing invalid sort', async () => {
    const search = { sort: [123] };
    const dto = plainToInstance(SearchInputDto, search);
    const errors = await validate(dto);

    expect(errors.length).toBe(1);
  });

  it('should throw error when passing invalid pagination', async () => {
    const search = { pagination: { page: -1, limit: 0 } };
    const dto = plainToInstance(SearchInputDto, search);
    const errors = await validate(dto);

    expect(errors.length).toBe(1);
    expect(errors[0].children.length).toBe(2);
  });

  it('should throw error when passing invalid filters', async () => {
    const search = { filters: [{ name: 'test', value: 'any', operator: 'invalid' }] };
    const dto = plainToInstance(SearchInputDto, search);
    const errors = await validate(dto);

    expect(errors.length).toBe(1);
  });

  it('should throw error when passing too large string fields', async () => {
    const search = {
      sort: ['a'.repeat(256)],
      pagination: { page: 1, limit: 1000 },
      filters: [{ name: 'a'.repeat(256), value: 'any', operator: '=' }],
    };
    const dto = plainToInstance(SearchInputDto, search);
    const errors = await validate(dto);

    expect(errors.length).toBe(3);
  });

  it('should throw error when passing too many filters', async () => {
    const search = {
      filters: Array.from({ length: 6 }, () => ({ name: 'test', value: 'any', operator: '=' })),
    };
    const dto = plainToInstance(SearchInputDto, search);
    const errors = await validate(dto);

    expect(errors.length).toBe(1);
  });

  it('should throw error when passing too many sort fields', async () => {
    const search = { sort: Array.from({ length: 6 }, () => 'name') };
    const dto = plainToInstance(SearchInputDto, search);
    const errors = await validate(dto);

    expect(errors.length).toBe(1);
  });

  it('should throw error when passing too large pagination fields', async () => {
    const search = { pagination: { page: 1, limit: 1001 } };
    const dto = plainToInstance(SearchInputDto, search);
    const errors = await validate(dto);

    expect(errors.length).toBe(1);
  });
});
