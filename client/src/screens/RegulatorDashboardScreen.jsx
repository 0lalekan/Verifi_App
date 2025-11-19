import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import FakeMapComponent from '../components/FakeMapComponent';
import { Link } from 'react-router-dom';

// Reusable Stat Card Component
const StatCard = ({ title, value, color }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
    <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">{title}</h3>
    <div className={`text-3xl font-extrabold ${color}`}>{value}</div>
  </div>
);

const RegulatorDashboardScreen = () => {
  const { data: logs, isLoading } = useQuery({
    queryKey: ['adminLogs'],
    queryFn: async () => (await axios.get('/api/logs')).data,
    refetchInterval: 30000 // Refresh every 30s for "Real-time" feel
  });

  // Calculate basic stats from logs
  const totalScans = logs ? logs.length : 0;
  const fakeScans = logs ? logs.filter(l => l.status === 'Fake').length : 0;
  const validScans = logs ? logs.filter(l => l.status === 'Valid').length : 0;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <header className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <span className="text-3xl">👁️</span>
          <h1 className="text-3xl font-bold text-slate-900">Oversight Dashboard</h1>
        </div>
        <p className="text-slate-500">Real-time surveillance of national supply chain integrity.</p>

        {/* NEW BUTTON */}
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

      {/* The Map Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-900">Geospatial Threat Map</h2>
          <div className="flex items-center space-x-2 text-sm text-slate-500">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <span>Live Feed</span>
          </div>
        </div>
        <div className="p-0">
          {isLoading ? (
            <div className="h-96 flex items-center justify-center text-slate-400">Loading satellite data...</div>
          ) : (
            <FakeMapComponent scanLogs={logs || []} />
          )}
        </div>
      </div>

      {/* Recent Alerts Table (Placeholder for "Whistleblower" reports) */}
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
              {/* Mock Data Row */}
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