import React, { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { toast } from 'react-toastify';
import { useUserProfile } from '../hooks/useUserProfile';
import { PackagePlus, Calendar, FileText, ArrowLeft, Loader2 } from 'lucide-react';

const RegisterBatchScreen = () => {
  const navigate = useNavigate();
  const { data: userProfile, isLoading } = useUserProfile();

  const [formData, setFormData] = useState({
    batchNumber: '',
    productName: '',
    expiryDate: '',
    manufacturingDate: '',
    description: '',
  });

  useEffect(() => {
    if (!isLoading && userProfile && !userProfile.organizationDetails?.isVerified) {
      toast.error("Verification required.");
      navigate('/manufacturer/portal');
    }
  }, [userProfile, isLoading, navigate]);

  const mutation = useMutation({
    mutationFn: async (data) => (await api.post('/products', data)).data,
    onSuccess: () => {
      toast.success('Batch registered securely.');
      navigate('/manufacturer/portal');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Registration failed'),
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = (e) => { e.preventDefault(); mutation.mutate(formData); };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto pb-24 pt-6">
      
      <button 
        onClick={() => navigate(-1)} 
        className="mb-6 flex items-center text-muted-foreground hover:text-foreground transition-colors font-medium text-sm"
      >
        <ArrowLeft size={18} className="mr-2" /> Back to Portal
      </button>

      <div className="glass rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
        <div className="mb-8">
          <h2 className="text-3xl font-display font-bold text-foreground">Register New Batch</h2>
          <p className="text-muted-foreground mt-2">Generate a secure digital identity for your production run.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Batch / Lot Number</label>
              <input
                name="batchNumber"
                type="text"
                value={formData.batchNumber}
                onChange={handleChange}
                className="flex h-12 w-full rounded-xl border border-input bg-background/50 px-4 py-2 text-sm shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary placeholder:text-muted-foreground"
                placeholder="e.g. BATCH-2024-001"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Product Name</label>
              <input
                name="productName"
                type="text"
                value={formData.productName}
                onChange={handleChange}
                className="flex h-12 w-full rounded-xl border border-input bg-background/50 px-4 py-2 text-sm shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary placeholder:text-muted-foreground"
                placeholder="e.g. Premium Widget"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Calendar size={14} className="text-primary"/> Mfg Date
              </label>
              <input
                name="manufacturingDate"
                type="date"
                value={formData.manufacturingDate}
                onChange={handleChange}
                className="flex h-12 w-full rounded-xl border border-input bg-background/50 px-4 py-2 text-sm shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Calendar size={14} className="text-primary"/> Expiry Date
              </label>
              <input
                name="expiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={handleChange}
                className="flex h-12 w-full rounded-xl border border-input bg-background/50 px-4 py-2 text-sm shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <FileText size={14} className="text-primary"/> Metadata / Notes
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="flex w-full rounded-xl border border-input bg-background/50 p-4 text-sm shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-none placeholder:text-muted-foreground"
              placeholder="Optional: Add details like SKU, factory line, or ingredients..."
            />
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold text-lg shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
          >
            {mutation.isPending ? <Loader2 className="animate-spin" /> : <PackagePlus />}
            {mutation.isPending ? 'Registering...' : 'Secure & Register Batch'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterBatchScreen;