import ffmpeg from 'fluent-ffmpeg';
import { logger } from '../../config/logger';
import { uploadToMinio, downloadFromMinio } from '../../repositories/minioHelpers';
import fs from 'fs';
import path from 'path';

export async function processVideo(
  data: any,
): Promise<{ metadata: any; variants: any; thumbnailKey: string }> {
  logger.info('Downloading raw video from Minio', { rawKey: data.rawKey });
  const buffer = await downloadFromMinio(data.rawKey);
  const tempInputPath = path.join('/tmp', `${data.assetId}-input.mp4`);
  fs.writeFileSync(tempInputPath, buffer);

  logger.info('Starting video transcoding', { assetId: data.assetId });
  const output1080p = path.join('/tmp', `${data.assetId}-1080p.mp4`);
  const output720p = path.join('/tmp', `${data.assetId}-720p.mp4`);

  const transcode = (input: string, output: string, size: string) => {
    logger.info(`Transcoding to ${size}`, { assetId: data.assetId });
    return new Promise((resolve, reject) => {
      ffmpeg(input)
        .outputOptions([`-vf scale=${size}`])
        .output(output)
        .on('end', () => resolve(true))
        .on('error', (err: any) => reject(err))
        .run();
    });
  };

  try {
    await transcode(tempInputPath, output1080p, '1920:1080');
    await transcode(tempInputPath, output720p, '1280:720');

    logger.info('Uploading transcoded videos to Minio', { assetId: data.assetId });
    const key1080p = `processed/uploads/${data.assetId}-1080p.mp4`;
    const key720p = `processed/uploads/${data.assetId}-720p.mp4`;
    await uploadToMinio(key1080p, fs.readFileSync(output1080p), 'video/mp4');
    await uploadToMinio(key720p, fs.readFileSync(output720p), 'video/mp4');
    logger.info('Transcoded videos uploaded', { assetId: data.assetId, keys: [key1080p, key720p] });

    // Generate a thumbnail from the video (first frame)
    const thumbnailPath = path.join('/tmp', `${data.assetId}-thumbnail.jpg`);
    const thumbnailKey = `processed/uploads/${data.assetId}-thumbnail.jpg`;
    await new Promise((resolve, reject) => {
      ffmpeg(tempInputPath)
        .on('end', resolve)
        .on('error', reject)
        .screenshots({
          count: 1,
          folder: path.dirname(thumbnailPath),
          filename: path.basename(thumbnailPath),
          size: '300x?',
        });
    });
    await uploadToMinio(thumbnailKey, fs.readFileSync(thumbnailPath), 'image/jpeg');
    logger.info('Video thumbnail generated and uploaded', { assetId: data.assetId, thumbnailKey });

    return await new Promise((resolve, reject) => {
      ffmpeg.ffprobe(output1080p, (err: any, info: any) => {
        // Clean up temp files
        try {
          fs.unlinkSync(tempInputPath);
          fs.unlinkSync(output1080p);
          fs.unlinkSync(output720p);
          fs.unlinkSync(thumbnailPath);
        } catch (e) {}

        if (err) {
          logger.error('ffprobe failed', { assetId: data.assetId, error: err.message });
          reject(err);
          return;
        }

        logger.info('Video processing complete', { assetId: data.assetId });
        resolve({
          metadata: {
            duration: info.format.duration,
            format: info.format.format_name,
            size: info.format.size,
          },
          variants: {
            '1080p': key1080p,
            '720p': key720p,
          },
          thumbnailKey,
        });
      });
    });
  } catch (err) {
    logger.error('FFmpeg error', err);
    // Clean up temp files if they exist
    if (fs.existsSync(tempInputPath)) fs.unlinkSync(tempInputPath);
    if (fs.existsSync(output1080p)) fs.unlinkSync(output1080p);
    if (fs.existsSync(output720p)) fs.unlinkSync(output720p);
    throw err;
  }
}
