import React from 'react';
import { Link } from 'react-router-dom';

const RegulatorPortalScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium rounded-full mb-6 shadow-lg">
            <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
            Regulator Portal
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
            Welcome to the{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Regulator Hub
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Access comprehensive data on product verifications, monitor supply chains, and review safety reports.
          </p>
        </div>

        {/* Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Map Dashboard */}
          <div className="bg-white/90 backdrop-blur-sm shadow-xl p-8 rounded-2xl border border-white/20 text-center hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-6">
              <span className="text-white text-2xl">🗺️</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Map Dashboard</h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              View interactive maps showing verification locations and supply chain tracing across the region.
            </p>
            <Link
              to="/regulator/dashboard"
              className="inline-block bg-gradient-to-r from-green-600 to-teal-700 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
            >
              Open Map
            </Link>
          </div>

          {/* Raw Log Data */}
          <div className="bg-white/90 backdrop-blur-sm shadow-xl p-8 rounded-2xl border border-white/20 text-center hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-6">
              <span className="text-white text-2xl">📊</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Raw Log Data</h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Access raw verification logs and data exports for detailed analysis and regulatory monitoring.
            </p>
            <Link
              to="/logs"
              className="inline-block bg-gradient-to-r from-blue-600 to-cyan-700 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
            >
              View Logs
            </Link>
          </div>

          {/* Whistleblower Queue */}
          <div className="bg-white/90 backdrop-blur-sm shadow-xl p-8 rounded-2xl border border-white/20 text-center hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-6">
              <span className="text-white text-2xl">🚨</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Whistleblower Queue</h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Review and manage reports of suspected counterfeit products submitted by whistleblowers.
            </p>
            <Link
              to="/reports"
              className="inline-block bg-gradient-to-r from-red-600 to-orange-700 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
            >
              View Reports
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegulatorPortalScreen;
