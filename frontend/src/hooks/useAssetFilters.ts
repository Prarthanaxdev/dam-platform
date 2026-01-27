import { useMemo } from 'react';
import type { Asset } from '../api/getAssets';

export function useAssetFilters(
  assets: Asset[],
  typeFilter: string,
  tagFilter: string,
  dateFilter: string
): Asset[] {
  return useMemo(() => {
    return assets.filter((asset) => {
      const matchesType = !typeFilter || (asset.tags && asset.tags.includes(typeFilter));
      const matchesTag = !tagFilter || (asset.tags && asset.tags.includes(tagFilter));
      const matchesDate =
        !dateFilter || (asset.createdAt && asset.createdAt.slice(0, 10) === dateFilter);
      return matchesType && matchesTag && matchesDate;
    });
  }, [assets, typeFilter, tagFilter, dateFilter]);
}

export function useAllTags(assets: Asset[]): string[] {
  return useMemo(() => {
    const tagSet = new Set<string>();
    assets.forEach((asset) => asset.tags?.forEach((tag) => tagSet.add(tag)));
    return Array.from(tagSet);
  }, [assets]);
}
