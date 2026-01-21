import sharp from 'sharp';
import { logger } from '../../config/logger';
import { uploadToMinio, downloadFromMinio } from '../../repositories/minioHelpers';

export async function processImage(data: any): Promise<{ metadata: any; thumbnailKey: string }> {
  logger.info('Downloading raw image from Minio', { rawKey: data.rawKey });
  const buffer = await downloadFromMinio(data.rawKey);
  const image = sharp(buffer);
  const metadata = await image.metadata();

  logger.info('Generating image thumbnail', { assetId: data.assetId });
  const thumbnailBuffer = await image.resize(300).toBuffer();
  const thumbnailKey = `processed/uploads/${data.assetId}-thumbnail.jpg`;
  await uploadToMinio(thumbnailKey, thumbnailBuffer, 'image/jpeg');
  logger.info('Thumbnail uploaded to Minio', { thumbnailKey });

  logger.info('Image processing complete', { assetId: data.assetId });

  return {
    metadata: {
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
    },
    thumbnailKey,
  };
}
