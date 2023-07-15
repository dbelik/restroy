import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'StringObject', async: false })
export default class StringObjectConstraint implements ValidatorConstraintInterface {
  validate(o: object) {
    return typeof o === 'object' && Object.values(o).every((f) => typeof f === 'string');
  }

  defaultMessage() {
    return 'Object ($value) must have only string fields!';
  }
}
