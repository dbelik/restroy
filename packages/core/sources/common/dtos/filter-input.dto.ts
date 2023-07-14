import { IsEnum, IsString, Length } from 'class-validator';

export enum FilterOperatorsEnum {
  EQUALS = '=',
  NOT_EQUALS = '!=',
  CONTAINS = 'LIKE',
  NOT_CONTAINS = 'NOT LIKE',
  IN = 'IN',
  NOT_IN = 'NOT IN',
  BETWEEN = 'BETWEEN',
  NOT_BETWEEN = 'NOT BETWEEN',
  GREATER_THAN = '>',
  GREATER_THAN_OR_EQUALS = '>=',
  LESS_THAN = '<',
  LESS_THAN_OR_EQUALS = '<=',
  IS_NULL = 'IS NULL',
  IS_NOT_NULL = 'IS NOT NULL',
}

export default class FilterInputDto {
  @IsString()
  @Length(1, 255)
  public name: string;

  @IsEnum(FilterOperatorsEnum)
  public operator: FilterOperatorsEnum;

  public value: string | string[] | number | number[] | boolean | boolean[] | null;
}
