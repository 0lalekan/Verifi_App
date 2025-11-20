import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api';
import { Link } from 'react-router-dom';

const ManufacturerReportsScreen = () => {
  const { data: reports, isLoading } = useQuery({
    queryKey: ['manufacturerReports'],
    queryFn: async () => (await api.get('/reports/manufacturer-reports')).data
  });

  if (isLoading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
             <h1 className="text-3xl font-extrabold text-slate-900">Brand Intelligence</h1>
             <p className="text-slate-500 mt-1">Reports from consumers regarding your products.</p>
          </div>
          <Link to="/manufacturer/portal" className="text-blue-600 font-semibold hover:underline">Back to Portal</Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
           {reports && reports.length > 0 ? (
             <div className="overflow-x-auto">
               <table className="min-w-full divide-y divide-slate-100">
                 <thead className="bg-slate-50">
                   <tr>
                     <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Product</th>
                     <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Issue Reported</th>
                     <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Location</th>
                     <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Evidence</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                   {reports.map((report) => (
                     <tr key={report._id}>
                       <td className="px-6 py-4">
                         <div className="font-bold text-slate-900">{report.productName}</div>
                         <div className="text-xs text-slate-400">Batch: {report.batchNumber || 'Unknown'}</div>
                       </td>
                       <td className="px-6 py-4">
                         <p className="text-sm text-slate-600 max-w-xs truncate">{report.description}</p>
                         <span className="text-xs text-slate-400">{new Date(report.createdAt).toLocaleDateString()}</span>
                       </td>
                       <td className="px-6 py-4 text-sm text-slate-600">
                         {report.location}
                       </td>
                       <td className="px-6 py-4 text-sm">
                         {report.evidenceImage ? (
                           <a href={report.evidenceImage} target="_blank" rel="noreferrer" className="text-blue-600 underline">View Image</a>
                         ) : <span className="text-slate-400">None</span>}
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           ) : (
             <div className="p-12 text-center text-slate-500">
               No reports found matching your inventory. Your brand is safe! 🛡️
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default ManufacturerReportsScreen;
