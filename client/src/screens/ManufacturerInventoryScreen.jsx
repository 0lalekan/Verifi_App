import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const ManufacturerInventoryScreen = () => {
  const [selectedQr, setSelectedQr] = useState(null);

  const { data: batches, isLoading, error } = useQuery({
    queryKey: ['myInventory'],
    queryFn: async () => (await axios.get('/api/products/my-inventory')).data
  });

  const downloadQR = async (batchNumber) => {
    try {
      const url = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${batchNumber}`;
      const response = await fetch(url);
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `Verifi_QR_${batchNumber}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('QR Code downloaded');
    } catch (err) {
      toast.error('Failed to download QR');
    }
  };

  if (isLoading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading Inventory...</div>;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Product Inventory</h1>
            <p className="text-slate-500 mt-1">Manage batches and generate verification codes.</p>
          </div>
          <Link 
            to="/register-batch"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all"
          >
            + New Batch
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Batches</p>
            <p className="text-3xl font-extrabold text-slate-900">{batches?.length || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Products</p>
            <p className="text-3xl font-extrabold text-emerald-600">
              {batches?.filter(b => b.status === 'Active').length || 0}
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Consumer Scans</p>
            <p className="text-3xl font-extrabold text-blue-600">
              {batches?.reduce((acc, curr) => acc + (curr.verificationCount || 0), 0) || 0}
            </p>
          </div>
        </div>

        {/* Inventory List */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Batch Info</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Dates</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Scans</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {batches?.map((batch) => (
                  <tr key={batch._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{batch.productName}</div>
                      <div className="text-xs font-mono text-slate-500 bg-slate-100 inline-block px-1 rounded mt-1">
                        {batch.batchNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
                        batch.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {batch.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      <div>Mfg: {new Date(batch.manufacturingDate).toLocaleDateString()}</div>
                      <div className="text-xs text-slate-400">Exp: {new Date(batch.expiryDate).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-slate-900">{batch.verificationCount || 0}</span>
                        <span className="text-xs text-slate-400">hits</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => setSelectedQr(batch.batchNumber)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1"
                      >
                        <span>🔳</span> Get QR
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {(!batches || batches.length === 0) && (
            <div className="p-12 text-center text-slate-500">
              No batches found. <Link to="/register-batch" className="text-blue-600 hover:underline">Register your first one.</Link>
            </div>
          )}
        </div>

      </div>

      {/* QR Code Modal */}
      {selectedQr && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedQr(null)}>
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Batch QR Code</h3>
            <p className="text-sm text-slate-500 mb-6 font-mono">{selectedQr}</p>
            
            <div className="bg-white p-4 rounded-xl border-2 border-slate-100 inline-block mb-6">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${selectedQr}`} 
                alt="QR Code" 
                className="w-48 h-48"
              />
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setSelectedQr(null)}
                className="flex-1 py-3 text-slate-600 font-bold hover:bg-slate-50 rounded-xl transition-colors"
              >
                Close
              </button>
              <button 
                onClick={() => downloadQR(selectedQr)}
                className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManufacturerInventoryScreen;