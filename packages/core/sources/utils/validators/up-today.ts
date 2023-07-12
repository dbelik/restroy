import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'UpToday', async: false })
export default class UpTodayConstraint implements ValidatorConstraintInterface {
  validate(date: string) {
    return new Date(date) <= new Date();
  }

  defaultMessage() {
    return 'Text ($value) should not surpass current time!';
  }
}
