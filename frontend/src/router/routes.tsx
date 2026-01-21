import { createBrowserRouter } from 'react-router-dom';
import React, { Suspense } from 'react';
import Layout from '../components/Layout';
const Dashboard = React.lazy(() => import('../pages/Dashboard'));
const Assets = React.lazy(() => import('../pages/Assets'));
const Upload = React.lazy(() => import('../pages/Upload'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />, // layout with sidebar
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: 'assets',
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Assets />
          </Suspense>
        ),
      },
      {
        path: 'upload',
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Upload />
          </Suspense>
        ),
      },
    ],
  },
]);
