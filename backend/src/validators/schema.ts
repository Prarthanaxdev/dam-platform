import { z } from 'zod';

// ============== UPLOAD SCHEMAS ==============
// Schema for Multer file object
export const UploadSchema = z.object({
  originalname: z.string().min(1, 'Filename is required'),
  size: z.number().positive('Size must be a positive number'),
  mimetype: z.string().min(1, 'MIME type is required'),
});

