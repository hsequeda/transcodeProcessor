import * as Ffmpeg from 'fluent-ffmpeg';
import { Injectable, Logger } from '@nestjs/common';
import { AggregateRoot } from '@nestjs/cqrs';
import { ITranscoder } from '../domain/interfaces/ITranscoder';
import * as fs from 'fs';

@Injectable()
export class FfmpegTranscoder extends AggregateRoot implements ITranscoder {
  private readonly _ffmpeg: Ffmpeg.FfmpegCommand;
  private readonly _logger: Logger;

  constructor() {
    super();
    this._ffmpeg = Ffmpeg();
    this._ffmpeg.setFfmpegPath(process.env.FFMPEG_PATH);
    this._ffmpeg.setFfprobePath(process.env.FFPROBE_PATH);
    this._ffmpeg.setFlvtoolPath(process.env.FLVTOOL_PATH);
    this._logger = new Logger(FfmpegTranscoder.name);
  }

  async transcodeFile(fileAddress: string): Promise<void> {
    this.freeOutputPath();
    return new Promise((resolve, reject) => {
      this._ffmpeg
        .addInput(fileAddress)
        .addOption('-profile:v', 'baseline')
        .addOption('-level', '3.0')
        .addOption('-start_number', '0')
        .addOption('-hls_time', '30')
        .addOption('-hls_list_size', '0')
        .addOption('-f', 'hls')
        .on('start', function(commandLine) {
          this._logger.debug(`Transcoding File ${fileAddress}`);
        })
        .on('progress', function(progress) {
          this._logger.log('Processing file: ${fileAddress} .....' + Math.abs(progress.percent) + '% done');
        })

        .on('end', () => {
          this._logger.debug(`Transcoding File ${fileAddress}, OK`);
          resolve();
        })
        .on('error', err => {
          this._logger.error(`Error in file: ${fileAddress}, [ERROR]: ${err.toString()} `);
          reject(err);
        })
        .save(`${process.env.OUTPUT_PATH}/index.m3u8`);
      return;
    });
  }

  private freeOutputPath() {
    fs.readdirSync(process.env.OUTPUT_PATH)
      .map((fileName: string) => `${process.env.OUTPUT_PATH}/${fileName}`)
      .forEach((filePath: string) => fs.unlinkSync(filePath));
  }
}
