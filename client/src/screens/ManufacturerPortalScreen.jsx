import React from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store';
import { useUserProfile } from '../hooks/useUserProfile';
import { 
  ShieldCheck, 
  Upload, 
  Package, 
  AlertTriangle, 
  ChevronRight, 
  Factory 
} from 'lucide-react';

const ManufacturerPortalScreen = () => {
  const { userInfo } = useAuthStore();
  const { data: userProfile } = useUserProfile();
  const isVerified = userProfile?.organizationDetails?.isVerified || false;

  return (
    <div className="max-w-5xl mx-auto pb-24 pt-2">
      
      {/* Greeting Section (Matches Dashboard) */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
            Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}, {userInfo?.firstName}.
          </h1>
          <p className="text-muted-foreground mt-1">Manage production and supply chain integrity.</p>
        </div>
        
        {/* Verification Badge */}
        <div className={`px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-wider flex items-center gap-2 shrink-0 ${
          isVerified 
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' 
            : 'bg-amber-500/10 border-amber-500/20 text-amber-600'
        }`}>
          <span className={`w-2 h-2 rounded-full ${isVerified ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
          {isVerified ? 'Workspace Verified' : 'Verification Pending'}
        </div>
      </div>

      {/* Bento Grid Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        
        {/* 1. Register Batch (Primary) */}
        <Link 
          to={isVerified ? "/register-batch" : "#"} 
          className={`glass-card p-6 flex flex-col justify-between group hover:ring-2 hover:ring-primary/50 transition-all relative overflow-hidden ${!isVerified && 'opacity-60 cursor-not-allowed'}`}
        >
          <div className="absolute -right-6 -top-6 bg-primary/10 w-32 h-32 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors" />
          
          <div className="flex justify-between items-start relative z-10">
            <div className="p-3 bg-primary/10 text-primary rounded-2xl">
              <ShieldCheck size={26} />
            </div>
            <div className="p-2 bg-background/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronRight size={16} />
            </div>
          </div>
          <div className="mt-8 relative z-10">
            <h3 className="text-xl font-bold text-foreground">Register Batch</h3>
            <p className="text-sm text-muted-foreground mt-1">Create digital identities for new products.</p>
          </div>
        </Link>

        {/* 2. Bulk Upload */}
        <Link 
          to={isVerified ? "/bulk-upload" : "#"}
          className={`glass-card p-6 flex flex-col justify-between group hover:ring-2 hover:ring-blue-500/50 transition-all ${!isVerified && 'opacity-60 cursor-not-allowed'}`}
        >
          <div className="flex justify-between items-start">
            <div className="p-3 bg-blue-500/10 text-blue-600 rounded-2xl">
              <Upload size={26} />
            </div>
            <div className="p-2 bg-background/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronRight size={16} />
            </div>
          </div>
          <div className="mt-8">
            <h3 className="text-xl font-bold text-foreground">Bulk Import</h3>
            <p className="text-sm text-muted-foreground mt-1">Upload CSV manifest for mass registration.</p>
          </div>
        </Link>

        {/* 3. Inventory Management */}
        <Link 
          to={isVerified ? "/manufacturer/inventory" : "#"}
          className={`glass-card p-6 flex flex-col justify-between group hover:ring-2 hover:ring-purple-500/50 transition-all ${!isVerified && 'opacity-60 cursor-not-allowed'}`}
        >
          <div className="flex justify-between items-start">
            <div className="p-3 bg-purple-500/10 text-purple-600 rounded-2xl">
              <Package size={26} />
            </div>
            <div className="p-2 bg-background/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronRight size={16} />
            </div>
          </div>
          <div className="mt-8">
            <h3 className="text-xl font-bold text-foreground">My Inventory</h3>
            <p className="text-sm text-muted-foreground mt-1">Manage active batches and print labels.</p>
          </div>
        </Link>
      </div>

      {/* Alerts / Status Section - Styled like Dashboard "Recent Activity" */}
      <div className="glass rounded-[2.5rem] p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <AlertTriangle size={20} className="text-muted-foreground" />
            Brand Alerts
          </h3>
          <Link to="/manufacturer/reports" className="text-sm font-bold text-primary hover:underline">
            View All
          </Link>
        </div>

        <div className="space-y-3">
          {/* Static Alert Item for visual consistency */}
          <div className="group flex items-center justify-between p-4 rounded-2xl bg-background/40 border border-border/50 hover:bg-background/80 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                <Factory size={22} />
              </div>
              <div>
                <p className="font-bold text-foreground">System Status</p>
                <p className="text-xs text-muted-foreground mt-0.5">Your manufacturing node is active.</p>
              </div>
            </div>
            <div className="px-3 py-1 rounded-lg text-xs font-bold bg-emerald-500/10 text-emerald-600">
              Online
            </div>
          </div>

          {!isVerified && (
            <div className="group flex items-center justify-between p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 hover:bg-amber-500/10 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <AlertTriangle size={22} />
                </div>
                <div>
                  <p className="font-bold text-foreground">Verification Required</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Please complete your profile to unlock features.</p>
                </div>
              </div>
              <Link to="/profile" className="px-3 py-1 rounded-lg text-xs font-bold bg-background border border-border hover:border-amber-500 transition-colors">
                Complete Profile
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManufacturerPortalScreen;