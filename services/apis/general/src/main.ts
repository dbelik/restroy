import { HttpException, HttpStatus, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { HttpExceptionFilter } from '@restroy/core';
import RemoveEmptyPipe from '@restroy/core/sources/utils/pipes/remove-empty';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    forbidUnknownValues: false,
    exceptionFactory: (errors) => new HttpException(errors, HttpStatus.FORBIDDEN),
  }));
  app.useGlobalPipes(new RemoveEmptyPipe());
  await app.listen(3000);
}

bootstrap().catch(console.error);
