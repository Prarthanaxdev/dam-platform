import { useQuery, useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { fetchAssets } from '../api/getAssets';
import { getThumbnailUrl } from '../utils/minio';
import type { Asset } from '../api/getAssets';
import { downloadAssets } from '../api/downloadAssets';
import { bulkDeleteAssets } from '../api/bulkdeleteAsset';
import AssetRow from './AssetRow';
import { useAssetFilters, useAllTags } from '../hooks/useAssetFilters';

export default function Assets() {
  const [typeFilter, setTypeFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  // Multiselect state
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);

  const {
    data: assets = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery<Asset[]>({
    queryKey: ['assets'],
    queryFn: fetchAssets,
  });

  // React Query mutation for bulk download
  const downloadMutation = useMutation({
    mutationFn: (ids: string[]) => downloadAssets(ids),
  });

  // React Query mutation for bulk delete
  const deleteMutation = useMutation({
    mutationFn: (ids: string[]) => bulkDeleteAssets(ids),
    onSuccess: () => {
      setSelectedAssets([]);
      refetch();
    },
  });

  const allTags = useAllTags(assets);
  const filteredAssets = useAssetFilters(assets, typeFilter, tagFilter, dateFilter);

  // Simple preview handler
  const handlePreview = (asset: Asset, variantKey?: string) => {
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
  };

  // Select all filtered assets
  const allFilteredIds = filteredAssets.map((asset) => asset.assetId || asset.id || '');
  const isAllSelected =
    allFilteredIds.length > 0 && allFilteredIds.every((id) => selectedAssets.includes(id));

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedAssets([]);
    } else {
      setSelectedAssets(allFilteredIds);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedAssets((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  // Bulk download handler
  const handleBulkDownload = () => {
    if (selectedAssets.length > 0) {
      downloadMutation.mutate(selectedAssets);
    }
  };

  // Bulk delete handler
  const handleBulkDelete = () => {
    if (selectedAssets.length > 0) {
      deleteMutation.mutate(selectedAssets);
    }
  };

  return (
    <div>
      {downloadMutation.isPending && (
        <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow text-lg font-semibold flex items-center gap-2">
            <svg
              className="animate-spin h-6 w-6 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Downloading assets...
          </div>
        </div>
      )}

      {/* Main content wrapped in a parent div to fix JSX error */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Assets</h2>
            <p className="text-gray-500 mb-4">Browse and manage your digital assets</p>
          </div>
          <button
            onClick={() => refetch()}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center"
            disabled={isFetching}
          >
            {isFetching ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
        <div className="flex gap-2 mb-2">
          <button
            disabled={selectedAssets.length === 0}
            onClick={handleBulkDownload}
            className="bg-blue-500 text-white px-3 py-1 rounded disabled:opacity-50"
          >
            Download Selected
          </button>
          <button
            disabled={selectedAssets.length === 0}
            onClick={handleBulkDelete}
            className="bg-red-500 text-white px-3 py-1 rounded disabled:opacity-50"
          >
            Delete Selected
          </button>
        </div>
        <div className="flex gap-4 mb-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Type</label>
            <select
              className="border rounded px-2 py-1"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="">All</option>
              <option value="image">Image</option>
              <option value="video">Video</option>
              <option value="document">Document</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Tag</label>
            <select
              className="border rounded px-2 py-1"
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
            >
              <option value="">All</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Date</label>
            <input
              type="date"
              className="border rounded px-2 py-1"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
        </div>
        {isLoading && <div>Loading...</div>}
        {isError && <div className="text-red-500">Failed to load assets.</div>}
        {!isLoading && !isError && (
          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    aria-label="Select all"
                  />
                </th>
                <th className="px-4 py-2 text-left">Thumbnail</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Tags</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.map((asset) => (
                <AssetRow
                  key={asset.assetId || asset.id}
                  asset={asset}
                  selected={selectedAssets.includes(asset.assetId || asset.id || '')}
                  onSelect={handleSelectOne}
                  onPreview={handlePreview}
                  onDownload={(a) => downloadAssets([a.assetId || a.id || ''])}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
