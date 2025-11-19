import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminReportsScreen = () => {
  const queryClient = useQueryClient();

  const { data: reports, isLoading, error } = useQuery({
    queryKey: ['allReports'],
    queryFn: async () => {
      const response = await axios.get('/api/reports');
      return response.data;
    },
  });

  const mutation = useMutation({
    mutationFn: async ({ id, status }) => {
      await axios.put(`/api/reports/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['allReports']);
      toast.success('Report status updated');
    },
    onError: () => toast.error('Failed to update status'),
  });

  const handleStatusChange = (id, newStatus) => {
    if (window.confirm(`Mark this report as ${newStatus}?`)) {
      mutation.mutate({ id, status: newStatus });
    }
  };

  if (isLoading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading cases...</div>;
  if (error) return <div className="text-red-600 text-center mt-10">Error: {error.message}</div>;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Case Management</h1>
            <p className="text-slate-500 mt-1">Review and triage whistleblower reports.</p>
          </div>
          <div className="text-sm font-bold text-slate-600 bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200">
            Total Cases: {reports?.length || 0}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Issue</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Evidence</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {reports && reports.map((report) => (
                  <tr key={report._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-slate-900">{report.productName}</div>
                      <div className="text-xs text-slate-500">Batch: {report.batchNumber || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-600 max-w-xs truncate" title={report.description}>
                        {report.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {report.location.length > 20 ? 'Pinned GPS' : report.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {report.evidenceImage ? (
                        <a 
                          href={`http://localhost:5000${report.evidenceImage}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 font-medium underline"
                        >
                          View Photo
                        </a>
                      ) : (
                        <span className="text-slate-400">No Image</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${report.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                          report.status === 'Investigating' ? 'bg-blue-100 text-blue-800' : 
                          report.status === 'Resolved' ? 'bg-green-100 text-green-800' : 
                          'bg-red-100 text-red-800'}`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      <select
                        value={report.status}
                        onChange={(e) => handleStatusChange(report._id, e.target.value)}
                        className="block w-full pl-3 pr-8 py-2 text-sm border-slate-200 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Investigating">Investigate</option>
                        <option value="Resolved">Resolve</option>
                        <option value="Rejected">Reject</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {(!reports || reports.length === 0) && (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">🎉</div>
              <p className="text-slate-500 font-medium">No active reports pending review.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminReportsScreen;