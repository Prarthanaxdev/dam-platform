import AssetModel from '../models/Asset';

/**
 * Asset Repository
 * Handles all database operations for Asset model
 */
export class AssetRepository {
  async createAssetRecord(assetData: { assetId: string; rawKey: string; status: string; tags?: string[] }) {
    const asset = new AssetModel({
      assetId: assetData.assetId,
      rawKey: assetData.rawKey,
      status: assetData.status,
      tags: assetData.tags || [],
    });
    return asset.save();
  }

  async updateAssetStatus(assetId: string, status: string, updateData: Partial<{ metadata: any; thumbnailKey: string; variants: any; error: string; tags: string[] }>) {
    return AssetModel.findOneAndUpdate(
      { assetId },
      {
        status,
        ...updateData,
      },
      { new: true }
    ).exec();
  }
}
