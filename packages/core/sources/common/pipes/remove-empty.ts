import {
  Injectable, PipeTransform,
} from '@nestjs/common';

@Injectable()
export default class RemoveEmptyPipe implements PipeTransform {
  transform(value: unknown) {
    return JSON.parse(JSON.stringify(value)) as object;
  }
}
