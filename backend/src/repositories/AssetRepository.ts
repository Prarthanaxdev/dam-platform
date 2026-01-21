
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

  static async findAssets(filters: any, skip: number, limit: number) {
    return AssetModel.find(filters).skip(skip).limit(limit).sort({ createdAt: -1 });
  }

  static async countAssets(filters: any) {
    return AssetModel.countDocuments(filters);
  }

  async findAssetById(assetId: string) {
    return AssetModel.findOne({ assetId }).lean();
  }
}
