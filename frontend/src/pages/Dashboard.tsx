import { useQuery } from '@tanstack/react-query';
import { getAnalytics } from '../api/getAnalytics';
import type { AnalyticsData } from '../api/getAnalytics';

export default function Dashboard() {
  const { data, isLoading, error } = useQuery<AnalyticsData>({
    queryKey: ['analytics'],
    queryFn: getAnalytics,
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-gray-500 mb-8">Overview of your digital asset library</p>
      {isLoading ? (
        <div className="text-center text-gray-400">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500">{(error as Error).message}</div>
      ) : data ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {/* Total Assets */}
          <div className="bg-white rounded-xl shadow p-6 flex items-center justify-between">
            <div>
              <div className="text-gray-500 text-sm">Total Assets</div>
              <div className="text-3xl font-bold">{data.totalAssets}</div>
            </div>
            <div className="bg-gray-100 rounded-full p-3">
              <svg
                className="w-8 h-8 text-blue-500"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="12" cy="12" r="4" />
              </svg>
            </div>
          </div>
          {/* Uploads */}
          <div className="bg-white rounded-xl shadow p-6 flex items-center justify-between">
            <div>
              <div className="text-gray-500 text-sm">Uploads</div>
              <div className="text-3xl font-bold">{data.totalUploads}</div>
            </div>
            <div className="bg-gray-100 rounded-full p-3">
              <svg
                className="w-8 h-8 text-green-500"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path d="M12 19V6M5 12l7-7 7 7" />
              </svg>
            </div>
          </div>
          {/* Downloads */}
          <div className="bg-white rounded-xl shadow p-6 flex items-center justify-between">
            <div>
              <div className="text-gray-500 text-sm">Downloads</div>
              <div className="text-3xl font-bold">{data.totalDownloads}</div>
            </div>
            <div className="bg-gray-100 rounded-full p-3">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path d="M12 5v13M19 12l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
