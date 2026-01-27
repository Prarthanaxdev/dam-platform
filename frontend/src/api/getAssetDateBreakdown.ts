import { config } from '../config/env';

export interface AssetDateBreakdown {
  [date: string]: number;
}

export async function getAssetDateBreakdown(): Promise<AssetDateBreakdown> {
  const res = await fetch(`${config.apiBaseUrl}/api/assets/analytics/by-date`);
  if (!res.ok) throw new Error('Failed to fetch asset date breakdown');
  return res.json();
}
