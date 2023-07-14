import {
  ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';

export type HttpExceptionResponse = {
  property: string;
  value: unknown;
  constraints: object;
  children?: HttpExceptionResponse[];
};

@Catch(HttpException)
export default class HttpExceptionFilter implements ExceptionFilter {
  private formatError(response: HttpExceptionResponse[]): HttpExceptionResponse[] {
    return response.map((error) => ({
      property: error.property,
      value: error.value,
      constraints: error.constraints,
      children: this.formatError(error.children),
    }));
  }

  async catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<FastifyReply>();

    const code = exception.getStatus();
    const { message } = exception;

    let errors: HttpExceptionResponse[];
    if (code === HttpStatus.FORBIDDEN) {
      const responseErrors = exception.getResponse() as HttpExceptionResponse[];
      if (Array.isArray(responseErrors)) {
        errors = this.formatError(responseErrors);
      }
    }

    await response.status(code).send({
      code,
      message,
      errors,
      date: new Date().toISOString(),
    });
  }
}
