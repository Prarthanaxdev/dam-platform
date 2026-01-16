import { Worker } from "bullmq";
import { redisConnection } from "../config/redis";

const worker = new Worker(
  "file-processing",
  async job => {
    console.log("Processing job:", job.id, job.data);

    // Example post-processing
    if (job.data.mimetype.startsWith("image/")) {
      console.log("Do some image processing...");
    } else if (job.data.mimetype.startsWith("video/")) {
      console.log("Do some video processing...");
    }

    // Can also update database, send notifications, etc.
  },
  { connection: redisConnection }
);

worker.on("completed", job => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed:`, err);
});
