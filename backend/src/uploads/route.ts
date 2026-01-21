import multer from 'multer';
import { Router } from 'express';
import { uploadFile } from './controller';

export const router = Router();

const upload = multer({ storage: multer.memoryStorage() }); // Use memory storage for MinIO

router.post('/', upload.array('file', 10), uploadFile ); // Allow up to 10 files
export default router;
