import { AssetRepository } from '@repositories/AssetRepository';
export class UploadDomainService {
  private assetRepository: AssetRepository;

  constructor() {
    this.assetRepository = new AssetRepository();
  }

  async createAsset(assetData: { assetId: string; rawKey: string; status: string; tags?: string[] }) {
    return this.assetRepository.createAssetRecord(assetData);
  }
}
