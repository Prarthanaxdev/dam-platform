import {Types} from 'mongoose';

export interface IAsset {
  assetId: string;
  rawKey: string;
  status: 'uploaded' | 'processing' | 'processed' | 'failed';
  metadata?: Record<string, any>;
  thumbnailKey?: string;
  variants?: Record<string, any>;
  error?: string;
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
