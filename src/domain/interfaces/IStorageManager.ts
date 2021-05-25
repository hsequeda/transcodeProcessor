export interface IHlsStorageManager {
  uploadFiles(key: string): Promise<void>;
}
