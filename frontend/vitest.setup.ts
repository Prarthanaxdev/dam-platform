// Setup file for Vitest (polyfills, global mocks)
import '@testing-library/jest-dom';

// Polyfill for TextEncoder/TextDecoder in jsdom (only if missing)
import { TextEncoder, TextDecoder } from 'util';

if (typeof globalThis.TextEncoder === 'undefined') {
  globalThis.TextEncoder = TextEncoder as unknown as typeof globalThis.TextEncoder;
}
if (typeof globalThis.TextDecoder === 'undefined') {
  globalThis.TextDecoder = TextDecoder as unknown as typeof globalThis.TextDecoder;
}

// Mock Vite env variables for import.meta.env (TypeScript safe)
if (!('env' in import.meta)) {
  Object.defineProperty(import.meta, 'env', {
    value: {
      VITE_MINIO_PUBLIC_URL: 'http://localhost:9000',
      VITE_MINIO_BUCKET_NAME: 'test-bucket',
    },
    writable: false,
    configurable: true,
    enumerable: true,
  });
}
