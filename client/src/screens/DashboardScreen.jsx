import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store';

const DashboardScreen = () => {
  const navigate = useNavigate();
  const { userInfo } = useAuthStore();

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    }
  }, [navigate, userInfo]);

  const renderRoleBasedContent = () => {
    // Debug line to show current role
    const debugInfo = (
      <div className="fixed top-4 left-4 bg-black text-white px-3 py-2 rounded-lg text-sm z-50 shadow-lg">
        Current Role: {userInfo?.role || 'none'}
      </div>
    );

    if (!userInfo?.role) {
      return (
        <>
          {debugInfo}
          <div className="text-center py-20">
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20 max-w-md mx-auto">
              <p className="text-lg text-gray-600 mb-4">Select an option from the menu</p>
              <p className="text-sm text-gray-500">Your account role determines available features</p>
            </div>
          </div>
        </>
      );
    }

    if (userInfo.role === 'patient') {
      return (
        <>
          {debugInfo}
          <section className="mb-12 bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-rose-900 mb-8 text-center">❤️ My Health Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              <div className="bg-white/90 backdrop-blur-sm shadow-xl p-8 rounded-2xl border border-rose-200 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 group">
                <div className="flex items-center mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center mr-4">
                    <span className="text-white text-3xl">💊</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Scan Product</h3>
                    <p className="text-rose-600 font-medium">Verify Product Safety</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-8 leading-relaxed">Scan your product barcode to verify authenticity, check interactions, and ensure it's safe for use.</p>
                <Link to="/verify-product">
                  <button className="w-full bg-gradient-to-r from-rose-600 to-pink-700 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300">
                    <span>Open Camera Scanner</span>
                    <svg className="ml-2 w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                  </button>
                </Link>
              </div>
              <div className="bg-white/90 backdrop-blur-sm shadow-xl p-8 rounded-2xl border border-rose-200 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 group">
                <div className="flex items-center mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl flex items-center justify-center mr-4">
                    <span className="text-white text-3xl">🚨</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Whistleblower Report</h3>
                    <p className="text-rose-600 font-medium">Report Suspected Counterfeits</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-8 leading-relaxed">Report counterfeit or dangerous products you've encountered to help protect public health and ensure safety.</p>
                <Link to="/report">
                  <button className="w-full bg-gradient-to-r from-red-600 to-orange-700 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300">
                    <span>File a Report</span>
                    <svg className="ml-2 w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                    </svg>
                  </button>
                </Link>
              </div>
            </div>
          </section>
        </>
      );
    }

    if (userInfo.role === 'nurse') {
      return (
        <>
          {debugInfo}
          <section className="mb-12 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-blue-900 mb-8 text-center">🏥 Patient Care Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white/90 backdrop-blur-sm shadow-xl p-8 rounded-2xl border border-blue-200 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 group">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                    <span className="text-white text-xl">📋</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Create New Tele-Diag Case</h3>
                </div>
                <p className="text-gray-600 mb-8 leading-relaxed">Start a new telemedicine consultation for a patient with comprehensive evaluation tools.</p>
                <button className="w-full bg-gradient-to-r from-blue-600 to-cyan-700 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300">
                  <span>Start New Case</span>
                  <svg className="ml-2 w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                  </svg>
                </button>
              </div>
              <div className="bg-white/90 backdrop-blur-sm shadow-xl p-8 rounded-2xl border border-blue-200 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 group">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-xl flex items-center justify-center mr-4">
                    <span className="text-white text-xl">📊</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">My Open Cases</h3>
                </div>
                <p className="text-gray-600 mb-8 leading-relaxed">View and manage your active patient cases with real-time updates and collaboration tools.</p>
                <button className="w-full bg-gradient-to-r from-cyan-600 to-teal-700 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300">
                  <span>View Active Cases</span>
                  <svg className="ml-2 w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                </button>
              </div>
            </div>
          </section>
        </>
      );
    }

    if (userInfo.role === 'specialist') {
      return (
        <>
          {debugInfo}
          <section className="mb-12 bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-purple-900 mb-8 text-center">🩺 Medical Analysis Hub</h2>
            <div className="grid grid-cols-1 gap-8 max-w-lg mx-auto">
              <div className="bg-white/90 backdrop-blur-sm shadow-xl p-8 rounded-2xl border border-purple-200 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 group">
                <div className="flex items-center mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center mr-4">
                    <span className="text-white text-2xl">🔍</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Find Open Cases</h3>
                    <p className="text-purple-600 font-medium">Medical Consultation Cases</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-8 leading-relaxed">Browse and take on available medical consultation cases from nurses and patients requiring specialist evaluation.</p>
                <button className="w-full bg-gradient-to-r from-purple-600 to-violet-700 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300">
                  <span>Browse Available Cases</span>
                  <svg className="ml-2 w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                </button>
              </div>
            </div>
          </section>
        </>
      );
    }

    if (userInfo.role === 'pharmacist' || userInfo.role === 'admin') {
      return (
        <>
          {debugInfo}
          <section className="mb-12 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-emerald-900 mb-8 text-center">⚗️ Supply Chain Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white/90 backdrop-blur-sm shadow-xl p-8 rounded-2xl border border-emerald-200 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 group">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mr-4">
                    <span className="text-white text-xl">✅</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Verify Product Batch</h3>
                </div>
                <p className="text-gray-600 mb-8 leading-relaxed">Check and validate product batch information, authenticity, and regulatory compliance to ensure safety.</p>
                <Link to="/verify-product">
                  <button className="w-full bg-gradient-to-r from-emerald-600 to-teal-700 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300">
                    <span>Scan & Verify</span>
                    <svg className="ml-2 w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </button>
                </Link>
              </div>
              <div className="bg-white/90 backdrop-blur-sm shadow-xl p-8 rounded-2xl border border-emerald-200 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 group">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center mr-4">
                    <span className="text-white text-xl">📦</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Register New Batch</h3>
                </div>
                <p className="text-gray-600 mb-8 leading-relaxed">Add new product batches to the verification system with complete traceability and compliance tracking.</p>
                <Link to="/register-batch">
                  <button className="w-full bg-gradient-to-r from-teal-600 to-cyan-700 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300">
                    <span>Add New Batch</span>
                    <svg className="ml-2 w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                    </svg>
                  </button>
                </Link>
              </div>
              <div className="bg-white/90 backdrop-blur-sm shadow-xl p-8 rounded-2xl border border-emerald-200 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 group">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4">
                    <span className="text-white text-xl">📤</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Upload Batch List</h3>
                </div>
                <p className="text-gray-600 mb-8 leading-relaxed">Bulk upload product batches via CSV or Excel file for efficient batch management.</p>
                <Link to="/bulk-upload">
                  <button className="w-full bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300">
                    <span>Upload Bulk</span>
                    <svg className="ml-2 w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                    </svg>
                  </button>
                </Link>
              </div>
              <div className="bg-white/90 backdrop-blur-sm shadow-xl p-8 rounded-2xl border border-emerald-200 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 group">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mr-4">
                    <span className="text-white text-xl">🚨</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Review Whistleblower Reports</h3>
                </div>
                <p className="text-gray-600 mb-8 leading-relaxed">Review and manage reports of suspected counterfeit products submitted by users to protect public safety.</p>
                <Link to="/admin/reports">
                  <button className="w-full bg-gradient-to-r from-orange-600 to-red-700 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300">
                    <span>View Reports</span>
                    <svg className="ml-2 w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                    </svg>
                  </button>
                </Link>
              </div>
            </div>
          </section>
        </>
      );
    }

    return (
      <>
        {debugInfo}
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">Select an option from the menu</p>
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-teal-500 to-blue-600 opacity-5"></div>
      <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-bounce"></div>
      <div className="absolute bottom-20 left-20 w-64 h-64 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-bounce animation-delay-2000"></div>

      <div className="relative z-10 px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium rounded-full mb-6 shadow-lg">
              <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
              Welcome to Verifi Dashboard
            </div>

            <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
              Welcome back,{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {userInfo?.firstName || 'User'}
              </span>
            </h1>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Manage your healthcare operations with comprehensive tools and real-time insights.
            </p>
          </div>

          {/* Role-based Content */}
          {renderRoleBasedContent()}
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;
