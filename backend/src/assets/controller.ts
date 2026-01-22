/**
 * Get asset usage analytics: total downloads, uploads, and assets
 * @route GET /api/assets/analytics
 */
export const getAssetUsageAnalytics = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const AssetModel = (await import('../models/Asset')).default;
    // Total assets
    const totalAssets = await AssetModel.countDocuments();
    // Total downloads (sum of downloadCount)
    const downloadAgg = await AssetModel.aggregate([
      { $group: { _id: null, totalDownloads: { $sum: '$downloadCount' } } },
    ]);
    const totalDownloads = downloadAgg[0]?.totalDownloads || 0;
    // Total uploads (count where status is 'uploaded' or 'processed')
    const totalUploads = await AssetModel.countDocuments({
      status: { $in: ['uploaded', 'processed'] },
    });
    res.json({ totalAssets, totalDownloads, totalUploads });
  } catch (err) {
    next(err);
  }
};
import { Request, Response, NextFunction } from 'express';
import { AssetApplicationService } from '@service/application/assetApplicationService';
import { AssetRepository } from '@repositories/AssetRepository';
// Removed direct minioHelpers import

const assetAppService = new AssetApplicationService();

/**
 * Get assets with filters and pagination
 * @param req - Express request object (expects query parameters for filters and pagination)
 * @param res - Express response object
 * @param next - Express next function
 * @returns Sends JSON response with the list of assets and pagination info
 */
export const getAssets = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status, type, search, page, limit } = req.query;
    const filters: Record<string, any> = {};
    if (typeof status === 'string') filters.status = status;
    if (typeof type === 'string') filters.type = type;
    if (typeof search === 'string') filters.filename = { $regex: search, $options: 'i' };
    const pageNum = page ? Number(page) : 1;
    const limitNum = limit ? Number(limit) : 20;
    const skip = (pageNum - 1) * limitNum;
    const assets = await AssetRepository.findAssets(filters, skip, limitNum);
    const total = await AssetRepository.countAssets(filters);
    res.json({
      assets,
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Download original asset file and increment download count
 * @route POST /api/assets/:id/download
 */
export const downloadAsset = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: 'Missing asset id' });
      return;
    }
    const assetId = Array.isArray(id) ? id[0] : id;
    const { buffer, contentType, filename } = await assetAppService.downloadOriginal(assetId);
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(buffer);
  } catch (err) {
    next(err);
  }
};

/**
 * Get total download count across all assets
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 * @returns Sends JSON response with total download count
 */
export const getTotalDownloadCount = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Aggregate total downloadCount from all assets
    const AssetModel = (await import('../models/Asset')).default;
    const result = await AssetModel.aggregate([
      { $group: { _id: null, totalDownloads: { $sum: '$downloadCount' } } },
    ]);
    const totalDownloads = result[0]?.totalDownloads || 0;
    res.json({ totalDownloads });
  } catch (err) {
    next(err);
  }
};
