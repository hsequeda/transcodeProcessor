import { Process, Processor } from '@nestjs/bull';
import { Inject, Logger } from '@nestjs/common';
import { Job } from 'bull';
import { IHlsStorageManager } from './domain/interfaces/IStorageManager';
import { ITranscoder } from './domain/interfaces/ITranscoder';
import { TranscodeJobDto } from './dtos';

@Processor({name: 'transcode'})
export class TranscodeProcessor {
  private readonly _logger: Logger = new Logger(TranscodeProcessor.name);;

  constructor(
    @Inject('ITranscoder')
    private readonly _transcoder: ITranscoder,
    @Inject('IHlsStorageManager')
    private readonly _hlsStorage: IHlsStorageManager,

  ) {
  }

  @Process()
  async process(job: Job<TranscodeJobDto>): Promise<void> {
    try {
      await this._transcoder.transcodeFile(job.data.urlOrigin);
    } catch (error) {
      const errMsg = `[ TranscoderError ]: ${error.message}`;
      this._logger.error(errMsg)
      throw new Error(errMsg);
    }

    try {
      await this._hlsStorage.uploadFiles(job.data.key);
    } catch (error) {
      const errMsg = `[ StorageError ]: ${error.message}`;
      this._logger.error(errMsg);
      throw new Error(errMsg);
    }

  }
}
