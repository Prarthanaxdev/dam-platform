import { AssetDomainService } from '../domain/assetDomainService';

export class AssetApplicationService {
  private assetDomainService = new AssetDomainService();

  async getPreview({ assetId, size, resolution }: { assetId: string; size?: string; resolution?: string }) {
    // 1. Get preview info (key, contentType) from domain layer
    const { key, contentType } = await this.assetDomainService.getAssetPreviewInfo(assetId, size, resolution);
    // 2. Download buffer from domain layer
    const buffer = await this.assetDomainService.downloadPreviewBuffer(key);
    return { buffer, contentType };
  }
}
