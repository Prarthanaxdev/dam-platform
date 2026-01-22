import { useQuery } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import { fetchAssets } from '../api/getAssets';
import type { Asset } from '../api/getAssets';
import { getThumbnailUrl, getFilename } from '../utils/minio';

export default function Assets() {
  const [typeFilter, setTypeFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

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

  // Get all unique tags for filter dropdown
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    assets.forEach((asset) => asset.tags?.forEach((tag) => tagSet.add(tag)));
    return Array.from(tagSet);
  }, [assets]);

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

  // Filter assets client-side
  const filteredAssets = assets.filter((asset) => {
    const matchesType = !typeFilter || (asset.tags && asset.tags.includes(typeFilter));
    const matchesTag = !tagFilter || (asset.tags && asset.tags.includes(tagFilter));
    const matchesDate =
      !dateFilter || (asset.createdAt && asset.createdAt.slice(0, 10) === dateFilter);
    return matchesType && matchesTag && matchesDate;
  });

  return (
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

      {/* Filters */}
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
              <th className="px-4 py-2 text-left">Thumbnail</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Tags</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Downloads</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssets.map((asset: Asset) => (
              <tr key={asset.id || asset.assetId} className="border-t">
                <td className="px-4 py-2">
                  {asset.thumbnailKey ? (
                    <img
                      src={getThumbnailUrl(asset.thumbnailKey)}
                      alt={asset.name}
                      width={48}
                      height={48}
                      loading="lazy"
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : (
                    <span className="inline-block w-12 h-12 bg-gray-100 rounded flex items-center justify-center"></span>
                  )}
                </td>
                <td className="px-4 py-2 font-medium">
                  {getFilename(asset.rawKey, asset.assetId)}
                </td>
                <td className="px-4 py-2">
                  {asset.tags && asset.tags.length > 0 ? (
                    asset.tags.map((tag: string, idx: number) => (
                      <span
                        key={`${tag}-${asset.id || asset.assetId || idx}`}
                        className="inline-block bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded mr-1"
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400 text-xs">No tags</span>
                  )}
                </td>
                <td className="px-4 py-2">
                  {asset.status ? (
                    <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                      {asset.status}
                    </span>
                  ) : (
                    <span className="text-gray-400 text-xs">Unknown</span>
                  )}
                </td>
                <td className="px-4 py-2 text-center">
                  {asset.downloadCount ?? 0}
                </td>
                <td className="px-4 py-2 flex gap-2">
                  <a
                    href={`${import.meta.env.VITE_API_BASE_URL || ''}/api/assets/${asset.assetId}/download`}
                    className="hover:bg-gray-100 p-1 rounded"
                    aria-label="Download"
                    title="Download"
                  >
                    <img
                      width="24"
                      height="24"
                      src="https://img.icons8.com/material-outlined/24/download--v1.png"
                      alt="download"
                    />
                  </a>
                  {/* Preview logic for video with variants */}
                  {asset.variants ? (
                    <div className="flex gap-1">
                      {Object.keys(asset.variants).map((variant) => (
                        <button
                          key={variant}
                          title={`Preview ${variant}`}
                          className="hover:bg-gray-100 p-1 rounded border border-gray-200 text-xs"
                          onClick={() => handlePreview(asset, variant)}
                          aria-label={`Preview ${variant}`}
                        >
                          {variant}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <button
                      title="Preview"
                      className="hover:bg-gray-100 p-1 rounded"
                      onClick={() => handlePreview(asset)}
                      aria-label="Preview"
                    >
                      <img
                        width="24"
                        height="24"
                        src="https://img.icons8.com/material-outlined/24/visible--v1.png"
                        alt="preview"
                      />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
