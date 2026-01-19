import { Worker } from 'bullmq';
import { redisConnection } from '../config/redis';
import { logger } from '../config/logger';
import { processImage } from './processors/imageProcessor';
import { processVideo } from './processors/videoProcessor';
import { AssetRepository } from '../repositories/AssetRepository';

export const fileWorker = new Worker(
  'process-asset',
  async (job) => {
    logger.info('Job received', {
      jobId: job.id,
      rawKey: job.data.rawKey,
      mimetype: job.data.mimetype,
    });

    let metadata = {};
    let thumbnailKey = '';
    let variants = {};

    try {
      if (job.data.mimetype && job.data.mimetype.startsWith('image/')) {
        const result = await processImage(job.data) as { metadata: any; thumbnailKey: string };
        metadata = result.metadata;
        thumbnailKey = result.thumbnailKey;
      }

      if (job.data.mimetype && job.data.mimetype.startsWith('video/')) {
        const result = await processVideo(job.data) as { metadata: any; variants: any };
        metadata = result.metadata;
        variants = result.variants;
      }

      await new AssetRepository().updateAssetStatus(
        job.data.assetId,
        'processed',
        {
          metadata,
          thumbnailKey,
          variants,
        }
      );
    } catch (err: any) {
      await new AssetRepository().updateAssetStatus(
        job.data.assetId,
        'failed',
        {
          error: err.message || String(err),
        }
      );
      throw err;
    }
  },
  {
    connection: redisConnection,
  }
);

fileWorker.on('completed', (job) => {
  logger.info('Job completed', { jobId: job.id });
});

fileWorker.on('failed', (job, err) => {
  logger.error('Job failed', {
    jobId: job?.id,
    error: err.message,
  });
});
