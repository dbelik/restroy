import RemoveEmptyPipe from '../remove-empty';

describe('RemoveEmptyPipe class', () => {
  let pipe: RemoveEmptyPipe;

  beforeEach(() => {
    pipe = new RemoveEmptyPipe();
  });

  it('should remove undefined fields', () => {
    const input = {
      some: undefined,
    };

    expect(pipe.transform(input)).toEqual({});
  });

  it('should remove only undefined fields and leave other fields untouched', () => {
    const input = {
      some: undefined,
      other: 'value',
    };

    expect(pipe.transform(input)).toEqual({
      other: 'value',
    });
  });

  it('should not remove any fields when no undefined fields are passed', () => {
    const input = {
      some: 'some',
      other: 'value',
    };

    expect(pipe.transform(input)).toEqual(input);
  });

  it('should not remove null fields', () => {
    const input = {
      some: null,
      other: 'value',
    };

    expect(pipe.transform(input)).toEqual(input);
  });
});
