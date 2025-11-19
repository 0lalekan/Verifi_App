import React from 'react';
import { useUserProfile } from '../hooks/useUserProfile';
import useAuthStore from '../store';

const ProfileScreen = () => {
  const { userInfo } = useAuthStore();
  const { data: userProfile, isLoading } = useUserProfile();

  if (isLoading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        
        {/* ID Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 relative">
          {/* Header Background */}
          <div className="h-32 bg-slate-900 relative">
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          </div>

          {/* Avatar & Info */}
          <div className="px-8 pb-8 relative">
            <div className="relative -mt-12 mb-6 inline-block">
              <div className="w-24 h-24 bg-slate-100 rounded-2xl border-4 border-white shadow-md flex items-center justify-center text-4xl">
                {userInfo?.role === 'manufacturer' ? '🏭' : userInfo?.role === 'regulator' ? '👁️' : '👤'}
              </div>
              <div className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-500 border-4 border-white rounded-full"></div>
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">{userInfo?.firstName} {userInfo?.lastName}</h1>
              <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">{userInfo?.role || 'Member'}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-xs text-slate-400 uppercase font-bold mb-1">Impact Score</p>
                <p className="text-2xl font-bold text-emerald-600">{userProfile?.points || 0}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-xs text-slate-400 uppercase font-bold mb-1">Status</p>
                <p className="text-xl font-bold text-slate-700">Verified</p>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Menu */}
        <div className="mt-8 space-y-3">
          <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest ml-4">Account Settings</h3>
          
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors border-b border-slate-50">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">📩</span>
                <span className="font-medium text-slate-700">Edit Email</span>
              </div>
              <span className="text-slate-300">→</span>
            </button>
            <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors border-b border-slate-50">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">🔒</span>
                <span className="font-medium text-slate-700">Change Password</span>
              </div>
              <span className="text-slate-300">→</span>
            </button>
            <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">🔔</span>
                <span className="font-medium text-slate-700">Notifications</span>
              </div>
              <span className="text-slate-300">→</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfileScreen;