import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import IdInputDto from '../id-input.dto';

describe('IdInputDto class', () => {
  it('should allow passing only id in plugin object', async () => {
    const plugin = { id: '1' };
    const dto = plainToInstance(IdInputDto, plugin);
    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should throw an error when id field is missing from plugin object', async () => {
    const plugin = {};
    const dto = plainToInstance(IdInputDto, plugin);
    const errors = await validate(dto);

    expect(errors.length).toBe(1);
  });
});
