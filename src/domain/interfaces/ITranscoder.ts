export interface ITranscoder {
  transcodeFile(url: string): Promise<void>;
}
