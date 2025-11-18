import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const AdminReportsScreen = () => {
  const { data: reports, isLoading, error } = useQuery({
    queryKey: ['allReports'],
    queryFn: async () => {
      const response = await axios.get('/api/reports');
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading reports...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600 text-lg">Error loading reports: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-12">Whistleblower Report Review Queue</h1>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8">
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reporter</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reports && reports.map((report) => (
                  <tr key={report._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report._id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.productName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-xs truncate">{report.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        report.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        report.status === 'Investigating' ? 'bg-blue-100 text-blue-800' :
                        report.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {report.reporter ? `${report.reporter.name || report.reporter.email || 'Unknown'}` : 'Anonymous'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50">
                        Review/Change Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {(!reports || reports.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              No reports available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminReportsScreen;
