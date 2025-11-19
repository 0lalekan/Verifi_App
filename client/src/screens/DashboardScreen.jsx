import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store';
import { useUserProfile } from '../hooks/useUserProfile';

const DashboardScreen = () => {
  const navigate = useNavigate();
  const { userInfo } = useAuthStore();
  const { data: userProfile, isLoading } = useUserProfile({ enabled: !!userInfo });

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    }
  }, [navigate, userInfo]);

  if (!userInfo) return null;

  const renderRoleBasedDashboard = () => {
    switch (userInfo.role) {
      case 'consumer':
        return (
          <div>
            <h1 className="text-3xl font-bold text-center mb-8">Welcome to Verifi, {userInfo.firstName}!</h1>
            <div className="grid md:grid-cols-2 gap-6">
              <Link to="/verify-product" className="bg-blue-500 hover:bg-blue-600 text-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-2">🔍 Verify Product</h2>
                <p>Check the authenticity of your products</p>
              </Link>
              <Link to="/report" className="bg-red-500 hover:bg-red-600 text-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-2">📢 Report Issue</h2>
                <p>Report suspicious or fake products</p>
              </Link>
              <div className="bg-green-500 text-white p-6 rounded-lg shadow-md col-span-2">
                <h2 className="text-xl font-semibold mb-2">🏆 Your Score</h2>
                <p className="text-2xl">{userProfile?.points || 0} points</p>
                <p className="text-sm">Keep verifying to earn more!</p>
              </div>
            </div>
          </div>
        );
      case 'manufacturer':
        return (
          <div>
            <h1 className="text-3xl font-bold text-center mb-8">Manufacturer Dashboard, {userInfo.firstName}!</h1>
            <div className="grid md:grid-cols-3 gap-6">
              <Link to="/register-batch" className="bg-green-500 hover:bg-green-600 text-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-2">📦 Register Batch</h2>
                <p>Register a new product batch</p>
              </Link>
              <Link to="/bulk-upload" className="bg-blue-500 hover:bg-blue-600 text-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-2">📤 Bulk Upload</h2>
                <p>Upload multiple batches at once</p>
              </Link>
              <Link to="/manufacturer/portal" className="bg-purple-500 hover:bg-purple-600 text-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-2">🏭 Portal</h2>
                <p>Manage your products and batches</p>
              </Link>
            </div>
          </div>
        );
      case 'regulator':
        return (
          <div>
            <h1 className="text-3xl font-bold text-center mb-8">Regulator Dashboard, {userInfo.firstName}!</h1>
            <div className="grid md:grid-cols-2 gap-6">
              <Link to="/regulator/dashboard" className="bg-blue-500 hover:bg-blue-600 text-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-2">📊 Dashboard</h2>
                <p>View reports and analytics</p>
              </Link>
              <Link to="/regulator-map" className="bg-green-500 hover:bg-green-600 text-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-2">🗺️ Map View</h2>
                <p>See geographic distribution of products</p>
              </Link>
            </div>
          </div>
        );
      case 'admin':
      default:
        return (
          <div>
            <h1 className="text-3xl font-bold text-center mb-8">Admin Dashboard, {userInfo.firstName}!</h1>
            <div className="grid md:grid-cols-2 gap-6">
              <Link to="/admin-dashboard" className="bg-red-500 hover:bg-red-600 text-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-2">⚙️ Admin Panel</h2>
                <p>Manage users and system settings</p>
              </Link>
              <Link to="/admin/reports" className="bg-yellow-500 hover:bg-yellow-600 text-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-2">📈 Reports</h2>
                <p>View admin reports</p>
              </Link>
            </div>
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20 max-w-md mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading...</h2>
            <p className="text-sm text-gray-600">Fetching your profile information.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {renderRoleBasedDashboard()}
      </div>
    </div>
  );
};

export default DashboardScreen;
