import { config } from '../config/env';

export async function bulkDeleteAssets(selectedAssetIds: string[]): Promise<{ deletedCount: number }> {
  if (!selectedAssetIds.length) return { deletedCount: 0 };
  const response = await fetch(`${config.apiBaseUrl}/api/assets/bulk-delete`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ids: selectedAssetIds }),
  });
  if (!response.ok) throw new Error('Failed to delete assets');
  return response.json();
}
