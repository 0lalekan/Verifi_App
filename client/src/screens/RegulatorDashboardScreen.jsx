import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { motion } from 'framer-motion'; // Install: npm install framer-motion

// Reusable "Stat Card" with mature styling
const StatCard = ({ title, value, trend, trendUp }) => (
  <div className="govt-card p-6">
    <h3 className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{title}</h3>
    <div className="mt-2 flex items-baseline gap-2">
      <span className="text-3xl font-bold text-slate-900">{value}</span>
      {trend && (
        <span className={`text-sm font-medium ${trendUp ? 'text-verifi-success' : 'text-verifi-error'}`}>
          {trend}
        </span>
      )}
    </div>
  </div>
);

const RegulatorDashboardScreen = () => {
  const { data: logs } = useQuery({
    queryKey: ['verificationLogs'],
    queryFn: async () => (await axios.get('/api/logs')).data
  });

  const safeLogs = Array.isArray(logs) ? logs : (logs?.data || []);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      {/* Header Section */}
      <header className="mb-8">
        <h1 className="text-2xl text-govt-900">National Verification Oversight</h1>
        <p className="text-slate-500 mt-1">Real-time surveillance of consumable goods supply chain.</p>
      </header>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Scans (24h)" value={safeLogs.length} trend="+12%" trendUp={true} />
        <StatCard title="Flagged Anomalies" value="3" trend="+2%" trendUp={false} />
        <StatCard title="Active Regions" value="5" />
        <StatCard title="Compliance Rate" value="98.2%" trend="+0.4%" trendUp={true} />
      </div>

      {/* Main Content Area - Map Placeholder */}
      <div className="govt-card h-96 flex items-center justify-center bg-slate-100 border-dashed border-2 border-slate-300">
        <div className="text-center">
          <span className="text-4xl mb-2 block">🗺️</span>
          <p className="text-slate-500 font-medium">Geospatial Intelligence Map</p>
          <p className="text-slate-400 text-sm">Live feed of Lagos, Abuja, Port Harcourt...</p>
        </div>
      </div>
    </div>
  );
};

export default RegulatorDashboardScreen;
