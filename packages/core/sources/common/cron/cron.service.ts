import { Injectable } from '@nestjs/common';
import CronParser from 'cron-parser';

@Injectable()
export default class CronService {
  getNextDate(cron: string, currentDate: Date = new Date()): Date {
    const nextCronDate = CronParser.parseExpression(cron, { currentDate, iterator: true }).next();
    return nextCronDate.value.toDate();
  }
}
