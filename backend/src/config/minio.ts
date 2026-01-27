import { S3Client } from '@aws-sdk/client-s3';

if (!process.env.MINIO_ACCESS_KEY || !process.env.MINIO_SECRET_KEY) {
  throw new Error('MinIO credentials are not set in environment variables.');
}

export const s3 = new S3Client({
  region: process.env.REGION || 'us-east-1',
  endpoint: process.env.MINIO_ENDPOINT || '',
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY!,
    secretAccessKey: process.env.MINIO_SECRET_KEY!,
  },
  forcePathStyle: true,
});

export const MINIO_BUCKET = process.env.MINIO_BUCKET || '';
