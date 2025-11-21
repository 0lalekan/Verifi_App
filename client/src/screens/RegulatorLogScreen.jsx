import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, ShieldAlert, ShieldCheck, MapPin, Smartphone } from 'lucide-react';
import Skeleton from '../components/Skeleton';

const RegulatorLogScreen = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // This endpoint already exists in your codebase (logRoutes.js)
  const { data: logs, isLoading } = useQuery({
    queryKey: ['regulatorLogs'],
    queryFn: async () => (await api.get('/logs')).data,
    refetchInterval: 15000 // Live updates every 15s
  });

  const filteredLogs = logs?.filter(log => 
    log.productBatch.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full bg-background bg-gradient-mesh dark:bg-gradient-mesh-dark p-4 md:p-8 transition-colors duration-500">
      <div className="max-w-7xl mx-auto pt-2 pb-20">
        
        <div className="mb-8">
          <button onClick={() => navigate('/regulator/dashboard')} className="mb-4 flex items-center text-muted-foreground hover:text-foreground transition-colors text-sm font-bold">
            <ArrowLeft size={16} className="mr-2" /> Dashboard
          </button>
          <h1 className="text-3xl font-display font-extrabold text-foreground">Audit Logs</h1>
          <p className="text-muted-foreground mt-1">Real-time stream of product verification events.</p>
        </div>

        {/* Search */}
        <div className="glass-card p-4 mb-6 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <input 
              type="text" 
              placeholder="Filter by Batch # or Status (e.g. 'Fake')..." 
              className="w-full bg-background/50 border border-input rounded-xl pl-11 pr-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Logs List */}
        <div className="space-y-3">
          {isLoading ? (
             [1,2,3].map(i => <Skeleton key={i} className="h-20 w-full rounded-2xl" />)
          ) : filteredLogs?.length > 0 ? (
            filteredLogs.map((log) => (
              <div key={log._id} className="glass-card p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-secondary/20 transition-colors group">
                
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center ${
                    log.status === 'Valid' 
                      ? 'bg-emerald-500/10 text-emerald-600' 
                      : 'bg-red-500/10 text-red-600 animate-pulse'
                  }`}>
                    {log.status === 'Valid' ? <ShieldCheck size={22} /> : <ShieldAlert size={22} />}
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{log.productBatch}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                      <span className="flex items-center gap-1"><MapPin size={10}/> {log.location?.latitude.toFixed(4)}, {log.location?.longitude.toFixed(4)}</span>
                      <span className="hidden md:flex items-center gap-1"><Smartphone size={10}/> {log.deviceInfo ? 'Mobile Device' : 'Unknown'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto border-t md:border-t-0 border-border/50 pt-3 md:pt-0">
                  <span className="text-xs font-mono text-muted-foreground">
                    {new Date(log.createdAt).toLocaleString()}
                  </span>
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold border uppercase tracking-wide ${
                    log.status === 'Valid' 
                      ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
                      : 'bg-red-500/10 text-red-600 border-red-500/20'
                  }`}>
                    {log.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-muted-foreground">No logs found matching your filter.</div>
          )}
        </div>

      </div>
    </div>
  );
};

export default RegulatorLogScreen;