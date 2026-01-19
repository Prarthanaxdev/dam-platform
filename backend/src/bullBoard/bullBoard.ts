// src/bullboard/bullBoard.ts
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";
import { fileQueue } from "../queue/fileQueue";

export const setupBullBoard = () => {
  const serverAdapter = new ExpressAdapter();
  serverAdapter.setBasePath("/admin/queues");

  createBullBoard({
    queues: [new BullMQAdapter(fileQueue)],
    serverAdapter,
  });

  return serverAdapter.getRouter();
};
