import React from 'react';
import type { Asset } from '../api/getAssets';
import { getThumbnailUrl, getFilename } from '../utils/minio';

interface AssetRowProps {
  asset: Asset;
  selected: boolean;
  onSelect: (id: string) => void;
  onPreview: (asset: Asset, variantKey?: string) => void;
  onDownload?: (asset: Asset) => void;
}

const AssetRow: React.FC<AssetRowProps> = React.memo(
  ({ asset, selected, onSelect, onPreview, onDownload }) => {
    const id = asset.assetId || asset.id || '';
    return (
      <tr key={id} className="border-t hover:bg-gray-50 transition group">
        <td className="px-3 py-3 align-middle text-center">
          <input
            type="checkbox"
            checked={selected}
            onChange={() => onSelect(id)}
            aria-label={`Select asset ${id}`}
            className="accent-blue-500 w-4 h-4 rounded border-gray-300 focus:ring-2 focus:ring-blue-400"
          />
        </td>
        <td className="px-3 py-3 align-middle text-center">
          {asset.thumbnailKey ? (
            <img
              src={getThumbnailUrl(asset.thumbnailKey)}
              alt={asset.name}
              width={48}
              height={48}
              loading="lazy"
              className="w-12 h-12 object-cover rounded shadow-sm border border-gray-200 mx-auto"
            />
          ) : (
            <span className="inline-flex w-12 h-12 bg-gray-100 rounded items-center justify-center text-gray-300 border border-gray-200 mx-auto">
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <rect x="4" y="4" width="16" height="16" rx="3" />
                <path d="M4 17l4-4a3 3 0 0 1 4 0l4 4" />
                <circle cx="9" cy="9" r="2" />
              </svg>
            </span>
          )}
        </td>
        <td className="px-3 py-3 align-middle font-medium text-gray-900 whitespace-nowrap">
          {getFilename(asset.rawKey, asset.assetId)}
        </td>
        <td className="px-3 py-3 align-middle">
          {asset.tags && asset.tags.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {asset.tags.slice(0, 3).map((tag: string, idx: number) => (
                <span
                  key={`${tag}-${id || idx}`}
                  className="inline-block bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
              {asset.tags.length > 3 && (
                <span className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-semibold ml-1">
                  +{asset.tags.length - 3} more
                </span>
              )}
            </div>
          ) : (
            <span className="text-gray-400 text-xs">No tags</span>
          )}
        </td>
        <td className="px-3 py-3 align-middle">
          {asset.status ? (
            <span
              className={
                `inline-block px-2 py-0.5 rounded-full text-xs font-semibold ` +
                (asset.status === 'processed'
                  ? 'bg-green-100 text-green-700'
                  : asset.status === 'processing'
                    ? 'bg-yellow-100 text-yellow-700'
                    : asset.status === 'uploaded'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-200 text-gray-600')
              }
            >
              {asset.status}
            </span>
          ) : (
            <span className="text-gray-400 text-xs">Unknown</span>
          )}
        </td>

        <td className="px-3 py-3 align-middle text-center">
          <div className="flex items-center justify-center gap-2">
            <a
              onClick={
                onDownload
                  ? (e) => {
                      e.preventDefault();
                      onDownload(asset);
                    }
                  : undefined
              }
              className="hover:bg-blue-50 p-1 rounded transition"
              aria-label="Download"
              title="Download"
              href="#"
            >
              <img
                width="22"
                height="22"
                src="https://img.icons8.com/material-outlined/24/download--v1.png"
                alt="download"
              />
            </a>
            {asset.variants ? (
              <div className="flex gap-1">
                {Object.keys(asset.variants).map((variant) => (
                  <button
                    key={variant}
                    title={`Preview ${variant}`}
                    className="hover:bg-blue-50 p-1 rounded border border-gray-200 text-xs transition"
                    onClick={() => onPreview(asset, variant)}
                    aria-label={`Preview ${variant}`}
                  >
                    {variant}
                  </button>
                ))}
              </div>
            ) : (
              <button
                title="Preview"
                className="hover:bg-blue-50 p-1 rounded transition"
                onClick={() => onPreview(asset)}
                aria-label="Preview"
              >
                <img
                  width="22"
                  height="22"
                  src="https://img.icons8.com/material-outlined/24/visible--v1.png"
                  alt="preview"
                />
              </button>
            )}
          </div>
        </td>
      </tr>
    );
  }
);

export default AssetRow;
