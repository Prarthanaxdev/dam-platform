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
    let contentType = 'application/octet-stream';
    if (typeof metadata.mimetype === 'string') {
      contentType = metadata.mimetype;
    } else if (typeof metadata.format === 'string') {
      // Map common formats to MIME types
      const format = metadata.format.toLowerCase();
      if (format === 'jpeg' || format === 'jpg') contentType = 'image/jpeg';
      else if (format === 'png') contentType = 'image/png';
      else if (format === 'gif') contentType = 'image/gif';
      else if (format === 'webp') contentType = 'image/webp';
      else if (format === 'bmp') contentType = 'image/bmp';
      else if (format === 'tiff' || format === 'tif') contentType = 'image/tiff';
    }
    const filename =
      typeof metadata.originalname === 'string' ? metadata.originalname : asset.rawKey;
    return { buffer, contentType, filename };
  }
}
