import { config } from '../config/env';

export interface AssetTypeBreakdown {
  [type: string]: number;
}

export async function getAssetTypeBreakdown(): Promise<AssetTypeBreakdown> {
  const res = await fetch(`${config.apiBaseUrl}/api/assets/analytics/by-type`);
  if (!res.ok) throw new Error('Failed to fetch asset type breakdown');
  return res.json();
}
