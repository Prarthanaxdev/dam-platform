export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  apiTimeout: 10000,
  isDev: import.meta.env.DEV,
} as const;
