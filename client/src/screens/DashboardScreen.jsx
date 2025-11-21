import React from 'react';
import { Link } from 'react-router-dom';
import { useUserProfile } from '../hooks/useUserProfile';
import useAuthStore from '../store';
import { useQuery } from '@tanstack/react-query';
import api from '../api';
import Skeleton from '../components/Skeleton';
import ErrorState from '../components/ErrorState';
import { 
  ScanLine, 
  AlertTriangle, 
  History, 
  ShieldCheck, 
  ChevronRight, 
  Trophy,
  MapPin
} from 'lucide-react';

const DashboardScreen = () => {
  const { userInfo } = useAuthStore();
  
  const { 
    data: userProfile, 
    isLoading: isProfileLoading, 
    error: profileError,
    refetch: refetchProfile 
  } = useUserProfile();

  const { data: history } = useQuery({
    queryKey: ['userHistory'],
    queryFn: async () => (await api.get('/logs/my-history')).data,
    enabled: !!userInfo && userInfo.role === 'consumer'
  });

  // --- Loading State ---
  if (isProfileLoading) {
    return (
      <div className="max-w-5xl mx-auto pt-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <Skeleton className="h-48 w-full rounded-[2rem]" />
           <Skeleton className="h-48 w-full rounded-[2rem]" />
           <Skeleton className="h-48 w-full rounded-[2rem]" />
        </div>
        <Skeleton className="h-64 w-full rounded-[2rem]" />
      </div>
    );
  }

  if (profileError) return <div className="pt-12"><ErrorState onRetry={refetchProfile} /></div>;

  return (
    <div className="max-w-5xl mx-auto pb-24 pt-2">
      
      {/* Greeting Section */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
          Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}, {userInfo?.firstName}.
        </h1>
        <p className="text-muted-foreground mt-1">You are helping secure the supply chain.</p>
      </div>

      {/* BENTO GRID ACTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        
        {/* 1. Trust Score Card (Visual) */}
        <div className="glass-card p-6 flex flex-col justify-between relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider mb-2">
              <Trophy size={16} /> Trust Score
            </div>
            <div className="text-5xl font-display font-extrabold text-foreground">
              {userProfile?.points || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Points earned from verifications</p>
          </div>
          {/* Decorative Background */}
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/30 transition-colors" />
        </div>

        {/* 2. Scan Action (Primary) */}
        <Link to="/verify-product" className="glass-card p-6 flex flex-col justify-between group hover:ring-2 hover:ring-primary/50 transition-all">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-2xl">
              <ScanLine size={26} />
            </div>
            <div className="p-2 bg-background/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronRight size={16} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-xl font-bold text-foreground">Scan Product</h3>
            <p className="text-sm text-muted-foreground mt-1">Verify authenticity instantly.</p>
          </div>
        </Link>

        {/* 3. Report Action (Secondary) */}
        <Link to="/report" className="glass-card p-6 flex flex-col justify-between group hover:ring-2 hover:ring-destructive/50 transition-all">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-red-500/10 text-red-600 dark:text-red-400 rounded-2xl">
              <AlertTriangle size={26} />
            </div>
            <div className="p-2 bg-background/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronRight size={16} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-xl font-bold text-foreground">Report Issue</h3>
            <p className="text-sm text-muted-foreground mt-1">Flag suspicious items.</p>
          </div>
        </Link>
      </div>

      {/* Recent Activity Feed */}
      <div className="glass rounded-[2.5rem] p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <History size={20} className="text-muted-foreground" />
            Recent Activity
          </h3>
          <span className="text-xs font-medium px-3 py-1 rounded-full bg-secondary text-secondary-foreground">
            Last 10 Scans
          </span>
        </div>

        <div className="space-y-3">
          {history && history.length > 0 ? (
            history.map((log) => (
              <div key={log._id} className="group flex items-center justify-between p-4 rounded-2xl bg-background/40 border border-border/50 hover:bg-background/80 transition-all">
                
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center ${
                    log.status === 'Valid' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-red-500/10 text-red-600 dark:text-red-400'
                  }`}>
                    {log.status === 'Valid' ? <ShieldCheck size={22} /> : <AlertTriangle size={22} />}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-foreground truncate">{log.productBatch}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                      <span>{new Date(log.createdAt).toLocaleDateString()}</span>
                      {log.location && (
                        <span className="flex items-center gap-1">
                           <MapPin size={10} /> GPS
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className={`px-3 py-1 rounded-lg text-xs font-bold ${
                    log.status === 'Valid' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'
                }`}>
                  {log.status}
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                <ScanLine size={24} />
              </div>
              <p className="text-muted-foreground">No scans yet. Start verifying products!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;