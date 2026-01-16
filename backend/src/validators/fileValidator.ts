// Custom middleware to validate each uploaded file
import type { Request, Response, NextFunction } from 'express';
import { UploadSchema } from './schema';

const validateFiles = (req: Request, res: Response, next: NextFunction) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || !Array.isArray(files) || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
    files.forEach(file => UploadSchema.parse(file));
    next();
  } catch (error) {
    next(error);
  }
};
export default validateFiles;
