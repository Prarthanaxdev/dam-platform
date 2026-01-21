export const MINIO_PUBLIC_URL = import.meta.env.VITE_MINIO_PUBLIC_URL;
export const MINIO_BUCKET_NAME = import.meta.env.VITE_MINIO_BUCKET_NAME;

export function getThumbnailUrl(thumbnailKey?: string) {
  if (!thumbnailKey) return '';
  return `${MINIO_PUBLIC_URL}/${MINIO_BUCKET_NAME}/${encodeURIComponent(thumbnailKey)}`;
}

export function getFilename(rawKey?: string, assetId?: string) {
  if (!rawKey) return '';
  let name = rawKey.replace(/^raw[\\\/]uploads[\\\/]/, '');
  if (assetId && name.startsWith(assetId + '-')) {
    name = name.slice(assetId.length + 1);
  }
  return name;
}
