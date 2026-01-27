import { useAssetFilters } from './useAssetFilters';
import type { Asset } from '../api/getAssets';

import { renderHook } from '@testing-library/react';
describe('useAssetFilters', () => {
  const mockAssets: Asset[] = [
    { id: '1', tags: ['image', 'summer'], createdAt: '2026-01-27T12:00:00Z', name: 'A' },
    { id: '2', tags: ['video'], createdAt: '2026-01-26T12:00:00Z', name: 'B' },
    { id: '3', tags: ['image', 'winter'], createdAt: '2026-01-27T15:00:00Z', name: 'C' },
  ];

  it('returns all assets if no filters', () => {
    const { result } = renderHook(() => useAssetFilters(mockAssets, '', '', ''));
    expect(result.current.length).toBe(3);
  });

  it('filters by type', () => {
    const { result } = renderHook(() => useAssetFilters(mockAssets, 'video', '', ''));
    expect(result.current.length).toBe(1);
    expect(result.current[0].id).toBe('2');
  });

  it('filters by tag', () => {
    const { result } = renderHook(() => useAssetFilters(mockAssets, '', 'winter', ''));
    expect(result.current.length).toBe(1);
    expect(result.current[0].id).toBe('3');
  });

  it('filters by date', () => {
    const { result } = renderHook(() => useAssetFilters(mockAssets, '', '', '2026-01-27'));
    expect(result.current.length).toBe(2);
  });
});
