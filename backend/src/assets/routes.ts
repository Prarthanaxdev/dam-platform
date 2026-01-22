import { Router } from 'express';
import {
  getAssets,
  downloadAsset,
  getTotalDownloadCount,
  getAssetUsageAnalytics,
} from './controller';

export const router = Router();

router.get('/assets', getAssets);
router.get('/assets/analytics', getAssetUsageAnalytics);
router.get('/assets/downloads', getTotalDownloadCount);
router.get('/assets/:id/download', downloadAsset);

export default router;
