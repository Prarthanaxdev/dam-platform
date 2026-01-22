import { Types } from 'mongoose';

export interface IAsset {
  assetId: string;
  rawKey: string;
  status: 'uploaded' | 'processing' | 'processed' | 'failed';
  metadata?: { [key: string]: any };
  thumbnailKey?: string;
  variants?: { [key: string]: { key: string; contentType?: string } };
  error?: string;
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  downloadCount?: number;
}
