import AtLeastOnePipe from '../at-least-one';

describe('AtLeastOnePipe class', () => {
  let pipe: AtLeastOnePipe;

  beforeEach(() => {
    pipe = new AtLeastOnePipe();
  });

  it('should throw an error when an object has no fields', () => {
    const input = {};

    expect(() => pipe.transform(input)).toThrowError('No data to update');
  });

  it('should throw an error when an object has empty fields', () => {
    const input = {
      name: undefined,
    };

    expect(() => pipe.transform(input)).toThrowError('No data to update');
  });

  it('should not throw an error when an object has null fields', () => {
    const input = {
      name: null,
    };

    expect(pipe.transform(input)).toBe(input);
  });

  it('should not throw an error when an object has non-empty fields', () => {
    const input = {
      some: 'value',
    };

    expect(pipe.transform(input)).toBe(input);
  });
});
