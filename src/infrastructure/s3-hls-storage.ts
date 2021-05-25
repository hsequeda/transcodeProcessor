import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import { IHlsStorageManager } from '../domain/interfaces/IStorageManager';

@Injectable()
export class S3HlsStorageManager implements IHlsStorageManager {
  private _s3Client: S3Client;
  private _logger: Logger;

  constructor() {
    this._s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_API_KEY,
        secretAccessKey: process.env.AWS_PRIV_KEY,
      },
    });
    this._logger = new Logger();
  }

  async uploadFiles(folder: string): Promise<void> {
    const filePaths = fs
      .readdirSync(process.env.OUTPUT_PATH)
      .map((fileName: string) => `${process.env.OUTPUT_PATH}/${fileName}`);
    for (const path of filePaths) {
      const readStream = fs.createReadStream(path);
      await this.uploadFile(folder, path.split('/').pop(), readStream);
      fs.unlinkSync(path);
    }
  }

  private async uploadFile(
    folder: string,
    fileName: string,
    data: fs.ReadStream,
  ): Promise<void> {
    await this._s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `${folder}/${fileName}`,
        Body: data,
      }),
    );
  }
}
