import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  ArrowLeft, 
  Package, 
  Search, 
  Building2, 
  ShieldAlert,
  CheckCircle,
  XCircle,
  ListChecks
} from 'lucide-react';
import Skeleton from '../components/Skeleton';

const RegulatorInventoryScreen = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState(new Set());

  const { data: batches, isLoading } = useQuery({
    queryKey: ['allInventory'],
    queryFn: async () => (await api.get('/products/all-inventory')).data
  });

  const bulkMutation = useMutation({
    mutationFn: async ({ ids, status }) => await api.put('/products/bulk-update', { ids, status }),
    onSuccess: (data) => {
      toast.success(data.data.message);
      setSelectedIds(new Set()); // Clear selection
      queryClient.invalidateQueries(['allInventory']);
    },
    onError: () => toast.error('Bulk update failed')
  });

  const filteredBatches = batches?.filter(b => 
    b.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.manufacturer?.organizationDetails?.orgName?.toLowerCase().includes(searchTerm.toLowerCase())
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
      setSelectedIds(new Set()); // Deselect all
    } else {
      setSelectedIds(new Set(filteredBatches.map(b => b._id))); // Select all visible
    }
  };

  const handleBulkAction = (status) => {
    if (!window.confirm(`Mark ${selectedIds.size} items as ${status}?`)) return;
    bulkMutation.mutate({ 
      ids: Array.from(selectedIds), 
      status 
    });
  };

  return (
    <div className="min-h-screen w-full bg-background bg-gradient-mesh dark:bg-gradient-mesh-dark p-4 md:p-8 transition-colors duration-500">
      <div className="max-w-7xl mx-auto pt-2 pb-24">
        
        <div className="mb-8">
          <button onClick={() => navigate('/regulator/dashboard')} className="mb-4 flex items-center text-muted-foreground hover:text-foreground transition-colors text-sm font-bold">
            <ArrowLeft size={16} className="mr-2" /> Dashboard
          </button>
          <h1 className="text-3xl font-display font-extrabold text-foreground">Global Registry</h1>
          <p className="text-muted-foreground mt-1">Master database of all registered product batches.</p>
        </div>

        {/* --- BULK ACTION BAR (Visible only when items are selected) --- */}
        {selectedIds.size > 0 && (
          <div className="fixed bottom-6 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-auto md:min-w-[400px] z-50 animate-in slide-in-from-bottom-4 duration-300">
            <div className="bg-foreground text-background p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 font-bold pl-2">
                <span className="bg-background/20 px-2 py-0.5 rounded text-sm">{selectedIds.size}</span>
                <span>Selected</span>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleBulkAction('Active')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-sm flex items-center gap-2 transition-colors"
                >
                  <CheckCircle size={16} /> Activate
                </button>
                <button 
                  onClick={() => handleBulkAction('Suspicious')}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold text-sm flex items-center gap-2 transition-colors"
                >
                  <ShieldAlert size={16} /> Flag
                </button>
                <button 
                  onClick={() => handleBulkAction('Recalled')}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold text-sm flex items-center gap-2 transition-colors"
                >
                  <XCircle size={16} /> Recall
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toolbar */}
        <div className="glass-card p-4 mb-6 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <input 
              type="text" 
              placeholder="Search by Batch #, Product, or Manufacturer..." 
              className="w-full bg-background/50 border border-input rounded-xl pl-11 pr-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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
                  <th className="px-6 py-5 font-bold">Product Details</th>
                  <th className="px-6 py-5 font-bold">Manufacturer</th>
                  <th className="px-6 py-5 font-bold">Scan Stats</th>
                  <th className="px-6 py-5 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {isLoading ? (
                   [...Array(5)].map((_, i) => (
                     <tr key={i}><td colSpan="5" className="px-6 py-4"><Skeleton className="h-12 w-full" /></td></tr>
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
                          <div className="p-2 bg-primary/10 text-primary rounded-lg"><Package size={20} /></div>
                          <div>
                            <p className="font-bold text-foreground">{batch.productName}</p>
                            <p className="text-xs font-mono text-muted-foreground">{batch.batchNumber}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Building2 size={16} className="text-muted-foreground" />
                          <span className="text-sm font-medium text-foreground">
                            {batch.manufacturer?.organizationDetails?.orgName || 'Unknown Org'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1 w-32">
                          <div className="flex justify-between text-xs font-bold">
                            <span>{batch.verificationCount} Scans</span>
                            <span className="text-muted-foreground">Max {batch.maxScansAllowed}</span>
                          </div>
                          <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${batch.verificationCount >= batch.maxScansAllowed ? 'bg-red-500' : 'bg-emerald-500'}`}
                              style={{ width: `${Math.min((batch.verificationCount / batch.maxScansAllowed) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wide ${
                          batch.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 
                          batch.status === 'Recalled' ? 'bg-red-500/10 text-red-600 border-red-500/20' :
                          'bg-amber-500/10 text-amber-600 border-amber-500/20'
                        }`}>
                          {batch.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="5" className="p-12 text-center text-muted-foreground">No records found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegulatorInventoryScreen;