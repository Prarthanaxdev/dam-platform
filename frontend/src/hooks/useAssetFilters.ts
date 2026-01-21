import { useState, useMemo } from 'react';
import type { Asset } from '../api/getAssets';

export function useAssetFilters(assets: Asset[]) {
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [tagFilter, setTagFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    assets.forEach((asset) => asset.tags?.forEach((tag) => tagSet.add(tag)));
    return Array.from(tagSet);
  }, [assets]);

  return {
    typeFilter,
    setTypeFilter,
    tagFilter,
    setTagFilter,
    dateFilter,
    setDateFilter,
    allTags,
  };
}
