import winston from 'winston';

const isServerless = process.env.VERCEL || process.env.NODE_ENV === 'production';

const transports: winston.transport[] = [new winston.transports.Console()];

// Only add file transports if not in serverless environment
if (!isServerless) {
  transports.push(
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }), // logs only errors
    new winston.transports.File({ filename: 'logs/combined.log' }), // logs all levels (info, warn, error)
  );
}

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  transports,
});

export default logger;
