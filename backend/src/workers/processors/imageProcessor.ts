import sharp from 'sharp';
import { logger } from '../../config/logger';
import { uploadToMinio, downloadFromMinio } from '../../repositories/minioHelpers';

export async function processImage(data: any): Promise<{ metadata: any; thumbnailKey: string }> {
  // Download the raw image from Minio
  const buffer = await downloadFromMinio(data.rawKey);
  const image = sharp(buffer);
  const metadata = await image.metadata();

  logger.info('Generating thumbnail');

  const thumbnailBuffer = await image.resize(300).toBuffer();
  const thumbnailKey = `processed/uploads/${data.assetId}-thumbnail.jpg`;
  // Save processed image to Minio
  await uploadToMinio(thumbnailKey, thumbnailBuffer, 'image/jpeg');

  logger.info('Image processing done and saved to Minio');

  return {
    metadata: {
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
    },
    thumbnailKey,
  }
}
