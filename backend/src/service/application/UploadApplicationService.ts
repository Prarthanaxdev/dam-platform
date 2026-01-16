// Business logic related to file uploads
import { UploadDomainService } from "../domain/UploadDomainService";
import { fileQueue } from "../../queue/fileQueue";

export class UploadApplicationService {
  private uploadDomainService: UploadDomainService;

  constructor() {
    this.uploadDomainService = new UploadDomainService();
  }

  async processUpload(files: Express.Multer.File[]): Promise<void> {
    for (const file of files) {
      // Step 1: Upload file to MinIO via domain service
      await this.uploadDomainService.uploadFile(file);

      // Step 2: Push a job to the queue for further processing (e.g., generating thumbnails)
      await fileQueue.add("post-upload", {
        filename: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        uploadedAt: Date.now(),
      });
    }
  }
}
