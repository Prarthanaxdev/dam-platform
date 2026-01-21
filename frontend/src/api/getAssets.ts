import { config } from '../config/env';

// Define the Asset type
export interface Asset {
  id?: string;
  _id?: string;
  assetId?: string;
  rawKey?: string;
  name?: string;
  thumbnailKey?: string;
  tags: string[];
  type?: string;
  status?: string;
  variants?: {
    [key: string]: string | { key: string; contentType?: string };
  };
  createdAt?: string;
}

// Fetch function for assets
export const fetchAssets = async (): Promise<Asset[]> => {
  const res = await fetch(`${config.apiBaseUrl}/api/assets`);
  if (!res.ok) throw new Error('Failed to fetch assets');
  const data = await res.json();
  return data.assets;
};
