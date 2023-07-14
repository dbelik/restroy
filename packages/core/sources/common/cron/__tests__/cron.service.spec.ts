import CronService from '../cron.service';

describe('CronService class', () => {
  let cronService: CronService;

  beforeEach(() => {
    cronService = new CronService();
  });

  describe('getNextDate method', () => {
    it('should return next date', () => {
      const cron = '0 0 1 1 *';
      const currentDate = new Date('2020-01-01T00:00:00.000Z');
      const nextDate = cronService.getNextDate(cron, currentDate);

      expect(nextDate).toEqual(new Date('2021-01-01T00:00:00.000Z'));
    });

    it('should return next date when cron string is a constant', () => {
      const cron = '@yearly';
      const currentDate = new Date('2020-01-01T00:00:00.000Z');
      const nextDate = cronService.getNextDate(cron, currentDate);

      expect(nextDate).toEqual(new Date('2021-01-01T00:00:00.000Z'));
    });
  });
});
