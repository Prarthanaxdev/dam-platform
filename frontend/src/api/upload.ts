import { config } from '../config/env';

// API call for uploading files
export async function uploadFiles(files: File[]) {
  const formData = new FormData();
  files.forEach((file) => formData.append("file", file));
  const res = await fetch(`${config.apiBaseUrl}/api/uploads`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Upload failed");
  return res.json();
}
