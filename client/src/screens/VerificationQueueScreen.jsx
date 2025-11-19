import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const VerificationQueueScreen = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Fetch pending users
  const { data: pendingUsers, isLoading } = useQuery({
    queryKey: ['pendingVerifications'],
    queryFn: async () => (await axios.get('/api/users/pending-verifications')).data
  });

  // Approve Mutation
  const mutation = useMutation({
    mutationFn: async (userId) => await axios.put(`/api/users/verify/${userId}`),
    onSuccess: () => {
      toast.success('Manufacturer verified successfully');
      queryClient.invalidateQueries(['pendingVerifications']);
    },
    onError: () => toast.error('Failed to verify user')
  });

  if (isLoading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading Queue...</div>;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Compliance Queue</h1>
            <p className="text-slate-500 mt-1">Review and approve manufacturer license applications.</p>
          </div>
          <button 
            onClick={() => navigate('/regulator/dashboard')}
            className="px-4 py-2 bg-white border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Empty State */}
        {pendingUsers?.length === 0 && (
          <div className="bg-white p-12 rounded-3xl shadow-sm border border-slate-200 text-center">
            <div className="text-4xl mb-4">✅</div>
            <h3 className="text-xl font-bold text-slate-900">All Caught Up!</h3>
            <p className="text-slate-500">There are no pending verification requests at this time.</p>
          </div>
        )}

        {/* List */}
        <div className="grid gap-6">
          {pendingUsers?.map((user) => (
            <div key={user._id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow">
              {/* Avatar / Icon */}
              <div className="w-16 h-16 bg-purple-50 rounded-xl flex items-center justify-center text-2xl shrink-0">
                🏭
              </div>

              {/* Details */}
              <div className="flex-1 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{user.organizationDetails?.orgName || 'Unnamed Org'}</h3>
                    <p className="text-sm text-slate-500">{user.firstName} {user.lastName} • {user.email}</p>
                  </div>
                  <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold uppercase tracking-wide">
                    Pending
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm">
                  <div>
                    <span className="block text-slate-400 text-xs uppercase font-bold">License Number</span>
                    <span className="font-mono text-slate-700">{user.organizationDetails?.orgLicense || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="block text-slate-400 text-xs uppercase font-bold">Address</span>
                    <span className="text-slate-700">{user.organizationDetails?.orgAddress || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex md:flex-col justify-end gap-3 shrink-0">
                <button 
                  onClick={() => mutation.mutate(user._id)}
                  className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/20"
                >
                  Approve
                </button>
                <button className="px-6 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors">
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default VerificationQueueScreen;