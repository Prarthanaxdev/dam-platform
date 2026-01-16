import { MinioUploadRepository } from '../../repositories/MinioUploadReposiory';

export class UploadDomainService {
  private minioRepository: MinioUploadRepository;

  constructor() {
    this.minioRepository = new MinioUploadRepository();
  }

  async uploadFile(file: Express.Multer.File): Promise<void> {
    if (!file.mimetype.startsWith('image/') && !file.mimetype.startsWith('video/')) {
      throw new Error(`Unsupported file type: ${file.mimetype}`);
    }

    if (file.size === 0) {
      throw new Error('Empty file not allowed');
    }

    await this.minioRepository.uploadFile(file);
  }
}
