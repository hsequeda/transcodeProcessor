import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule, BullModuleOptions } from '@nestjs/bull';
import { TranscodeProcessor } from './transcode-processor';
import { FfmpegTranscoder } from './infrastructure/transcoder';
import { S3HlsStorageManager } from './infrastructure/s3-hls-storage';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.registerQueueAsync({
      name: 'transcode',
      useFactory: (): BullModuleOptions => {
        return {
          name: 'transcode',
          redis: {
            host: process.env.QUEUE_HOST,
            port: parseInt(process.env.QUEUE_PORT),
            username: process.env.QUEUE_USERNAME,
            password: process.env.QUEUE_PASSWORD,
          },
        };
      },
    }),
  ],

  providers: [
    { provide: 'ITranscoder', useClass: FfmpegTranscoder },
    { provide: 'IHlsStorageManager', useClass: S3HlsStorageManager },
    TranscodeProcessor,
  ],
})
export class AppModule {
}
