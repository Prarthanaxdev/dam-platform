import 'module-alias/register';
import { Worker } from 'bullmq';
import { redisConnection } from '@config/redis';
import { logger } from '@config/logger';
import { processImage } from '@workers/processors/imageProcessor';
import { processVideo } from '@workers/processors/videoProcessor';
import { Queue } from 'bullmq';

import { AssetRepository } from '@repositories/AssetRepository';
import connectDB from '@config/db';

// Connect to MongoDB before starting the worker
connectDB();

// Extract processor function for reuse
const fileProcessor = async (job: any) => {
  logger.info('--- Asset Processing Job Started ---', {
    jobId: job.id,
    assetId: job.data.assetId,
    rawKey: job.data.rawKey,
    mimetype: job.data.mimetype,
  });

  await new AssetRepository().updateAssetStatus(job.data.assetId, 'processing', {});

  let metadata = {};
  let thumbnailKey = '';
  let variants = {};

  try {
    if (job.data.mimetype && job.data.mimetype.startsWith('image/')) {
      logger.info('Processing image asset', { assetId: job.data.assetId });
      const result = (await processImage(job.data)) as { metadata: any; thumbnailKey: string };
      metadata = result.metadata;
      thumbnailKey = result.thumbnailKey;
      logger.info('Image asset processed', { assetId: job.data.assetId, thumbnailKey });
    }

    if (job.data.mimetype && job.data.mimetype.startsWith('video/')) {
      logger.info('Processing video asset', { assetId: job.data.assetId });
      const result = (await processVideo(job.data)) as {
        metadata: any;
        variants: any;
        thumbnailKey: string;
      };
      metadata = result.metadata;
      variants = result.variants;
      thumbnailKey = result.thumbnailKey;
      logger.info('Video asset processed', { assetId: job.data.assetId, variants, thumbnailKey });
    }

    logger.info('Updating asset status to processed', { assetId: job.data.assetId });
    await new AssetRepository().updateAssetStatus(job.data.assetId, 'processed', {
      metadata,
      thumbnailKey,
      variants,
    });
    logger.info('--- Asset Processing Job Completed ---', { assetId: job.data.assetId });
  } catch (err: any) {
    logger.error('Asset processing failed', {
      assetId: job.data.assetId,
      error: err.message || String(err),
    });
    await new AssetRepository().updateAssetStatus(job.data.assetId, 'failed', {
      error: err.message || String(err),
    });
    throw err;
  }
};

export const fileWorker = new Worker('process-asset', fileProcessor, {
  connection: redisConnection,
  name: 'file-worker-0',
});

fileWorker.on('completed', (job) => {
  logger.info('Job completed', { jobId: job.id });
});

fileWorker.on('failed', (job, err) => {
  logger.error('Job failed', {
    jobId: job?.id,
    error: err.message,
  });
});

// Dynamic worker scaling based on queue size
const queue = new Queue('process-asset', { connection: redisConnection });
let workers: Worker[] = [fileWorker];

async function scaleWorkers() {
  const waiting = await queue.getWaitingCount();
  // 1 worker per 10 jobs, min 1, max 10
  const desiredWorkers = Math.max(1, Math.min(Math.ceil(waiting / 10), 10));

  // Add workers if needed
  while (workers.length < desiredWorkers) {
    const w = new Worker('process-asset', fileProcessor, {
      connection: redisConnection,
      name: `file-worker-${workers.length}`, // Unique name for each worker
    });
    workers.push(w);
    logger.info('Spawned new worker. Total workers:', { count: workers.length });
  }
  // Remove workers if too many
  while (workers.length > desiredWorkers) {
    const w = workers.pop();
    if (w) await w.close();
    logger.info('Closed a worker. Total workers:', { count: workers.length });
  }
}

setInterval(scaleWorkers, 5000); // Check every 5 seconds
