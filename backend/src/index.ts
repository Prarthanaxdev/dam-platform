import dotenv from 'dotenv';
import type { Request, Response, NextFunction } from 'express';
import cors from "cors";
import express from "express";
import helmet from 'helmet';
import uploadRoutes from "./uploads/route";
import { config } from "./config/keys";
import { errorHandler } from "./middleware/errorHandler";
import { logger } from './config/logger';
import morganMiddleware from './middleware/morganMiddleware';
import { setupBullBoard } from './bullBoard/bullBoard';
import connectDB from './config/db';

dotenv.config();
const app = express()
// Middleware
app.use(helmet()); // Security headers
const corsOptions = {
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};
app.use(cors(corsOptions));
app.options('/', cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morganMiddleware);
app.use((req, __res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Basic route to test server
app.get("/ping", (req, res) => {
  console.log("Ping received");
  res.send("pong");
});

// Routes
app.use("/api", uploadRoutes)
// Error handling middleware
app.use((err: any, __req: Request, __res: Response, next: any) => {
  logger.error(err);
  next(err);
});
app.use(errorHandler);

// Bull Board setup
const bullBoardRouter = setupBullBoard();
app.use('/admin/queues', bullBoardRouter);


// Start server (connect to DB first)
const startServer = async () => {
  try {
    await connectDB();
    const PORT = config.PORT;
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
