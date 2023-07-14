import {
  HttpException, HttpStatus, Injectable, PipeTransform,
} from '@nestjs/common';

@Injectable()
export default class AtLeastOnePipe implements PipeTransform {
  transform(value: unknown) {
    if (typeof value === 'object' && this.isEmpty(value)) {
      throw new HttpException('No data to update', HttpStatus.FORBIDDEN);
    }
    return value;
  }

  isEmpty(value: object) {
    const newObject = JSON.parse(JSON.stringify(value)) as object;
    return Object.keys(newObject).length === 0;
  }
}
