import React from 'react';
import { Link } from 'react-router-dom';

const ManufacturerPortalScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium rounded-full mb-6 shadow-lg">
            <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
            Manufacturer Portal
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
            Welcome to the{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Manufacturer Hub
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Manage your product batches, create new inventory, and track supply chain progress.
          </p>
        </div>

        {/* Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Batch Upload */}
          <div className="bg-white/90 backdrop-blur-sm shadow-xl p-8 rounded-2xl border border-white/20 text-center hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-6">
              <span className="text-white text-2xl">📤</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Bulk Upload</h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Upload multiple product batches at once via CSV or Excel file for efficient batch management.
            </p>
            <Link
              to="/bulk-upload"
              className="inline-block bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
            >
              Start Upload
            </Link>
          </div>

          {/* Product Creation */}
          <div className="bg-white/90 backdrop-blur-sm shadow-xl p-8 rounded-2xl border border-white/20 text-center hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-6">
              <span className="text-white text-2xl">➕</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Register Batch</h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Register a new product batch with complete traceability and compliance tracking.
            </p>
            <Link
              to="/register-batch"
              className="inline-block bg-gradient-to-r from-emerald-600 to-teal-700 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
            >
              Create Batch
            </Link>
          </div>

          {/* Supply Chain Timeline */}
          <div className="bg-white/90 backdrop-blur-sm shadow-xl p-8 rounded-2xl border border-white/20 text-center hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-6">
              <span className="text-white text-2xl">📈</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Timeline View</h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Track the supply chain progress and custody chain of your product batches.
            </p>
            <Link
              to="/manufacturer/timeline"
              className="inline-block bg-gradient-to-r from-orange-600 to-red-700 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
            >
              View Timeline
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManufacturerPortalScreen;
