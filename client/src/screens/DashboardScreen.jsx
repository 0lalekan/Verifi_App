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
  MapPin,
  ArrowRight,
  Map,
} from 'lucide-react';

const DashboardScreen = () => {
  const { userInfo } = useAuthStore();
  
  const { 
    data: userProfile, 
    isLoading: isProfileLoading, 
    error: profileError,
    refetch: refetchProfile 
  } = useUserProfile();

  const { data: history, isLoading: isHistoryLoading } = useQuery({
    queryKey: ['userHistory'],
    queryFn: async () => (await api.get('/logs/my-history')).data,
    enabled: !!userInfo && userInfo.role === 'consumer'
  });

  if (isProfileLoading) {
    return (
      <div className="max-w-5xl mx-auto pt-6 space-y-6 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <Skeleton className="h-48 w-full rounded-[2.5rem]" />
           <Skeleton className="h-48 w-full rounded-[2.5rem]" />
           <Skeleton className="h-48 w-full rounded-[2.5rem]" />
        </div>
        <Skeleton className="h-64 w-full rounded-[2.5rem]" />
      </div>
    );
  }

  if (profileError) return <div className="pt-12"><ErrorState onRetry={refetchProfile} /></div>;

  const timeOfDay = new Date().getHours();
  const greeting = timeOfDay < 12 ? 'Morning' : timeOfDay < 18 ? 'Afternoon' : 'Evening';

  return (
    <div className="max-w-5xl mx-auto pb-24 pt-2">
      
      {/* Header */}
      <div className="mb-8 px-2">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
          Good {greeting}, {userInfo?.firstName}.
        </h1>
        <p className="text-muted-foreground mt-1">You are helping secure the supply chain.</p>
      </div>

      {/* Bento Grid Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        
        {/* 1. Trust Score Card */}
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
          <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/30 transition-colors" />
        </div>

        {/* 2. Scan Action (Primary) */}
        <Link 
          to="/verify-product" 
          className="glass-card p-6 flex flex-col justify-between group hover:ring-2 hover:ring-blue-500/50 transition-all relative overflow-hidden"
        >
          <div className="flex justify-between items-start relative z-10">
            <div className="p-3 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-2xl">
              <ScanLine size={26} />
            </div>
            <div className="p-2 bg-background/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronRight size={16} />
            </div>
          </div>
          <div className="mt-4 relative z-10">
            <h3 className="text-xl font-bold text-foreground">Scan Product</h3>
            <p className="text-sm text-muted-foreground mt-1">Verify authenticity instantly.</p>
          </div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-colors" />
        </Link>

        {/* 3. Report Action (Secondary) */}
        <Link 
          to="/report" 
          className="glass-card p-6 flex flex-col justify-between group hover:ring-2 hover:ring-destructive/50 transition-all relative overflow-hidden"
        >
          <div className="flex justify-between items-start relative z-10">
            <div className="p-3 bg-red-500/10 text-red-600 dark:text-red-400 rounded-2xl">
              <AlertTriangle size={26} />
            </div>
            <div className="p-2 bg-background/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronRight size={16} />
            </div>
          </div>
          <div className="mt-4 relative z-10">
            <h3 className="text-xl font-bold text-foreground">Report Issue</h3>
            <p className="text-sm text-muted-foreground mt-1">Flag suspicious items.</p>
          </div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-red-500/10 rounded-full blur-2xl group-hover:bg-red-500/20 transition-colors" />
        </Link>

        {/* 4. Safe Map Action (New) */}
        <Link 
          to="/consumer/map" 
          className="glass-card p-6 flex flex-col justify-between group hover:ring-2 hover:ring-emerald-500/50 transition-all relative overflow-hidden"
        >
          <div className="flex justify-between items-start relative z-10">
            <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl">
              <Map size={26} />
            </div>
            <div className="p-2 bg-background/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronRight size={16} />
            </div>
          </div>
          <div className="mt-4 relative z-10">
            <h3 className="text-xl font-bold text-foreground">Find Safe Stores</h3>
            <p className="text-sm text-muted-foreground mt-1">Locate verified retailers nearby.</p>
          </div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-colors" />
        </Link>
        
      </div>

      {/* Recent Activity Feed */}
      <div className="glass rounded-[2.5rem] p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold flex items-center gap-2 text-foreground">
            <History size={20} className="text-muted-foreground" />
            Recent Activity
          </h3>
          <Link to="/consumer/reports" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
            View Reports <ArrowRight size={12} />
          </Link>
        </div>

        <div className="space-y-3">
          {isHistoryLoading ? (
             [1,2,3].map(i => <Skeleton key={i} className="h-20 w-full rounded-2xl" />)
          ) : history && history.length > 0 ? (
            history.map((log) => (
              <div key={log._id} className="group flex items-center justify-between p-4 rounded-2xl bg-background/40 border border-border/50 hover:bg-background/80 transition-all">
                
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center ${
                    log.status === 'Valid' 
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                      : 'bg-red-500/10 text-red-600 dark:text-red-400'
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

                <div className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                    log.status === 'Valid' 
                      ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
                      : 'bg-red-500/10 text-red-600 border-red-500/20'
                }`}>
                  {log.status}
                </div>
              </div>
            ))
          ) : (
            <div className="py-16 text-center">
              <div className="w-16 h-16 bg-secondary/50 rounded-[2rem] flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                <ScanLine size={24} />
              </div>
              <h3 className="text-lg font-bold text-foreground">No scans yet</h3>
              <p className="text-muted-foreground text-sm mt-1 mb-6">Start verifying products to earn points!</p>
              <Link to="/verify-product" className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
                Scan Now
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;