import { Queue } from 'bullmq';
import { redisConnection } from '../config/redis';

export const fileQueue = new Queue('process-asset', {
  connection: redisConnection,
});
