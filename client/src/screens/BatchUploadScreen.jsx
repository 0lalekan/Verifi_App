import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-toastify';

const BatchUploadScreen = () => {
  const [file, setFile] = useState(null);

  const downloadTemplate = () => {
    const template = 'batchNumber,productName,expiryDate,description\n';
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Verifi_Batch_Template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const mutation = useMutation({
    mutationFn: async (formData) => {
      const response = await axios.post('/api/products/bulk-upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(`Batch uploaded: ${data.message}`);
      setFile(null);
    },
    onError: () => {
      toast.error('Failed to upload batch list');
    },
  });

  const handleUpload = (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a file');
      return;
    }
    const formData = new FormData();
    formData.append('batchFile', file);
    mutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Bulk Batch Upload (CSV/Excel)</h1>
        <form onSubmit={handleUpload} className="space-y-6">
          <button
            type="button"
            onClick={downloadTemplate}
            className="w-full bg-blue-500 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
          >
            Download CSV Template
          </button>
          <div>
            <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
              Select CSV or Excel File
            </label>
            <input
              id="file"
              type="file"
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            />
          </div>

          <button
            type="submit"
            disabled={mutation.isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-700 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {mutation.isLoading ? 'Uploading...' : 'Upload Batch List'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BatchUploadScreen;
