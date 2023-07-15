import StringObjectConstraint from '../string-object';

describe('StringObjectConstraint class', () => {
  it('should return true when object only has string fields', () => {
    const constraint = new StringObjectConstraint();
    const o = {
      field1: 'example',
      field2: 'example2',
    };

    expect(constraint.validate(o)).toBe(true);
  });

  it('should return false when object has some non-string fields', () => {
    const constraint = new StringObjectConstraint();
    const o = {
      field1: 'example',
      field2: 2,
    };

    expect(constraint.validate(o)).toBe(false);
  });
});
