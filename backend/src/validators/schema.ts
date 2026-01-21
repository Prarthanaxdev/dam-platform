import { z } from 'zod';

// ============== UPLOAD SCHEMAS ==============
// Schema for Multer file object
export const UploadSchema = z.object({
  originalname: z.string().min(1, 'Filename is required'),
  size: z.number().positive('Size must be a positive number'),
  mimetype: z.string().min(1, 'MIME type is required'),
});

// Schema for asset query parameters
export const assetQuerySchema = z.object({
  status: z.string().optional(),
  type: z.string().optional(),
  search: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
});

export const previewQuerySchema = z.object({
  size: z.string().optional(),
  resolution: z.string().optional(),
});

