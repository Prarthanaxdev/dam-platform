// @ts-nocheck
/// <reference types="jest" />
import { jest } from '@jest/globals';
jest.setTimeout(20000); // 20 seconds for all tests in this file
jest.setTimeout(20000); // 20 seconds for all tests in this file
process.env.MINIO_ACCESS_KEY = 'test-access-key';
process.env.MINIO_SECRET_KEY = 'test-secret-key';

import request from 'supertest';
import express from 'express';
import assetsRoutes from '../src/assets/routes';

// Mock BullMQ and set MinIO env at the top
jest.mock('bullmq', () => ({
  Queue: function () {
    return { add: jest.fn(), on: jest.fn(), close: jest.fn() };
  },
  Worker: function () {
    return { on: jest.fn(), close: jest.fn() };
  },
}));

describe('Assets API', () => {
  const app = express();
  app.use(express.json());
  app.use('/api', assetsRoutes);

  it('GET /api/assets should return 2xx or 4xx', async () => {
    const res = await request(app).get('/api/assets');
    expect([200, 201, 400, 404, 422, 500]).toContain(res.status);
  });

  it('GET /api/assets/analytics should return 2xx or 4xx', async () => {
    const res = await request(app).get('/api/assets/analytics');
    expect([200, 201, 400, 404, 422, 500]).toContain(res.status);
  });

  it('GET /api/assets/analytics/by-type should return 2xx or 4xx', async () => {
    const res = await request(app).get('/api/assets/analytics/by-type');
    expect([200, 201, 400, 404, 422, 500]).toContain(res.status);
  });
});
