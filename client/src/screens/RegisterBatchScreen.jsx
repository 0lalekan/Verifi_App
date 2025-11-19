import React, { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useUserProfile } from '../hooks/useUserProfile'; // Import this hook

const RegisterBatchScreen = () => {
  const navigate = useNavigate();
  
  // 1. Fetch Profile Data for Security Check
  const { data: userProfile, isLoading } = useUserProfile();

  const [formData, setFormData] = useState({
    batchNumber: '',
    productName: '',
    expiryDate: '',
    manufacturingDate: '',
    description: '',
  });

  // 2. ROUTE GUARD: This block kicks out unverified users
  useEffect(() => {
    if (!isLoading && userProfile) {
      // If user is NOT verified, send them back to the portal
      if (!userProfile.organizationDetails?.isVerified) {
        toast.error("Account verification required to access this page.");
        navigate('/manufacturer/portal');
      }
    }
  }, [userProfile, isLoading, navigate]);

  const mutation = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post('/api/products/', data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Batch registered successfully on the blockchain ledger.');
      navigate('/manufacturer/portal');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to register batch');
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  // If loading profile, show a blank or loading state to prevent "flash" of content
  if (isLoading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Checking permissions...</div>;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex justify-center">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-900 p-8 text-center">
          <h2 className="text-2xl font-bold text-white">New Batch Registration</h2>
          <p className="text-slate-400 text-sm mt-2">Generate secure digital identities for your products.</p>
        </div>
        
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Batch / Lot Number</label>
                <input
                  name="batchNumber"
                  type="text"
                  value={formData.batchNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  placeholder="e.g. BATCH-2024-001"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Product Name</label>
                <input
                  name="productName"
                  type="text"
                  value={formData.productName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  placeholder="e.g. Premium Widget"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Manufacturing Date</label>
                <input
                  name="manufacturingDate"
                  type="date"
                  value={formData.manufacturingDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Expiry Date</label>
                <input
                  name="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Product Metadata</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                placeholder="Add details (ingredients, origin, SKU)..."
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={mutation.isPending}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
              >
                {mutation.isPending ? 'Registering Securely...' : 'Secure & Register Batch'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterBatchScreen;