import { AssetRepository } from '@repositories/AssetRepository';
import { downloadFromMinio } from '@repositories/minioHelpers';
import { AppError } from '@utils/AppError';

export class AssetDomainService {
  private assetRepository: AssetRepository;
  constructor() {
    this.assetRepository = new AssetRepository();
  }

  async getAssetPreviewInfo(assetId: string, size?: string, resolution?: string) {
    const asset = await this.assetRepository.findAssetById(assetId);
    if (!asset) throw new AppError('Asset not found', 404);
    let key: string | undefined =
      typeof asset.thumbnailKey === 'string' ? asset.thumbnailKey : undefined;
    let contentType = 'image/jpeg';
    const variants =
      asset.variants && typeof asset.variants === 'object'
        ? (asset.variants as Record<string, { key: string; contentType?: string }>)
        : undefined;
    if (!key && (size || resolution) && variants) {
      if (
        size &&
        typeof variants[size] === 'object' &&
        variants[size] &&
        typeof variants[size].key === 'string'
      ) {
        key = variants[size].key;
        contentType =
          typeof variants[size].contentType === 'string' ? variants[size].contentType : contentType;
      } else if (
        resolution &&
        typeof variants[resolution] === 'object' &&
        variants[resolution] &&
        typeof variants[resolution].key === 'string'
      ) {
        key = variants[resolution].key;
        contentType =
          typeof variants[resolution].contentType === 'string'
            ? variants[resolution].contentType
            : contentType;
      }
    }
    if (!key) {
      key = typeof asset.rawKey === 'string' ? asset.rawKey : undefined;
      const metadata =
        asset.metadata && typeof asset.metadata === 'object'
          ? (asset.metadata as Record<string, any>)
          : {};
      contentType =
        typeof metadata.mimetype === 'string' ? metadata.mimetype : 'application/octet-stream';
    }
    if (!key || typeof key !== 'string') {
      throw new Error('Preview key not found');
    }
    return { key, contentType };
  }

  async downloadPreviewBuffer(key: string) {
    return downloadFromMinio(key);
  }
  /**
   * Download original file buffer and return asset
   */
  async downloadOriginalWithAsset(assetId: string): Promise<{ asset: any; buffer: Buffer }> {
    const asset = await this.assetRepository.findAssetById(assetId);
    if (!asset || typeof asset.rawKey !== 'string') {
      throw new AppError('Asset not found or invalid rawKey', 404);
    }
    const buffer = await downloadFromMinio(asset.rawKey);
    return { asset, buffer };
  }
}
