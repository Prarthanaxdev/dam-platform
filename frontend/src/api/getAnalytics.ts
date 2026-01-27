import { config } from '../config/env';

export interface AnalyticsData {
  totalAssets: number;
  totalUploads: number;
  totalDownloads: number;
}

export async function getAnalytics(): Promise<AnalyticsData> {
  const res = await fetch(`${config.apiBaseUrl}/api/assets/analytics`);
  if (!res.ok) throw new Error('Failed to fetch analytics');
  return res.json();
}
