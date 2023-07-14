import UpTodayConstraint from '../up-today';

describe('UpTodayConstraint class', () => {
  it('should return true when date is up today', () => {
    const constraint = new UpTodayConstraint();
    const date = new Date();
    date.setMinutes(date.getMinutes() - 1);

    expect(constraint.validate(date.toISOString())).toBe(true);
  });

  it('should return false when date is not up today', () => {
    const constraint = new UpTodayConstraint();
    const date = new Date();
    date.setMinutes(date.getMinutes() + 1);

    expect(constraint.validate(date.toISOString())).toBe(false);
  });
});
