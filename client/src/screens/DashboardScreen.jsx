import React from 'react';
import { Link } from 'react-router-dom';
import { useUserProfile } from '../hooks/useUserProfile';
import useAuthStore from '../store';
import { useQuery } from '@tanstack/react-query';
import api from '../api';
import Skeleton from '../components/Skeleton'; // <--- IMPORT
import ErrorState from '../components/ErrorState'; // <--- IMPORT

const DashboardScreen = () => {
  const { userInfo } = useAuthStore();
  
  // Fetch Profile
  const { 
    data: userProfile, 
    isLoading: isProfileLoading, 
    error: profileError,
    refetch: refetchProfile 
  } = useUserProfile();

  // Fetch User History (Consumer only)
  const { 
    data: history, 
    isLoading: isHistoryLoading 
  } = useQuery({
    queryKey: ['userHistory'],
    queryFn: async () => (await api.get('/logs/my-history')).data,
    enabled: !!userInfo && userInfo.role === 'consumer'
  });

  // --- LOADING STATE (POLISHED) ---
  if (isProfileLoading) {
    return (
      <div className="min-h-screen bg-slate-50 pb-20">
        {/* Header Skeleton */}
        <div className="bg-slate-900 pt-12 pb-24 px-6 rounded-b-[3rem]">
           <div className="max-w-md mx-auto flex flex-col items-center">
              <Skeleton className="w-24 h-4 bg-slate-700 mb-4" />
              <Skeleton className="w-48 h-8 bg-slate-700 mb-6" />
              <Skeleton className="w-full h-24 bg-slate-800 rounded-2xl" />
           </div>
        </div>
        {/* Buttons Skeleton */}
        <div className="max-w-md mx-auto px-6 -mt-12 relative z-20">
           <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-32 bg-white border border-slate-100" />
              <Skeleton className="h-32 bg-white border border-slate-100" />
           </div>
        </div>
      </div>
    );
  }

  // --- ERROR STATE ---
  if (profileError) {
    return (
      <div className="min-h-screen bg-slate-50 pt-20">
         <ErrorState 
            title="Unable to load Dashboard" 
            message="We couldn't fetch your profile data." 
            onRetry={refetchProfile} 
         />
      </div>
    );
  }

  const isManufacturer = userInfo?.role === 'manufacturer';
  const isVerified = userProfile?.organizationDetails?.isVerified;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* ... (Keep the rest of your existing JSX exactly as it was) ... */}
      
      {/* Top Section */}
      <div className="bg-slate-900 text-white pt-12 pb-24 px-6 rounded-b-[3rem] shadow-2xl shadow-slate-900/20 relative overflow-hidden">
        {/* ... existing code ... */}
          <p className="text-slate-400 font-medium mb-2">Welcome back,</p>
          <h1 className="text-3xl font-bold mb-6">{userInfo?.firstName}</h1>
          
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl flex items-center justify-between">
             {/* ... existing logic ... */}
             {isManufacturer ? (
                <>
                 {/* ... existing manufacturer logic ... */}
                 <div className="text-left">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Org Status</p>
                    <p className={`text-xl font-extrabold ${isVerified ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {isVerified ? 'Verified ✅' : 'Pending ⏳'}
                    </p>
                 </div>
                 <div className={`h-12 w-12 rounded-full flex items-center justify-center text-2xl shadow-lg ${isVerified ? 'bg-emerald-500' : 'bg-amber-500'}`}>
                    {isVerified ? '🏭' : '🔒'}
                 </div>
                </>
             ) : (
                <>
                 {/* ... existing consumer logic ... */}
                 <div className="text-left">
                    <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-1">Trust Score</p>
                    <p className="text-4xl font-extrabold text-white">{userProfile?.points || 0}</p>
                 </div>
                 <div className="h-12 w-12 bg-emerald-500 rounded-full flex items-center justify-center text-2xl shadow-lg shadow-emerald-500/40">
                    🏆
                 </div>
                </>
             )}
          </div>
        {/* ... */}
      </div>

      {/* Main Actions - Keep existing code */}
      <div className="max-w-md mx-auto px-6 -mt-12 relative z-20">
        <div className="grid grid-cols-2 gap-4">
          {!isManufacturer && (
            <>
              <Link to="/verify-product" className="group bg-white p-6 rounded-2xl shadow-lg border border-slate-100 hover:border-emerald-200 transition-all active:scale-95">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform">📸</div>
                <h3 className="font-bold text-slate-900">Scan Product</h3>
              </Link>
              <Link to="/report" className="group bg-white p-6 rounded-2xl shadow-lg border border-slate-100 hover:border-red-200 transition-all active:scale-95">
                <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform">📢</div>
                <h3 className="font-bold text-slate-900">Report Fake</h3>
              </Link>
              <Link to="/consumer/reports" className="group bg-white p-6 rounded-2xl shadow-lg border border-slate-100 hover:border-blue-200 transition-all active:scale-95 col-span-2">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">📂</div>
                  <div className="text-left">
                     <h3 className="font-bold text-slate-900">My Reports</h3>
                     <p className="text-xs text-slate-500 mt-1">Track case status</p>
                  </div>
                </div>
              </Link>
            </>
          )}

          {isManufacturer && (
             <>
              <Link to="/manufacturer/portal" className="group bg-white p-6 rounded-2xl shadow-lg border border-slate-100 hover:border-purple-200 transition-all active:scale-95">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform">🏭</div>
                <h3 className="font-bold text-slate-900">Portal</h3>
              </Link>
              <Link to="/profile" className="group bg-white p-6 rounded-2xl shadow-lg border border-slate-100 hover:border-blue-200 transition-all active:scale-95">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform">⚙️</div>
                <h3 className="font-bold text-slate-900">Settings</h3>
              </Link>
             </>
          )}
        </div>
      </div>

      {/* Recent Activity (Consumer Only) */}
      {!isManufacturer && (
        <div className="max-w-md mx-auto px-6 mt-8">
          <h3 className="text-slate-800 font-bold mb-4 flex items-center justify-between">
            <span>Recent Scans</span>
            <span className="text-xs font-normal text-slate-500">Last 10 activities</span>
          </h3>
          
          <div className="space-y-3">
            {isHistoryLoading ? (
               // Skeleton List
               <>
                 <Skeleton className="h-16 w-full" />
                 <Skeleton className="h-16 w-full" />
                 <Skeleton className="h-16 w-full" />
               </>
            ) : history && history.length > 0 ? (
              history.map((log) => (
                <div key={log._id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
                   {/* ... existing history item JSX ... */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 ${
                    log.status === 'Valid' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {log.status === 'Valid' ? '🛡️' : '⚠️'}
                  </div>
                  <div className="flex-1 min-h-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">Batch: {log.productBatch}</p>
                    <p className="text-xs text-slate-500">{new Date(log.createdAt).toLocaleDateString()} • {log.status}</p>
                  </div>
                  {log.status === 'Valid' && (
                    <span className="text-xs font-bold text-emerald-600">+5 pts</span>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-400 text-sm">No scans yet. Start verifying!</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardScreen;