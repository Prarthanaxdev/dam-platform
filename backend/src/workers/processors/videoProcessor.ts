import ffmpeg from 'fluent-ffmpeg';
import { logger } from '../../config/logger';
import { uploadToMinio, downloadFromMinio } from '../../repositories/minioHelpers';
import fs from 'fs';
import path from 'path';

export async function processVideo(data: any) {
  logger.info('Extracting video metadata', {
    rawKey: data.rawKey,
  });

  // Download the raw video from Minio
  const buffer = await downloadFromMinio(data.rawKey);
  // Write buffer to a temporary file for ffmpeg input
  const tempInputPath = path.join('/tmp', `${data.assetId}-input.mp4`);
  fs.writeFileSync(tempInputPath, buffer);

  const outputPath = path.join('/tmp', `${data.assetId}-processed.mp4`);

  return new Promise((resolve, reject) => {
    ffmpeg(tempInputPath)
      .output(outputPath)
      .on('start', () => {
        logger.info('FFmpeg started');
      })
      .on('end', async () => {
        logger.info('Video transcoding completed');

        // Read processed video and upload to Minio
        const videoBuffer = fs.readFileSync(outputPath);
        const processedKey = `processed/uploads/${data.assetId}-video.mp4`;
        await uploadToMinio(processedKey, videoBuffer, 'video/mp4');

        // Example: get video metadata (duration, etc.)
        ffmpeg.ffprobe(outputPath, (err: any, info: any) => {
          // Clean up temp files
          fs.unlinkSync(tempInputPath);
          fs.unlinkSync(outputPath);

          if (err) {
            reject(err);
            return;
          }

          resolve({
            metadata: {
              duration: info.format.duration,
              format: info.format.format_name,
              size: info.format.size,
            },
            variants: {
              default: processedKey,
            },
          });
        });
      })
      .on('error', (err: any) => {
        logger.error('FFmpeg error', err);
        // Clean up temp files if they exist
        if (fs.existsSync(tempInputPath)) fs.unlinkSync(tempInputPath);
        if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
        reject(err);
      })
      .run();
  });
}
