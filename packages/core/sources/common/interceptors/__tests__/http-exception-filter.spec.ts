import { ArgumentsHost, HttpException } from '@nestjs/common';

import HttpExceptionFilter from '../http-exception-filter';

describe('HttpExceptionFilter class', () => {
  let httpExceptionFilter: HttpExceptionFilter;

  beforeEach(() => {
    httpExceptionFilter = new HttpExceptionFilter();
  });

  describe('catch method', () => {
    it('should return formatted error', async () => {
      const exception = {
        getStatus: () => 403,
        getResponse: () => [
          {
            property: 'test',
            value: 'test',
            constraints: {
              test: 'test',
            },
            children: [],
          },
        ],
        message: 'test',
      };
      const sendSpy = jasmine.createSpy();
      const host = {
        switchToHttp: () => ({
          getResponse: () => ({
            status: () => ({
              send: sendSpy,
            }),
          }),
        }),
      };

      // eslint-disable-next-line promise/valid-params
      await httpExceptionFilter.catch(
        exception as HttpException,
        host as ArgumentsHost,
      );

      expect(host.switchToHttp().getResponse().status().send).toHaveBeenCalledWith({
        code: 403,
        message: 'test',
        errors: [
          {
            property: 'test',
            value: 'test',
            constraints: {
              test: 'test',
            },
            children: [],
          },
        ],
        date: jasmine.any(String),
      });
    });

    it('should return formatted error when response errors is not an array', async () => {
      const exception = {
        getStatus: () => 400,
        getResponse: () => ({}),
        message: 'test',
      };
      const sendSpy = jasmine.createSpy();
      const host = {
        switchToHttp: () => ({
          getResponse: () => ({
            status: () => ({
              send: sendSpy,
            }),
          }),
        }),
      };

      // eslint-disable-next-line promise/valid-params
      await httpExceptionFilter.catch(
        exception as HttpException,
        host as ArgumentsHost,
      );

      expect(host.switchToHttp().getResponse().status().send).toHaveBeenCalledWith({
        code: 400,
        message: 'test',
        errors: undefined,
        date: jasmine.any(String),
      });
    });
  });
});
