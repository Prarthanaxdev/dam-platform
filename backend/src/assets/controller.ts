import { Request, Response, NextFunction } from 'express';
import { AssetApplicationService } from '@service/application/assetApplicationService';
import { AssetRepository } from '@repositories/AssetRepository';
import archiver from 'archiver';

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
 * Download multiple assets and increment download count for each
 * @route POST /api/assets/download
 * @body { ids: string[] }
 */
export const downloadAsset = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      res.status(400).json({ error: 'No asset IDs provided' });
      return;
    }
    const AssetModel = (await import('../models/Asset')).default;
    if (ids.length === 1) {
      // Single file download: stream the file directly
      try {
        const { buffer, contentType, filename } = await assetAppService.downloadOriginal(ids[0]);
        res.setHeader('Content-Type', contentType || 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        await AssetModel.updateOne({ assetId: ids[0] }, { $inc: { downloadCount: 1 } });
        res.send(buffer);
      } catch (err) {
        console.error(`Failed to download asset ${ids[0]}:`, err);
        res.status(404).json({ error: 'Asset not found or failed to download' });
      }
      return;
    }
    // Multiple files: zip
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="assets.zip"');
    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.on('error', (err) => {
      console.error('Archiver error:', err);
      res.status(500).end('Failed to create zip');
    });
    archive.pipe(res);
    let added = false;
    for (const assetId of ids) {
      try {
        const { buffer, filename } = await assetAppService.downloadOriginal(assetId);
        archive.append(buffer, { name: filename });
        await AssetModel.updateOne({ assetId }, { $inc: { downloadCount: 1 } });
        added = true;
      } catch (err) {
        console.error(`Failed to add asset ${assetId} to zip:`, err);
      }
    }
    archive.finalize();
    if (!added) {
      archive.on('end', () => {
        res.status(404).end('No valid assets to download');
      });
    }
  } catch (err) {
    console.error('Error in downloadAsset:', err);
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

/**
 * Bulk delete assets by IDs
 * @route POST /api/assets/bulk-delete
 * @body { ids: string[] }
 */
export const bulkDeleteAssets = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      res.status(400).json({ error: 'No asset IDs provided' });
      return;
    }
    const AssetModel = (await import('../models/Asset')).default;
    const result = await AssetModel.deleteMany({ assetId: { $in: ids } });
    res.json({ deletedCount: result.deletedCount });
  } catch (err) {
    next(err);
  }
};

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

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns Breakdown of assets by type
 */
export const getAssetTypeBreakdown = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const breakdown = await AssetRepository.getTypeBreakdown();
    res.json(breakdown);
  } catch (err) {
    next(err);
  }
};

/**
 *  * @param req
 *  @param res
 * @param next
 * @returns Breakdown of assets by creation date
 */
export const getAssetDateBreakdown = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const breakdown = await AssetRepository.getDateBreakdown();
    res.json(breakdown);
  } catch (err) {
    next(err);
  }
};
