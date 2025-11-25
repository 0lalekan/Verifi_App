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
  Factory,
  Ban,
  XCircle,
  Crown
} from 'lucide-react';

const ManufacturerPortalScreen = () => {
  const { userInfo } = useAuthStore();
  // Destructure error to catch Suspension (403)
  const { data: userProfile, error } = useUserProfile();

  const isVerified = userProfile?.organizationDetails?.isVerified || false;
  // Default to 'Pending' if undefined
  const licenseStatus = userProfile?.organizationDetails?.licenseStatus || 'Pending';

  // --- 1. SUSPENDED USER UI (Full Blocking) ---
  // If the user is suspended, the backend returns 403. We show this instead of the dashboard.
  if (error && error.response?.status === 403) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center animate-in zoom-in-95">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <Ban size={48} className="text-red-600" />
        </div>
        <h1 className="text-3xl font-display font-bold text-red-600 mb-2">Account Suspended</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Your access to the Verifi Network has been suspended by a regulator due to compliance violations.
        </p>
        <div className="mt-8 p-4 bg-secondary/50 rounded-xl border border-border max-w-sm mx-auto">
          <p className="text-xs font-bold text-foreground uppercase tracking-wider mb-1">Contact Support</p>
          <p className="text-sm text-muted-foreground">compliance@verifi.ng</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-24 pt-2">
      
      {/* Greeting Section */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
            Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}, {userInfo?.firstName}.
          </h1>
          <p className="text-muted-foreground mt-1">Manage production and supply chain integrity.</p>
        </div>
        
        {/* Badge based on Status */}
        <div className={`px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-wider flex items-center gap-2 shrink-0 ${
          isVerified 
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' 
            : licenseStatus === 'Revoked'
              ? 'bg-red-500/10 border-red-500/20 text-red-600'
              : 'bg-amber-500/10 border-amber-500/20 text-amber-600'
        }`}>
          <span className={`w-2 h-2 rounded-full ${
            isVerified ? 'bg-emerald-500 animate-pulse' 
            : licenseStatus === 'Revoked' ? 'bg-red-500'
            : 'bg-amber-500'
          }`} />
          {isVerified ? 'Workspace Verified' : licenseStatus === 'Revoked' ? 'License Revoked' : 'Verification Pending'}
        </div>
      </div>

      {/* Bento Grid Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {/* Actions are disabled if not verified */}
        <Link 
          to={isVerified ? "/register-batch" : "#"} 
          className={`glass-card p-6 flex flex-col justify-between group hover:ring-2 hover:ring-primary/50 transition-all relative overflow-hidden ${!isVerified && 'opacity-60 cursor-not-allowed'}`}
        >
          {/* ... (Icon logic remains same) ... */}
          <div className="flex justify-between items-start relative z-10">
            <div className="p-3 bg-primary/10 text-primary rounded-2xl"><ShieldCheck size={26} /></div>
            <div className="p-2 bg-background/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><ChevronRight size={16} /></div>
          </div>
          <div className="mt-8 relative z-10">
            <h3 className="text-xl font-bold text-foreground">Register Batch</h3>
            <p className="text-sm text-muted-foreground mt-1">Create digital identities for new products.</p>
          </div>
        </Link>

        <Link 
          to={isVerified ? "/bulk-upload" : "#"}
          className={`glass-card p-6 flex flex-col justify-between group hover:ring-2 hover:ring-blue-500/50 transition-all ${!isVerified && 'opacity-60 cursor-not-allowed'}`}
        >
          <div className="flex justify-between items-start">
            <div className="p-3 bg-blue-500/10 text-blue-600 rounded-2xl"><Upload size={26} /></div>
            <div className="p-2 bg-background/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><ChevronRight size={16} /></div>
          </div>
          <div className="mt-8">
            <h3 className="text-xl font-bold text-foreground">Bulk Import</h3>
            <p className="text-sm text-muted-foreground mt-1">Upload CSV manifest for mass registration.</p>
          </div>
        </Link>

        <Link 
          to={isVerified ? "/subscription" : "#"}
          className={`glass-card p-6 flex flex-col justify-between group hover:ring-2 hover:ring-amber-500/50 transition-all ${!isVerified && 'opacity-60 cursor-not-allowed'}`}
        >
          <div className="flex justify-between items-start">
            <div className="p-3 bg-amber-500/10 text-amber-600 rounded-2xl">
              <Crown size={26} />
            </div>
            <div className="p-2 bg-background/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronRight size={16} />
            </div>
          </div>
          <div className="mt-8">
            <h3 className="text-xl font-bold text-foreground">My Plan</h3>
            <p className="text-sm text-muted-foreground mt-1">
               Current: <span className="font-bold text-foreground">{userProfile?.organizationDetails?.plan || 'Starter'}</span>
            </p>
          </div>
        </Link>

        <Link 
          to={isVerified ? "/manufacturer/inventory" : "#"}
          className={`glass-card p-6 flex flex-col justify-between group hover:ring-2 hover:ring-purple-500/50 transition-all ${!isVerified && 'opacity-60 cursor-not-allowed'}`}
        >
          <div className="flex justify-between items-start">
            <div className="p-3 bg-purple-500/10 text-purple-600 rounded-2xl"><Package size={26} /></div>
            <div className="p-2 bg-background/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><ChevronRight size={16} /></div>
          </div>
          <div className="mt-8">
            <h3 className="text-xl font-bold text-foreground">My Inventory</h3>
            <p className="text-sm text-muted-foreground mt-1">Manage active batches and print labels.</p>
          </div>
        </Link>
      </div>

      {/* Alerts / Status Section */}
      <div className="glass rounded-[2.5rem] p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <AlertTriangle size={20} className="text-muted-foreground" />
            Brand Alerts
          </h3>
          <Link to="/manufacturer/reports" className="text-sm font-bold text-primary hover:underline">View All</Link>
        </div>

        <div className="space-y-3">
          <div className="group flex items-center justify-between p-4 rounded-2xl bg-background/40 border border-border/50 hover:bg-background/80 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center"><Factory size={22} /></div>
              <div>
                <p className="font-bold text-foreground">System Status</p>
                <p className="text-xs text-muted-foreground mt-0.5">Your manufacturing node is active.</p>
              </div>
            </div>
            <div className="px-3 py-1 rounded-lg text-xs font-bold bg-emerald-500/10 text-emerald-600">Online</div>
          </div>

          {/* --- 2. REVOKED LICENSE ALERT --- */}
          {licenseStatus === 'Revoked' && (
            <div className="group flex items-center justify-between p-4 rounded-2xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/15 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-600 flex items-center justify-center">
                  <XCircle size={22} />
                </div>
                <div>
                  <p className="font-bold text-red-600">License Revoked</p>
                  <p className="text-xs text-red-600/80 mt-0.5">Your operating license has been revoked. All products are flagged.</p>
                </div>
              </div>
              <a href="mailto:support@verifi.ng" className="px-3 py-1 rounded-lg text-xs font-bold bg-background border border-red-200 text-red-600 hover:bg-red-50 transition-colors">
                Appeal
              </a>
            </div>
          )}

          {/* --- 3. PENDING VERIFICATION ALERT --- */}
          {!isVerified && licenseStatus !== 'Revoked' && (
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