import React from 'react';
import { Link } from 'react-router-dom';
import { useUserProfile } from '../hooks/useUserProfile';
import useAuthStore from '../store';

const DashboardScreen = () => {
  const { userInfo } = useAuthStore();
  const { data: userProfile, isLoading } = useUserProfile();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-slate-200 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Top Section - Identity & Points */}
      <div className="bg-slate-900 text-white pt-12 pb-24 px-6 rounded-b-[3rem] shadow-2xl shadow-slate-900/20 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        
        <div className="relative z-10 max-w-md mx-auto text-center">
          <p className="text-slate-400 font-medium mb-2">Welcome back,</p>
          <h1 className="text-3xl font-bold mb-8">{userInfo?.firstName}</h1>
          
          {/* Points Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl flex items-center justify-between">
            <div className="text-left">
              <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-1">Trust Score</p>
              <p className="text-4xl font-extrabold text-white">{userProfile?.points || 0}</p>
            </div>
            <div className="h-12 w-12 bg-emerald-500 rounded-full flex items-center justify-center text-2xl shadow-lg shadow-emerald-500/40">
              🏆
            </div>
          </div>
        </div>
      </div>

      {/* Main Actions - Floating Overlay */}
      <div className="max-w-md mx-auto px-6 -mt-12 relative z-20">
        <div className="grid grid-cols-2 gap-4">
          <Link to="/verify-product" className="group bg-white p-6 rounded-2xl shadow-lg border border-slate-100 hover:border-emerald-200 transition-all active:scale-95">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform">
              📸
            </div>
            <h3 className="font-bold text-slate-900">Scan Product</h3>
            <p className="text-xs text-slate-500 mt-1">Verify authenticity instantly</p>
          </Link>

          <Link to="/report" className="group bg-white p-6 rounded-2xl shadow-lg border border-slate-100 hover:border-red-200 transition-all active:scale-95">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform">
              📢
            </div>
            <h3 className="font-bold text-slate-900">Report Fake</h3>
            <p className="text-xs text-slate-500 mt-1">Flag suspicious items</p>
          </Link>
        </div>
      </div>

      {/* Recent Activity / Impact */}
      <div className="max-w-md mx-auto px-6 mt-8">
        <h3 className="text-slate-800 font-bold mb-4">Your Impact</h3>
        <div className="space-y-3">
          {/* Placeholder Activity Items - In a real app, map these from an API */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-lg">🛡️</div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Protected the Community</p>
              <p className="text-xs text-slate-500">You helped verify 0 products</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-lg">📍</div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Active Region</p>
              <p className="text-xs text-slate-500">Contributing to safety in Nigeria</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;