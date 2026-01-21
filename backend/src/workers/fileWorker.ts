import { Worker } from 'bullmq';
import { redisConnection } from '../config/redis';
import { logger } from '../config/logger';
import { processImage } from './processors/imageProcessor';
import { processVideo } from './processors/videoProcessor';

import { AssetRepository } from '../repositories/AssetRepository';
import connectDB from '../config/db';

// Connect to MongoDB before starting the worker
connectDB();

export const fileWorker = new Worker(
  'process-asset',
  async (job) => {
    logger.info('--- Asset Processing Job Started ---', {
      jobId: job.id,
      assetId: job.data.assetId,
      rawKey: job.data.rawKey,
      mimetype: job.data.mimetype,
    });

    // Set status to 'processing' as soon as the worker picks up the job
    await new AssetRepository().updateAssetStatus(
      job.data.assetId,
      'processing',
      {}
    );

    let metadata = {};
    let thumbnailKey = '';
    let variants = {};

    try {

      if (job.data.mimetype && job.data.mimetype.startsWith('image/')) {
        logger.info('Processing image asset', { assetId: job.data.assetId });
        const result = await processImage(job.data) as { metadata: any; thumbnailKey: string };
        metadata = result.metadata;
        thumbnailKey = result.thumbnailKey;
        logger.info('Image asset processed', { assetId: job.data.assetId, thumbnailKey });
      }

      if (job.data.mimetype && job.data.mimetype.startsWith('video/')) {
        logger.info('Processing video asset', { assetId: job.data.assetId });
        const result = await processVideo(job.data) as { metadata: any; variants: any; thumbnailKey: string };
        metadata = result.metadata;
        variants = result.variants;
        thumbnailKey = result.thumbnailKey;
        logger.info('Video asset processed', { assetId: job.data.assetId, variants, thumbnailKey });
      }

      logger.info('Updating asset status to processed', { assetId: job.data.assetId });
      await new AssetRepository().updateAssetStatus(
        job.data.assetId,
        'processed',
        {
          metadata,
          thumbnailKey,
          variants,
        }
      );
      logger.info('--- Asset Processing Job Completed ---', { assetId: job.data.assetId });
    } catch (err: any) {
      logger.error('Asset processing failed', { assetId: job.data.assetId, error: err.message || String(err) });
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
