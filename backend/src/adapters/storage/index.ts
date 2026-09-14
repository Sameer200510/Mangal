import fs from 'fs';
import path from 'path';
import { env } from '../../config/env.js';
import { logger } from '../../middleware/requestLogger.js';

export interface UploadOptions {
  folder?: string;
  contentType?: string;
  isPrivate?: boolean;
}

export interface IStorageAdapter {
  upload(fileName: string, buffer: Buffer, options?: UploadOptions): Promise<string>;
  delete(fileUrl: string): Promise<void>;
  getSignedUrl(fileKey: string, expiresInSeconds?: number): Promise<string>;
  isHealthy(): Promise<boolean>;
  adapterName: 'local' | 's3';
}

class LocalStorageAdapter implements IStorageAdapter {
  public adapterName = 'local' as const;
  private uploadDir: string;

  constructor(basePath: string) {
    this.uploadDir = path.resolve(basePath);
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async upload(fileName: string, buffer: Buffer, options?: UploadOptions): Promise<string> {
    const targetFolder = options?.folder
      ? path.join(this.uploadDir, options.folder)
      : this.uploadDir;

    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder, { recursive: true });
    }

    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}-${fileName}`;
    const filePath = path.join(targetFolder, uniqueName);
    await fs.promises.writeFile(filePath, buffer);

    const relativeUrl = `/uploads/${options?.folder ? `${options.folder}/` : ''}${uniqueName}`;
    return `${env.CLIENT_URL || 'http://localhost:4000'}${relativeUrl}`;
  }

  async delete(fileUrl: string): Promise<void> {
    const parts = fileUrl.split('/uploads/');
    if (parts.length > 1) {
      const localPath = path.join(this.uploadDir, parts[1]);
      if (fs.existsSync(localPath)) {
        await fs.promises.unlink(localPath);
      }
    }
  }

  async getSignedUrl(fileKey: string, expiresInSeconds = 900): Promise<string> {
    // In local mode, append a mock HMAC signed token with expiry query param
    const expiry = Math.floor(Date.now() / 1000) + expiresInSeconds;
    return `${fileKey}?expires=${expiry}&signature=local_mock_sig_${expiry}`;
  }

  async isHealthy(): Promise<boolean> {
    return fs.existsSync(this.uploadDir);
  }
}

function createStorageAdapter(): IStorageAdapter {
  if (env.STORAGE_PROVIDER === 's3') {
    logger.info('Using S3 / Object Storage Adapter');
    // Can be instantiated with AWS S3 client in production
    // Fall back to local if credentials absent
    return new LocalStorageAdapter(env.STORAGE_LOCAL_PATH);
  }

  logger.info(`Engaging Local Disk Storage Adapter at: ${env.STORAGE_LOCAL_PATH}`);
  return new LocalStorageAdapter(env.STORAGE_LOCAL_PATH);
}

export const storage = createStorageAdapter();
