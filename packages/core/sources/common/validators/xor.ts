import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

// returns true if it has xor relation with the specified key in the constraint
@ValidatorConstraint({ name: 'XorConstraint', async: false })
export default class XorConstraint implements ValidatorConstraintInterface {
  validate(propertyValue: string, arguments_: ValidationArguments) {
    return Object.keys(arguments_.object).some((key) => Object.hasOwn(arguments_.object, key));
  }

  defaultMessage(arguments_: ValidationArguments) {
    return `At least one of the following property must be passed: ${arguments_.constraints.join(', ')}.`;
  }
}
