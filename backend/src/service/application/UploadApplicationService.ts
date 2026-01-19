// Business logic related to file uploads
import { UploadDomainService } from "../domain/UploadDomainService";
import { fileQueue } from "../../queue/fileQueue";
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../../config/logger';
import { uploadToMinio } from "../../repositories/minioHelpers";
export class UploadApplicationService {
  private uploadDomainService: UploadDomainService;

  constructor() {
    this.uploadDomainService = new UploadDomainService();
  }

  async upload(file: Express.Multer.File) {
    const assetId = uuidv4();

    const rawKey = `raw/uploads/${assetId}-${file.originalname}`;
    logger.info('Uploading file', file.mimetype);
    logger.info('Uploading file', rawKey);
    // Step 1. Save raw file to MinIO
    await uploadToMinio(rawKey, file.buffer, file.mimetype);

    // Step 2. Create DB record: status = 'uploaded'
    await this.uploadDomainService.createAsset({
      assetId,
      rawKey,
      status: 'uploaded',
    });

    // Step 3. Push job to BullMQ
    await fileQueue.add('process-asset', {
      assetId,
      rawKey,
      mimetype: file.mimetype,
    });

    return {
      assetId,
      status: 'File upload initiated and processing started',
    };
  }
}
