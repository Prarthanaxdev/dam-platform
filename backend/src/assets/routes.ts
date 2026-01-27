import { Router } from 'express';
import {
  getAssets,
  downloadAsset,
  getTotalDownloadCount,
  getAssetUsageAnalytics,
  bulkDeleteAssets,
  getAssetTypeBreakdown,
  getAssetDateBreakdown,
} from './controller';

export const router = Router();

router.get('/assets', getAssets);
router.get('/assets/analytics', getAssetUsageAnalytics);
router.get('/assets/analytics/by-type', getAssetTypeBreakdown);
router.get('/assets/analytics/by-date', getAssetDateBreakdown);
router.get('/assets/downloads', getTotalDownloadCount);
router.post('/assets/download', downloadAsset);
router.delete('/assets/bulk-delete', bulkDeleteAssets);

export default router;
