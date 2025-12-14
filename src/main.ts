import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { FileLoggerService } from './logging/logging.service';
import { LoggingMiddleware } from './logging/logging.middleware';

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: false }),
  );
  const logger = app.get<FileLoggerService>('LoggingService');
  app.use(
    new LoggingMiddleware(logger).use.bind(new LoggingMiddleware(logger)),
  );

  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;
  await app.listen(port);
}
bootstrap();
