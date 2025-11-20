import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Skeleton from '../components/Skeleton';
import ErrorState from '../components/ErrorState';

const ManufacturerInventoryScreen = () => {
  const queryClient = useQueryClient();
  const [editingBatch, setEditingBatch] = useState(null);

  // Fetch Data with error handling and refetch exposed
  const { data: batches, isLoading, error, refetch } = useQuery({
    queryKey: ['myInventory'],
    queryFn: async () => (await api.get('/products/my-inventory')).data
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => await api.delete(`/products/${id}`),
    onSuccess: () => {
      toast.success('Batch deleted');
      queryClient.invalidateQueries(['myInventory']);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Delete failed')
  });

  // Edit Mutation
  const updateMutation = useMutation({
    mutationFn: async (data) => await api.put(`/products/${data._id}`, data),
    onSuccess: () => {
      toast.success('Batch updated');
      setEditingBatch(null);
      queryClient.invalidateQueries(['myInventory']);
    },
    onError: (err) => toast.error('Update failed')
  });

  // Print Handler (Opens a clean printable window)
  const handlePrint = (batchNumber) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Labels - ${batchNumber}</title>
          <style>
            body { font-family: sans-serif; padding: 20px; }
            .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; }
            .label { border: 1px dashed #ccc; padding: 10px; text-align: center; page-break-inside: avoid; }
            h1 { text-align: center; margin-bottom: 20px; }
            img { width: 100px; height: 100px; }
            .meta { font-size: 12px; margin-top: 5px; }
          </style>
        </head>
        <body>
          <h1>Batch: ${batchNumber}</h1>
          <div class="grid">
            ${Array(24).fill('').map(() => `
              <div class="label">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${batchNumber}" />
                <div class="meta">VERIFI SECURE<br/>${batchNumber}</div>
              </div>
            `).join('')}
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Handle Error State
  if (error) return <div className="min-h-screen bg-slate-50 pt-20"><ErrorState onRetry={refetch} /></div>;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Product Inventory</h1>
            <p className="text-slate-500 mt-1">Manage lifecycle and print labels.</p>
          </div>
          <Link to="/register-batch" className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-all">
            + New Batch
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Product</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Scans / Limit</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                 // SKELETON ROWS
                 [1, 2, 3, 4, 5].map((i) => (
                   <tr key={i}>
                     <td className="px-6 py-4"><Skeleton className="h-4 w-32 mb-2"/><Skeleton className="h-3 w-20"/></td>
                     <td className="px-6 py-4"><Skeleton className="h-6 w-16 rounded-full"/></td>
                     <td className="px-6 py-4"><Skeleton className="h-4 w-12"/></td>
                     <td className="px-6 py-4"><Skeleton className="h-8 w-20 ml-auto"/></td>
                   </tr>
                 ))
              ) : batches?.map((batch) => (
                <tr key={batch._id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{batch.productName}</div>
                    <div className="text-xs font-mono text-slate-500 bg-slate-100 inline-block px-1 rounded mt-1">
                      {batch.batchNumber}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
                      batch.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 
                      batch.status === 'Recalled' ? 'bg-red-100 text-red-700' : 
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {batch.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    <div className="flex items-center gap-1">
                      <span className={`font-bold ${batch.verificationCount >= batch.maxScansAllowed ? 'text-red-600' : 'text-slate-900'}`}>
                        {batch.verificationCount}
                      </span>
                      <span className="text-slate-400">/ {batch.maxScansAllowed}</span>
                    </div>
                    {batch.verificationCount >= batch.maxScansAllowed && (
                      <span className="text-[10px] text-red-500 font-bold">LIMIT REACHED</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button 
                      onClick={() => handlePrint(batch.batchNumber)}
                      className="text-slate-400 hover:text-blue-600 transition-colors"
                      title="Print Labels"
                    >
                      🖨️
                    </button>
                    <button 
                      onClick={() => setEditingBatch(batch)}
                      className="text-slate-400 hover:text-emerald-600 transition-colors"
                      title="Edit Batch"
                    >
                      ✏️
                    </button>
                    {batch.verificationCount === 0 && (
                      <button 
                        onClick={() => {
                          if(window.confirm('Are you sure? This cannot be undone.')) deleteMutation.mutate(batch._id);
                        }}
                        className="text-slate-400 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingBatch && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Edit Batch</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Product Name</label>
                <input 
                  type="text" 
                  defaultValue={editingBatch.productName}
                  onChange={(e) => setEditingBatch({...editingBatch, productName: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Status</label>
                <select 
                  value={editingBatch.status}
                  onChange={(e) => setEditingBatch({...editingBatch, status: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="Active">Active</option>
                  <option value="Recalled">Recalled (Emergency)</option>
                  <option value="Expired">Expired</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Max Scan Limit</label>
                <input 
                  type="number" 
                  defaultValue={editingBatch.maxScansAllowed}
                  onChange={(e) => setEditingBatch({...editingBatch, maxScansAllowed: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                />
                <p className="text-xs text-slate-500 mt-1">Increase this if you produced more items.</p>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button 
                onClick={() => setEditingBatch(null)}
                className="flex-1 py-2 text-slate-600 font-bold hover:bg-slate-50 rounded-lg"
              >
                Cancel
              </button>
              <button 
                onClick={() => updateMutation.mutate(editingBatch)}
                className="flex-1 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManufacturerInventoryScreen;