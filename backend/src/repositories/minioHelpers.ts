import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { s3, MINIO_BUCKET } from '@config/minio';

export async function uploadToMinio(key: string, body: Buffer, contentType: string) {
  await s3.send(
    new PutObjectCommand({
      Bucket: MINIO_BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  );
}

export async function downloadFromMinio(key: string): Promise<Buffer> {
  const response = await s3.send(
    new GetObjectCommand({
      Bucket: MINIO_BUCKET,
      Key: key,
    }),
  );

  const stream = response.Body as any;
  const chunks: Buffer[] = [];

  for await (const chunk of stream) {
    chunks.push(chunk);
  }

  return Buffer.concat(chunks);
}
