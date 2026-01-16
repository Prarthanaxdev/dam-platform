import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3, MINIO_BUCKET } from '../config/minio';

export class MinioUploadRepository {
  async uploadFile(file: Express.Multer.File): Promise<void> {
    const objectKey = `${Date.now()}-${file.originalname}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: MINIO_BUCKET,
        Key: objectKey,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    console.log(`Uploaded to MinIO: ${objectKey}`);
  }
}
