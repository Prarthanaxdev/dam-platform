// Business logic related to file uploads
import { UploadDomainService } from "../domain/uploadDomainService";
import { fileQueue } from "../../queue/fileQueue";
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../../config/logger';
import { uploadToMinio } from "../../repositories/minioHelpers";
export class UploadApplicationService {
  private uploadDomainService: UploadDomainService;

  constructor() {
    this.uploadDomainService = new UploadDomainService();
  }

  async upload(file: Express.Multer.File, tags: string[] = []) {
    const assetId = uuidv4();

    const rawKey = `raw/uploads/${assetId}-${file.originalname}`;
    logger.info('Uploading file', file.mimetype);
    logger.info('Uploading file', rawKey);
    // Step 1. Save raw file to MinIO
    await uploadToMinio(rawKey, file.buffer, file.mimetype);

    // Auto-generate tags
    let finalTags = tags && tags.length > 0 ? tags : [];
    if (finalTags.length === 0) {
      // Add file type as a tag (e.g., 'image', 'video', 'audio', 'document')
      if (file.mimetype) {
        const type = file.mimetype.split('/')[0];
        finalTags.push(type);
      }
      // Add file extension as a tag
      const extMatch = file.originalname.match(/\.([a-zA-Z0-9]+)$/);
      if (extMatch) {
        finalTags.push(extMatch[1].toLowerCase());
      }
      // Add words from filename (excluding extension, split by non-word chars)
      const baseName = file.originalname.replace(/\.[^/.]+$/, "");
      finalTags.push(...baseName.split(/\W+/).filter(Boolean));
    }

    // Step 2. Create DB record: status = 'uploaded'
    await this.uploadDomainService.createAsset({
      assetId,
      rawKey,
      status: 'uploaded',
      tags: finalTags,
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
