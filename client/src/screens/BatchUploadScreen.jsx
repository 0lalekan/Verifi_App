import React, { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import api from '../api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useUserProfile } from '../hooks/useUserProfile';

const BatchUploadScreen = () => {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  
  // 1. Fetch Profile Data
  const { data: userProfile, isLoading } = useUserProfile();

  // 2. Route Guard: Redirect if unverified
  useEffect(() => {
    if (!isLoading && userProfile) {
      if (!userProfile.organizationDetails?.isVerified) {
        toast.error("Account verification required.");
        navigate('/manufacturer/portal');
      }
    }
  }, [userProfile, isLoading, navigate]);

  const downloadTemplate = () => {
    const template = 'batchNumber,productName,expiryDate,ManufacturingDate,Description\n';
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Verifi_Template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const mutation = useMutation({
    mutationFn: async (formData) => {
      const response = await api.post('/products/bulk-upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(`Success! Processed ${data.count} records.`);
      setFile(null);
    },
    onError: () => toast.error('Upload failed. Please check your CSV format.'),
  });

  const handleUpload = (e) => {
    e.preventDefault();
    if (!file) return toast.error('Please select a CSV file');
    const formData = new FormData();
    formData.append('batchFile', file);
    mutation.mutate(formData);
  };

  // Loading state to prevent UI flash before redirect
  if (isLoading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Checking permissions...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 flex items-center justify-center">
      <div className="max-w-lg w-full bg-white p-8 rounded-2xl shadow-lg border border-slate-200">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
            📤
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Bulk Inventory Import</h1>
          <p className="text-slate-500 mt-2">Upload your manifest to register multiple batches instantly.</p>
        </div>

        <form onSubmit={handleUpload} className="space-y-6">
          
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer relative">
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setFile(e.target.files[0])}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="space-y-2">
              <span className="text-4xl">📄</span>
              <p className="text-sm font-medium text-slate-900">
                {file ? file.name : 'Click to browse or drag CSV here'}
              </p>
              <p className="text-xs text-slate-400">Supported format: .CSV</p>
            </div>
          </div>

          <div className="flex gap-4">
             <button
              type="button"
              onClick={downloadTemplate}
              className="flex-1 py-3 px-4 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors"
            >
              Download Template
            </button>
            <button
              type="submit"
              disabled={mutation.isPending || !file}
              className="flex-1 py-3 px-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-lg shadow-blue-500/20"
            >
              {mutation.isPending ? 'Processing...' : 'Start Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BatchUploadScreen;
