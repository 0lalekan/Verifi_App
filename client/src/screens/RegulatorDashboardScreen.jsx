import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api';
import useAuthStore from '../store';
import FakeMapComponent from '../components/FakeMapComponent';
import { Link } from 'react-router-dom';
import { Activity, ShieldAlert, ShieldCheck, Map as MapIcon, ListChecks } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

// Styled specifically like the Dashboard Trust Score card
const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="glass-card p-6 flex flex-col justify-between relative overflow-hidden group">
    <div className="relative z-10">
      <div className="flex items-center gap-2 font-bold text-sm uppercase tracking-wider mb-2 text-muted-foreground">
        <Icon size={16} /> {title}
      </div>
      <div className="text-4xl font-display font-extrabold text-foreground">
        {value}
      </div>
    </div>
    <div className={`absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-20 ${colorClass}`} />
  </div>
);

const RegulatorDashboardScreen = () => {
  const { userInfo } = useAuthStore();
  const { data: logs, isLoading } = useQuery({
    queryKey: ['adminLogs'],
    queryFn: async () => (await api.get('/logs')).data,
    refetchInterval: 30000
  });

  // Chart Logic
  const chartData = useMemo(() => {
    if (!logs) return null;
    const dates = {};
    logs.forEach(log => {
      const date = new Date(log.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (!dates[date]) dates[date] = { valid: 0, fake: 0 };
      if (log.status === 'Valid') dates[date].valid++;
      else dates[date].fake++;
    });
    const labels = Object.keys(dates).reverse();
    return {
      labels,
      datasets: [
        {
          label: 'Authentic',
          data: labels.map(d => dates[d].valid),
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
          fill: true,
        },
        {
          label: 'Suspicious',
          data: labels.map(d => dates[d].fake),
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          tension: 0.4,
          fill: true,
        },
      ],
    };
  }, [logs]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { display: false } },
      x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 10 } } }
    }
  };

  const totalScans = logs?.length || 0;
  const fakeScans = logs?.filter(l => l.status === 'Fake').length || 0;
  const validScans = logs?.filter(l => l.status === 'Valid').length || 0;

  return (
    <div className="max-w-5xl mx-auto pb-24 pt-2">
      
      {/* Greeting Section (Matches Dashboard) */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
            Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}, {userInfo?.firstName}.
          </h1>
          <p className="text-muted-foreground mt-1">National supply chain surveillance.</p>
        </div>
        
        <Link 
          to="/regulator/verification-queue"
          className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2 shrink-0"
        >
          <ListChecks size={20} /> Compliance Queue
        </Link>
      </div>

      {/* Stats Bento */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <StatCard title="Total Scans" value={totalScans.toLocaleString()} icon={Activity} colorClass="bg-blue-500" />
        <StatCard title="Authentic" value={validScans.toLocaleString()} icon={ShieldCheck} colorClass="bg-emerald-500" />
        <StatCard title="Threats" value={fakeScans.toLocaleString()} icon={ShieldAlert} colorClass="bg-red-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Chart Card */}
        <div className="lg:col-span-2 glass rounded-[2.5rem] p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Verification Trends</h3>
            <div className="flex gap-2">
              <span className="flex items-center text-xs font-bold text-emerald-500 gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"/> Valid</span>
              <span className="flex items-center text-xs font-bold text-red-500 gap-1"><div className="w-2 h-2 rounded-full bg-red-500"/> Fake</span>
            </div>
          </div>
          <div className="h-64 w-full">
            {chartData ? <Line data={chartData} options={chartOptions} /> : <div className="h-full flex items-center justify-center text-muted-foreground">Collecting data...</div>}
          </div>
        </div>

        {/* Map Card */}
        <div className="glass rounded-[2.5rem] p-1 overflow-hidden flex flex-col relative">
          <div className="absolute top-6 left-6 z-10 bg-background/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-border/50 shadow-sm">
            <h3 className="font-bold text-xs flex items-center gap-2"><MapIcon size={14} /> Live Heatmap</h3>
          </div>
          <div className="flex-1 rounded-[2rem] overflow-hidden">
             <FakeMapComponent scanLogs={logs || []} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegulatorDashboardScreen;