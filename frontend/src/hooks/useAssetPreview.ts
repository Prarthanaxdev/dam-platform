import { useCallback } from 'react';
import type { Asset } from '../api/getAssets';
import { getThumbnailUrl } from '../utils/minio';

export function useAssetPreview() {
  return useCallback((asset: Asset, variantKey?: string) => {
    if (asset.variants && variantKey) {
      const variant = asset.variants[variantKey];
      let videoKey = '';
      if (typeof variant === 'string') {
        videoKey = variant;
      } else if (variant && typeof variant === 'object' && 'key' in variant) {
        videoKey = variant.key;
      }
      if (videoKey) {
        window.open(getThumbnailUrl(videoKey), '_blank');
      }
    } else {
      window.open(getThumbnailUrl(asset.rawKey || ''), '_blank');
    }
  }, []);
}
