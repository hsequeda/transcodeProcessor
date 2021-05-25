import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { TranscodeProcessor } from './transcode-processor';
import { FfmpegTanscoder } from './infrastructure/transcoder';
import { S3HlsStorageManager } from './infrastructure/s3-hls-storage';

@Module({
  imports: [
    BullModule.registerQueue({
      name: process.env.QUEUE_NAME,
      redis: {
        host: process.env.QUEUE_HOST,
        port: parseInt(process.env.QUEUE_PORT),
        username: process.env.QUEUE_USERNAME,
        password: process.env.QUEUE_PASSWORD,
      },
    }),
  ],

  providers: [
    { provide: 'ITranscoder', useClass: FfmpegTanscoder },
    { provide: 'IHlsStorageManager', useClass: S3HlsStorageManager },
    TranscodeProcessor,
  ],
})
export class AppModule {}
