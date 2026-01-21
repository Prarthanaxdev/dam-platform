import { Request, Response, NextFunction } from "express";
import { AssetApplicationService } from "../service/application/assetApplicationService";
import { AssetRepository } from '../repositories/AssetRepository';

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
 * Get asset preview (image/video thumbnail or variant)
 * @param req - Express request object
 *  @param res - Express response object
 * @param next - Express next function
 * @returns Sends the asset preview buffer with appropriate content type
 */
export const getAssetPreview = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { size, resolution } = req.query;
    if (!id) {
      res.status(400).json({ error: "Missing asset id" });
      return;
    }
    const assetId = Array.isArray(id) ? id[0] : id;
    const { buffer, contentType } = await assetAppService.getPreview({
      assetId,
      size: typeof size === 'string' ? size : undefined,
      resolution: typeof resolution === 'string' ? resolution : undefined,
    });
    res.setHeader('Content-Type', contentType);
    res.send(buffer);
  } catch (error) {
    next(error);
  }
};

