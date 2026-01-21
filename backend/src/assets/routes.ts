import { Router } from 'express';
import { getAssets, getAssetPreview } from './controller';

export const router = Router();

router.get('/assets', getAssets);
router.get('/assets/:id/preview', getAssetPreview);
export default router;
