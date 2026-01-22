import AssetModel from '@models/Asset';
import { AssetDomainService } from '@service/domain/assetDomainService';

export class AssetApplicationService {
  private assetDomainService = new AssetDomainService();

  /**
   * Download original file and increment download count
   */
  async downloadOriginal(
    assetId: string,
  ): Promise<{ buffer: Buffer; contentType: string; filename: string }> {
    const { asset, buffer } = await this.assetDomainService.downloadOriginalWithAsset(assetId);
    if (!asset || typeof asset.rawKey !== 'string') {
      throw new Error('Asset not found or invalid rawKey');
    }
    await AssetModel.updateOne({ assetId: asset.assetId }, { $inc: { downloadCount: 1 } });
    const metadata = (
      asset.metadata && typeof asset.metadata === 'object' ? asset.metadata : {}
    ) as any;
    const contentType =
      typeof metadata.mimetype === 'string' ? metadata.mimetype : 'application/octet-stream';
    const filename =
      typeof metadata.originalname === 'string' ? metadata.originalname : asset.rawKey;
    return { buffer, contentType, filename };
  }
}
