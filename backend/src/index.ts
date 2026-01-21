/**
 * Entry point for the DAM Platform backend server.
 * Sets up Express app, middleware, API documentation, rate limiting, and error handling.
 */
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { swaggerOptions } from './config/swagger';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import express from 'express';
import uploadRoutes from '@uploads/route';
import { config } from '@config/keys';
import { errorHandler } from '@middleware/errorHandler';
import { logger } from '@config/logger';
import morganMiddleware from '@middleware/morganMiddleware';
import { setupBullBoard } from '@bullBoard/bullBoard';
import connectDB from '@config/db';
import { helmetConfig } from '@config/helmet';
import assetsRoutes from '@assets/routes';

dotenv.config();

const swaggerSpec = swaggerJsdoc(swaggerOptions);
/**
 * Rate limiting middleware for /api routes.
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

const app = express();
app.use(helmetConfig); // Security headers

const corsOptions = {
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};
app.use(cors(corsOptions));
app.options('/', cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morganMiddleware);

/**
 * Swagger UI route for API documentation.
 * Accessible at /api-docs
 */
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api', apiLimiter);
app.use((req, __res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

app.get('/ping', (req, res) => {
  console.log('Ping received');
  res.send('pong');
});

app.use('/api/uploads', uploadRoutes);
app.use('/api', assetsRoutes);
app.use(errorHandler);

// Bull Board setup
const bullBoardRouter = setupBullBoard();
app.use('/admin/queues', bullBoardRouter);

// Start server (connect to DB first)
const startServer = async () => {
  try {
    await connectDB();
    const PORT = config.PORT;
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
