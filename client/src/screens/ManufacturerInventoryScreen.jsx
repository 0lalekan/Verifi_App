import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Skeleton from '../components/Skeleton';
import ErrorState from '../components/ErrorState';
import { 
  Package, 
  Plus, 
  Printer, 
  Edit3, 
  Trash2, 
  AlertCircle, 
  CheckCircle, 
  XCircle,
  Search,
  Filter,
  Truck,
  MapPin
} from 'lucide-react';

const ManufacturerInventoryScreen = () => {
  const queryClient = useQueryClient();
  const [editingBatch, setEditingBatch] = useState(null);
  const [historyBatch, setHistoryBatch] = useState(null); // State for History Modal
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState(new Set());

  const { data: batches, isLoading, error, refetch } = useQuery({
    queryKey: ['myInventory'],
    queryFn: async () => (await api.get('/products/my-inventory')).data
  });

  // Individual Actions
  const deleteMutation = useMutation({
    mutationFn: async (id) => await api.delete(`/products/${id}`),
    onSuccess: () => {
      toast.success('Batch deleted');
      queryClient.invalidateQueries(['myInventory']);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Delete failed')
  });

  const updateMutation = useMutation({
    mutationFn: async (data) => await api.put(`/products/${data._id}`, data),
    onSuccess: () => {
      toast.success('Batch updated');
      setEditingBatch(null);
      queryClient.invalidateQueries(['myInventory']);
    },
    onError: () => toast.error('Update failed')
  });

  // Bulk Actions
  const bulkUpdateMutation = useMutation({
    mutationFn: async ({ ids, status }) => await api.put('/products/bulk-update', { ids, status }),
    onSuccess: (data) => {
      toast.success(data.data.message);
      setSelectedIds(new Set()); // Clear selection
      queryClient.invalidateQueries(['myInventory']);
    },
    onError: () => toast.error('Bulk update failed')
  });

  const handleBulkDelete = async () => {
    if (!window.confirm(`Delete ${selectedIds.size} items? (Only unused batches will be deleted)`)) return;
    
    const ids = Array.from(selectedIds);
    let successCount = 0;
    
    for (const id of ids) {
        try {
            await api.delete(`/products/${id}`);
            successCount++;
        } catch (e) {
            // ignore errors for used batches
        }
    }
    toast.success(`Deleted ${successCount} batches`);
    setSelectedIds(new Set());
    queryClient.invalidateQueries(['myInventory']);
  };

  // --- Barcode Printing Logic ---
  const handlePrint = (batchNumber) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Labels - ${batchNumber}</title>
          <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
          <style>
            body { font-family: sans-serif; padding: 20px; }
            .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
            .label { 
              border: 2px dashed #000; 
              padding: 15px; 
              text-align: center; 
              page-break-inside: avoid; 
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
            }
            svg { width: 100%; max-height: 80px; margin-bottom: 5px; }
            .meta { font-size: 12px; font-weight: bold; letter-spacing: 1px; margin-top: 5px; }
            .brand { font-size: 10px; color: #666; }
          </style>
        </head>
        <body>
          <h2 style="text-align:center; margin-bottom: 30px;">Batch: ${batchNumber}</h2>
          <div class="grid">
            ${Array(21).fill('').map(() => `
              <div class="label">
                <svg class="barcode"></svg>
                <div class="meta">${batchNumber}</div>
                <div class="brand">VERIFI SECURE</div>
              </div>
            `).join('')}
          </div>
          <script>
            // Generate Barcodes
            JsBarcode(".barcode", "${batchNumber}", {
              format: "CODE128",
              lineColor: "#000",
              width: 2,
              height: 60,
              displayValue: false 
            });
            
            // Auto-print
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (error) return <div className="min-h-screen pt-24"><ErrorState onRetry={refetch} /></div>;

  const filteredBatches = batches?.filter(b => 
    b.productName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.batchNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- SELECTION LOGIC ---
  const toggleSelect = (id) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredBatches?.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredBatches.map(b => b._id)));
    }
  };

  const handleBulkStatus = (status) => {
    if (!window.confirm(`Set ${selectedIds.size} items to ${status}?`)) return;
    bulkUpdateMutation.mutate({ 
      ids: Array.from(selectedIds), 
      status 
    });
  };

  return (
    <div className="min-h-screen w-full bg-background bg-gradient-mesh dark:bg-gradient-mesh-dark p-4 md:p-8 transition-colors duration-500">
      <div className="max-w-7xl mx-auto pt-2 pb-20">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Inventory</h1>
            <p className="text-muted-foreground mt-1">Manage product lifecycle and print labels.</p>
          </div>
          <Link to="/register-batch" className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all hover:-translate-y-0.5">
            <Plus size={20} /> New Batch
          </Link>
        </div>

        {/* --- BULK ACTION BAR --- */}
        {selectedIds.size > 0 && (
          <div className="fixed bottom-6 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-auto md:min-w-[400px] z-50 animate-in slide-in-from-bottom-4 duration-300">
            <div className="bg-foreground text-background p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 font-bold pl-2">
                <span className="bg-background/20 px-2 py-0.5 rounded text-sm">{selectedIds.size}</span>
                <span>Selected</span>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleBulkStatus('Active')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-sm flex items-center gap-2 transition-colors"
                >
                  <CheckCircle size={16} /> Active
                </button>
                <button 
                  onClick={() => handleBulkStatus('Recalled')}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold text-sm flex items-center gap-2 transition-colors"
                >
                  <AlertCircle size={16} /> Recall
                </button>
                <button 
                  onClick={handleBulkDelete}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold text-sm flex items-center gap-2 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toolbar */}
        <div className="glass-card p-4 mb-6 flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <input 
              type="text" 
              placeholder="Search products or batch numbers..." 
              className="w-full bg-background/50 border border-input rounded-xl pl-11 pr-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground px-4">
            <Filter size={16} /> 
            <span>{filteredBatches?.length || 0} Items</span>
          </div>
        </div>

        {/* Table */}
        <div className="glass-card overflow-hidden rounded-[2rem]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/50 bg-secondary/30 text-muted-foreground text-xs uppercase tracking-wider">
                  <th className="px-6 py-5 w-12 text-center">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                      checked={selectedIds.size === filteredBatches?.length && filteredBatches?.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="px-6 py-5 font-bold">Product</th>
                  <th className="px-6 py-5 font-bold">Status</th>
                  <th className="px-6 py-5 font-bold">Scan Velocity</th>
                  <th className="px-6 py-5 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {isLoading ? (
                   [...Array(5)].map((_, i) => (
                     <tr key={i}>
                       <td className="px-6 py-4"><Skeleton className="h-6 w-6 rounded" /></td>
                       <td className="px-6 py-4"><Skeleton className="h-12 w-48 rounded-lg" /></td>
                       <td className="px-6 py-4"><Skeleton className="h-8 w-20 rounded-full" /></td>
                       <td className="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
                       <td className="px-6 py-4"><Skeleton className="h-8 w-24 ml-auto" /></td>
                     </tr>
                   ))
                ) : filteredBatches?.length > 0 ? (
                  filteredBatches.map((batch) => (
                    <tr 
                      key={batch._id} 
                      className={`transition-colors ${selectedIds.has(batch._id) ? 'bg-primary/5' : 'hover:bg-secondary/20'}`}
                    >
                      <td className="px-6 py-4 text-center">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                          checked={selectedIds.has(batch._id)}
                          onChange={() => toggleSelect(batch._id)}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                            <Package size={20} />
                          </div>
                          <div>
                            <p className="font-bold text-foreground">{batch.productName}</p>
                            <p className="text-xs font-mono text-muted-foreground">{batch.batchNumber}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wide ${
                          batch.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 
                          batch.status === 'Recalled' ? 'bg-red-500/10 text-red-600 border-red-500/20' : 
                          'bg-amber-500/10 text-amber-600 border-amber-500/20'
                        }`}>
                          {batch.status === 'Active' && <CheckCircle size={12} />}
                          {batch.status === 'Recalled' && <AlertCircle size={12} />}
                          {batch.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between text-xs font-bold">
                            <span className={batch.verificationCount >= batch.maxScansAllowed ? 'text-red-500' : 'text-foreground'}>
                              {batch.verificationCount}
                            </span>
                            <span className="text-muted-foreground">/ {batch.maxScansAllowed}</span>
                          </div>
                          <div className="w-32 h-1.5 bg-secondary rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${batch.verificationCount >= batch.maxScansAllowed ? 'bg-red-500' : 'bg-primary'}`}
                              style={{ width: `${Math.min((batch.verificationCount / batch.maxScansAllowed) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* History Button */}
                          <button 
                            onClick={() => setHistoryBatch(batch)} 
                            className="p-2 text-muted-foreground hover:text-purple-500 hover:bg-purple-500/10 rounded-lg transition-colors" 
                            title="View History"
                          >
                            <Truck size={18} />
                          </button>
                          
                          <button onClick={() => handlePrint(batch.batchNumber)} className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Print Barcode">
                            <Printer size={18} />
                          </button>
                          <button onClick={() => setEditingBatch(batch)} className="p-2 text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors" title="Edit">
                            <Edit3 size={18} />
                          </button>
                          {batch.verificationCount === 0 && (
                            <button onClick={() => { if(window.confirm('Delete?')) deleteMutation.mutate(batch._id); }} className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors" title="Delete">
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-muted-foreground">
                      No batches found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-background rounded-3xl shadow-2xl border border-border overflow-hidden animate-in zoom-in-95">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h3 className="text-xl font-bold text-foreground">Edit Batch</h3>
              <button onClick={() => setEditingBatch(null)} className="text-muted-foreground hover:text-foreground"><XCircle size={24} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-bold text-foreground mb-1.5 block">Product Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2.5 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary outline-none"
                  defaultValue={editingBatch.productName}
                  onChange={(e) => setEditingBatch({...editingBatch, productName: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-bold text-foreground mb-1.5 block">Status</label>
                <select 
                  className="w-full px-4 py-2.5 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary outline-none"
                  value={editingBatch.status}
                  onChange={(e) => setEditingBatch({...editingBatch, status: e.target.value})}
                >
                  <option value="Active">Active</option>
                  <option value="Recalled">Recalled (Emergency)</option>
                  <option value="Expired">Expired</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-bold text-foreground mb-1.5 block">Max Scan Limit</label>
                <input 
                  type="number" 
                  className="w-full px-4 py-2.5 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary outline-none"
                  defaultValue={editingBatch.maxScansAllowed}
                  onChange={(e) => setEditingBatch({...editingBatch, maxScansAllowed: e.target.value})}
                />
              </div>
            </div>
            <div className="p-6 border-t border-border bg-secondary/20 flex gap-3">
              <button onClick={() => setEditingBatch(null)} className="flex-1 py-3 font-bold text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
              <button onClick={() => updateMutation.mutate(editingBatch)} className="flex-1 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-opacity">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Chain of Custody Modal (NEW) */}
      {historyBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setHistoryBatch(null)}>
          <div className="w-full max-w-lg bg-background rounded-[2rem] shadow-2xl border border-border overflow-hidden animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
            
            <div className="p-6 border-b border-border flex justify-between items-center bg-secondary/20">
              <div>
                <h3 className="text-lg font-bold text-foreground">Chain of Custody</h3>
                <p className="text-xs text-muted-foreground font-mono">{historyBatch.batchNumber}</p>
              </div>
              <button onClick={() => setHistoryBatch(null)} className="p-2 hover:bg-background rounded-full"><XCircle size={24} /></button>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
              {historyBatch.custodyChain && historyBatch.custodyChain.length > 0 ? (
                historyBatch.custodyChain.map((event, index) => (
                  <div key={index} className="relative pl-8 border-l-2 border-border last:border-transparent">
                    <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-background ${
                      event.action === 'Created' ? 'bg-emerald-500' : 
                      event.action === 'Shipped' ? 'bg-blue-500' : 
                      event.action === 'Received' ? 'bg-purple-500' : 'bg-gray-400'
                    }`} />
                    
                    <div className="mb-1 flex items-center justify-between">
                      <span className="font-bold text-sm text-foreground">{event.action}</span>
                      <span className="text-xs text-muted-foreground">{new Date(event.timestamp).toLocaleString()}</span>
                    </div>
                    
                    <div className="bg-secondary/30 p-3 rounded-xl text-xs space-y-1">
                      <p className="font-medium text-foreground">Handler ID: <span className="font-mono opacity-70">{event.handler}</span></p>
                      {event.location && <p className="flex items-center gap-1 text-muted-foreground"><MapPin size={10} /> {event.location}</p>}
                      {event.notes && <p className="italic opacity-80">"{event.notes}"</p>}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <p>No movement history recorded.</p>
                  <span className="text-xs bg-secondary/50 px-2 py-1 rounded mt-2 inline-block">Origin: Manufacturer</span>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default ManufacturerInventoryScreen;