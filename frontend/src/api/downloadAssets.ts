import { config } from '../config/env';

export async function downloadAssets(selectedAssetIds: string[]): Promise<void> {
  if (!selectedAssetIds.length) return;
  const response = await fetch(`${config.apiBaseUrl}/api/assets/download`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ids: selectedAssetIds }),
  });
  if (!response.ok) throw new Error('Failed to download assets');
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  let filename = 'assets.zip';
  if (selectedAssetIds.length === 1) {
    // Try to get filename from Content-Disposition header
    const disposition = response.headers.get('Content-Disposition');
    if (disposition && disposition.includes('filename=')) {
      const match = disposition.match(/filename="?([^";]+)"?/);
      if (match && match[1]) {
        filename = match[1];
      } else {
        filename = `${selectedAssetIds[0]}`;
      }
    } else {
      filename = `${selectedAssetIds[0]}`;
    }
  }
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    window.URL.revokeObjectURL(url);
    a.remove();
  }, 100);
}
