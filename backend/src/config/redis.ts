const REDIS_HOST = process.env.REDIS_HOST || "redis";
const REDIS_PORT = Number(process.env.REDIS_PORT) || 6379;

// Export a connection object for BullMQ
export const redisConnection = {
  host: REDIS_HOST,
  port: REDIS_PORT
};

