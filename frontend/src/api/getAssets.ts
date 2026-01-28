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
  downloadCount?: number;
}

// Paginated response type
export interface PaginatedAssets {
  assets: Asset[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Fetch function for paginated assets
export const fetchAssets = async (page = 1, limit = 20): Promise<PaginatedAssets> => {
  const res = await fetch(`${config.apiBaseUrl}/api/assets?page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error('Failed to fetch assets');
  return res.json();
};
