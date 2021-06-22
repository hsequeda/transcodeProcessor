import { Logger } from '@nestjs/common';
import { MicroserviceOptions } from '@nestjs/microservices';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const microApp = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    options: {
      port: parseInt(process.env.PORT ?? '7077'),
    },
  });
  microApp.listen(() => Logger.log('Transcode Processor started'));
}

bootstrap();
