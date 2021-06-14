import { Process, Processor } from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import { Job } from 'bull';
import { IHlsStorageManager } from './domain/interfaces/IStorageManager';
import { ITranscoder } from './domain/interfaces/ITranscoder';
import { TranscodeJobDto } from './dtos';

@Processor(process.env.QUEUE_JOB_NAME)
export class TranscodeProcessor {
  constructor(
    @Inject('ITranscoder')
    private readonly _transcoder: ITranscoder,
    @Inject('IHlsStorageManager')
    private readonly _hlsStorage: IHlsStorageManager,
  ) {}

  @Process(process.env.QUEUE_JOB_NAME)
  async process(job: Job<TranscodeJobDto>): Promise<void> {
    try {
      await this._transcoder.transcodeFile(job.data.urlOrigin);
    } catch (error) {
      throw new Error(`[ TranscoderError ]: ${error.message}`);
    }

    try {
      await this._hlsStorage.uploadFiles(job.data.key);
    } catch (error) {
      throw new Error(`[ StorageError ]: ${error.message}`);
    }
  }
}
