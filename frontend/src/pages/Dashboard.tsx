import { useQuery } from '@tanstack/react-query';
import { getAnalytics } from '../api/getAnalytics';
import { getAssetTypeBreakdown } from '../api/getAssetTypeBreakdown';
import { getAssetDateBreakdown } from '../api/getAssetDateBreakdown';
import type { AssetTypeBreakdown } from '../api/getAssetTypeBreakdown';
import type { AssetDateBreakdown } from '../api/getAssetDateBreakdown';
import type { AnalyticsData } from '../api/getAnalytics';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
);

export default function Dashboard() {
  const {
    data: typeBreakdown,
    isLoading: isTypeLoading,
    isError: isTypeError,
  } = useQuery<AssetTypeBreakdown>({
    queryKey: ['asset-type-breakdown'],
    queryFn: getAssetTypeBreakdown,
  });
  const {
    data: dateBreakdown,
    isLoading: isDateLoading,
    isError: isDateError,
  } = useQuery<AssetDateBreakdown>({
    queryKey: ['asset-date-breakdown'],
    queryFn: getAssetDateBreakdown,
  });
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
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-6">
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
          <div className="mb-12" style={{ marginLeft: '11px' }}>
            <h3 className="text-lg font-semibold mb-2">Asset Analytics</h3>
            <div className="flex flex-wrap gap-8">
              <div
                style={{
                  minWidth: 890,
                  maxWidth: 900,
                  background: '#fff',
                  borderRadius: 16,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  padding: 32,
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <svg
                    className="w-6 h-6 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 19V6M5 12l7-7 7 7" />
                  </svg>
                  <span className="font-semibold">Upload Trends</span>
                </div>
                <div className="text-gray-500 text-sm mb-2">Daily uploads over time</div>
                {isDateLoading && <div>Loading...</div>}
                {isDateError && <div className="text-red-500">Failed to load date breakdown.</div>}
                {dateBreakdown && (
                  <Line
                    data={{
                      labels: Object.keys(dateBreakdown),
                      datasets: [
                        {
                          label: '',
                          data: Object.values(dateBreakdown),
                          fill: true,
                          backgroundColor: 'rgba(59,130,246,0.10)',
                          borderColor: '#2563eb',
                          pointRadius: 0,
                          borderWidth: 2,
                          tension: 0.5,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { display: false },
                        title: { display: false },
                        tooltip: {
                          callbacks: {
                            label: function (context) {
                              return `Uploads: ${context.parsed.y}`;
                            },
                          },
                        },
                      },
                      scales: {
                        x: {
                          title: { display: false },
                          grid: { display: false },
                          ticks: { color: '#6b7280', font: { size: 12 } },
                        },
                        y: {
                          beginAtZero: true,
                          title: { display: false },
                          grid: { color: 'rgba(0,0,0,0.05)' },
                          ticks: { color: '#6b7280', font: { size: 12 } },
                        },
                      },
                    }}
                    height={250}
                  />
                )}
                <div className="mt-8">
                  <div className="font-medium mb-1">By Type</div>
                  {isTypeLoading && <div>Loading...</div>}
                  {isTypeError && (
                    <div className="text-red-500">Failed to load type breakdown.</div>
                  )}
                  {typeBreakdown && (
                    <ul>
                      {['image', 'video', 'document'].map((type) => (
                        <li key={type} className="text-sm">
                          <span className="font-semibold">{type}:</span> {typeBreakdown[type] ?? 0}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
