import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api';
import FakeMapComponent from '../components/FakeMapComponent';
import { Link } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const StatCard = ({ title, value, color }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
    <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">{title}</h3>
    <div className={`text-3xl font-extrabold ${color}`}>{value}</div>
  </div>
);

const RegulatorDashboardScreen = () => {
  const { data: logs, isLoading } = useQuery({
    queryKey: ['adminLogs'],
    queryFn: async () => (await api.get('/logs')).data,
    refetchInterval: 30000
  });

  // Process Data for Charts
  const chartData = useMemo(() => {
    if (!logs) return null;

    // Group by Date (Last 7 days usually, here simple grouping)
    const dates = {};
    logs.forEach(log => {
      const date = new Date(log.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (!dates[date]) dates[date] = { valid: 0, fake: 0 };
      if (log.status === 'Valid') dates[date].valid++;
      else dates[date].fake++;
    });

    const labels = Object.keys(dates).reverse(); // Assuming simple sort for now
    const validData = labels.map(d => dates[d].valid);
    const fakeData = labels.map(d => dates[d].fake);

    return {
      labels,
      datasets: [
        {
          label: 'Authentic Scans',
          data: validData,
          borderColor: '#059669', // Emerald 600
          backgroundColor: 'rgba(5, 150, 105, 0.1)',
          tension: 0.4,
          fill: true,
        },
        {
          label: 'Suspicious Alerts',
          data: fakeData,
          borderColor: '#DC2626', // Red 600
          backgroundColor: 'rgba(220, 38, 38, 0.1)',
          tension: 0.4,
          fill: true,
        },
      ],
    };
  }, [logs]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
    },
    scales: {
      y: { beginAtZero: true, grid: { color: '#f1f5f9' } },
      x: { grid: { display: false } }
    }
  };

  // Stats
  const totalScans = logs ? logs.length : 0;
  const fakeScans = logs ? logs.filter(l => l.status === 'Fake').length : 0;
  const validScans = logs ? logs.filter(l => l.status === 'Valid').length : 0;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <header className="mb-8 flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <span className="text-3xl">👁️</span>
            <h1 className="text-3xl font-bold text-slate-900">Oversight Dashboard</h1>
          </div>
          <p className="text-slate-500">Real-time surveillance of national supply chain integrity.</p>
        </div>
        
        <Link 
          to="/regulator/verification-queue"
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg shadow-purple-500/20 transition-all flex items-center gap-2"
        >
          <span>📋</span> Review Applications
        </Link>
      </header>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Verification Scans" value={totalScans.toLocaleString()} color="text-blue-600" />
        <StatCard title="Valid Authentications" value={validScans.toLocaleString()} color="text-emerald-600" />
        <StatCard title="Flagged Anomalies (Fakes)" value={fakeScans.toLocaleString()} color="text-red-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        
        {/* Analytics Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-slate-800 font-bold mb-4">Verification Trends (Activity)</h3>
          <div className="h-64">
            {chartData ? <Line data={chartData} options={chartOptions} /> : <div className="h-full flex items-center justify-center text-slate-400">Collecting data...</div>}
          </div>
        </div>

        {/* Map Section (Smaller now) */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-900">Threat Heatmap</h3>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          </div>
          <div className="flex-1 min-h-[250px]">
             <FakeMapComponent scanLogs={logs || []} />
          </div>
        </div>
      </div>

      {/* Recent Alerts Table */}
      <div className="mt-8">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Recent Whistleblower Reports</h2>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Product</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Location</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Issue</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {/* Mock Data for UI - Replace with real data fetch if needed */}
              <tr>
                <td className="p-4 font-medium text-slate-900">Amoxicillin 500mg</td>
                <td className="p-4 text-slate-600">Lagos, Ikeja</td>
                <td className="p-4 text-red-600">Broken Seal / Wrong Color</td>
                <td className="p-4"><span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">Investigating</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RegulatorDashboardScreen;
