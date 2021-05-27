import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const a = await NestFactory.createMicroservice(AppModule);
  a.listen(() => Logger.log('Transcode Processor started'));
}
bootstrap();
