import React from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store';
import { useUserProfile } from '../hooks/useUserProfile';

const ActionCard = ({ icon, title, desc, link, linkText, color, disabled }) => (
  <div className={`group bg-white p-8 rounded-2xl shadow-sm border border-slate-200 transition-all duration-300 ${disabled ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-md hover:border-emerald-200'}`}>
    <div className={`w-14 h-14 ${color} rounded-xl flex items-center justify-center text-3xl mb-6 ${!disabled && 'group-hover:scale-110 transition-transform'}`}>
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
    <p className="text-slate-500 mb-8 leading-relaxed min-h-[80px]">
      {desc}
    </p>
    {disabled ? (
      <span className="inline-flex items-center font-semibold text-slate-400 cursor-not-allowed">
        🔒 Verification Required
      </span>
    ) : (
      <Link
        to={link}
        className="inline-flex items-center font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
      >
        {linkText}
        <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
      </Link>
    )}
  </div>
);

const ManufacturerPortalScreen = () => {
  const { userInfo } = useAuthStore();
  // We fetch the profile again to ensure we have the latest verification status
  const { data: userProfile } = useUserProfile();

  const isVerified = userProfile?.organizationDetails?.isVerified || false;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-200 text-slate-600 text-sm font-medium mb-6">
            <span className={`w-2 h-2 rounded-full ${isVerified ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
            {isVerified ? 'Secure Workspace Active' : 'Action Required'}
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
            Manufacturer Hub
          </h1>
          
          {!isVerified && (
            <div className="max-w-2xl mx-auto mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 text-left">
              <span className="text-2xl">⚠️</span>
              <div>
                <h3 className="font-bold text-amber-800">Verification Pending</h3>
                <p className="text-amber-700 text-sm mt-1">
                  Your organization details are currently under review. You cannot register new product batches until your business license is verified by a Regulator. 
                  <Link to="/profile" className="underline ml-1 font-semibold">Check Profile Status</Link>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <ActionCard
            icon="🛡️"
            color="bg-emerald-50 text-emerald-600"
            title="Register Batch"
            desc="Create a secure digital identity for a new product batch."
            link="/register-batch"
            linkText="Create Batch"
            disabled={!isVerified}
          />

          {/* Card 2: Upload */}
          <ActionCard
            icon="📤"
            color="bg-blue-50 text-blue-600"
            title="Bulk Upload"
            desc="Import large product datasets via CSV/Excel."
            link="/bulk-upload"
            linkText="Upload Data"
            disabled={!isVerified}
          />

          {/* Card 3: Inventory (NEW) */}
          <ActionCard
            icon="📦"
            color="bg-purple-50 text-purple-600"
            title="My Inventory"
            desc="Track registered batches, monitor scans, and download QR codes."
            link="/manufacturer/inventory"
            linkText="Manage Items"
            disabled={!isVerified}
          />

          {/* Card 4: Reports (NEW) */}
          <ActionCard
            icon="🚨"
            color="bg-red-50 text-red-600"
            title="Brand Alerts"
            desc="View whistleblower reports and incidents involving your brand."
            link="/manufacturer/reports"
            linkText="View Incidents"
            disabled={!isVerified}
          />
          
        </div>
      </div>
    </div>
  );
};

export default ManufacturerPortalScreen;