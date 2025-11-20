import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api';
import { Link } from 'react-router-dom';

const ConsumerReportsScreen = () => {
  const { data: reports, isLoading } = useQuery({
    queryKey: ['myReports'],
    queryFn: async () => (await api.get('/reports/my-reports')).data
  });

  if (isLoading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-4 pb-20">
      <header className="mb-8 mt-4">
        <div className="flex justify-between items-center">
            <h1 className="text-2xl font-extrabold text-slate-900">My Reports</h1>
            <Link to="/dashboard" className="text-sm font-semibold text-blue-600">Back</Link>
        </div>
        <p className="text-slate-500 text-sm mt-1">Track the status of your whistleblower submissions.</p>
      </header>

      <div className="space-y-4">
        {reports && reports.length > 0 ? (
          reports.map((report) => (
            <div key={report._id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-slate-900">{report.productName}</h3>
                  <p className="text-xs text-slate-400">{new Date(report.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    report.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' :
                    report.status === 'Investigating' ? 'bg-blue-100 text-blue-700' :
                    report.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                    'bg-amber-100 text-amber-700'
                }`}>
                  {report.status}
                </span>
              </div>
              
              <p className="text-sm text-slate-600 mb-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                "{report.description}"
              </p>

              {report.adminNotes && (
                <div className="mt-3 pl-3 border-l-2 border-blue-500">
                  <p className="text-xs text-slate-400 font-bold uppercase mb-1">Official Response</p>
                  <p className="text-sm text-slate-700">{report.adminNotes}</p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
            <span className="text-4xl block mb-4">📝</span>
            <h3 className="text-lg font-bold text-slate-900">No Reports Yet</h3>
            <p className="text-slate-500 text-sm mb-6">You haven't flagged any suspicious products.</p>
            <Link to="/report" className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20">
              Submit a Report
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsumerReportsScreen;
