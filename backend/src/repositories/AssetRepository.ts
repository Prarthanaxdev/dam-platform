import AssetModel from '@models/Asset';

/**
 * Asset Repository
 * Handles all database operations for Asset model
 */
export class AssetRepository {
  async createAssetRecord(assetData: {
    assetId: string;
    rawKey: string;
    status: string;
    tags?: string[];
    metadata?: any;
  }) {
    const asset = new AssetModel({
      assetId: assetData.assetId,
      rawKey: assetData.rawKey,
      status: assetData.status,
      tags: assetData.tags || [],
      metadata: assetData.metadata || {},
    });
    return asset.save();
  }

  async updateAssetStatus(
    assetId: string,
    status: string,
    updateData: Partial<{
      metadata: any;
      thumbnailKey: string;
      variants: any;
      error: string;
      tags: string[];
    }>,
  ) {
    return AssetModel.findOneAndUpdate(
      { assetId },
      {
        status,
        ...updateData,
      },
      { new: true },
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

  static async getTypeBreakdown() {
    // Group by type (using tags as type)
    const result = await AssetModel.aggregate([
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    const breakdown: Record<string, number> = {};
    result.forEach((row: any) => {
      breakdown[row._id] = row.count;
    });
    return breakdown;
  }

  static async getDateBreakdown() {
    const result = await AssetModel.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    const breakdown: Record<string, number> = {};
    result.forEach((row: any) => {
      breakdown[row._id] = row.count;
    });
    return breakdown;
  }
}
