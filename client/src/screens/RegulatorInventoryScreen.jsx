import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Search, Building2, Calendar, ShieldCheck } from 'lucide-react';
import Skeleton from '../components/Skeleton';

const RegulatorInventoryScreen = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: batches, isLoading } = useQuery({
    queryKey: ['allInventory'],
    queryFn: async () => (await api.get('/products/all-inventory')).data
  });

  const filteredBatches = batches?.filter(b => 
    b.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.manufacturer?.organizationDetails?.orgName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full bg-background bg-gradient-mesh dark:bg-gradient-mesh-dark p-4 md:p-8 transition-colors duration-500">
      <div className="max-w-7xl mx-auto pt-2 pb-20">
        
        <div className="mb-8">
          <button onClick={() => navigate('/regulator/dashboard')} className="mb-4 flex items-center text-muted-foreground hover:text-foreground transition-colors text-sm font-bold">
            <ArrowLeft size={16} className="mr-2" /> Dashboard
          </button>
          <h1 className="text-3xl font-display font-extrabold text-foreground">Global Registry</h1>
          <p className="text-muted-foreground mt-1">Master database of all registered product batches.</p>
        </div>

        {/* Search Toolbar */}
        <div className="glass-card p-4 mb-6 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <input 
              type="text" 
              placeholder="Search by Batch #, Product, or Manufacturer..." 
              className="w-full bg-background/50 border border-inputQV rounded-xl pl-11 pr-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="bg-secondary/50 px-4 py-3 rounded-xl font-bold text-sm text-muted-foreground">
            {filteredBatches?.length || 0} Records
          </div>
        </div>

        {/* Table */}
        <div className="glass-card overflow-hidden rounded-[2rem]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/50 bg-secondary/30 text-muted-foreground text-xs uppercase tracking-wider">
                  <th className="px-6 py-5 font-bold">Product Details</th>
                  <th className="px-6 py-5 font-bold">Manufacturer</th>
                  <th className="px-6 py-5 font-bold">Scan Stats</th>
                  <th className="px-6 py-5 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {isLoading ? (
                   [...Array(5)].map((_, i) => (
                     <tr key={i}><td colSpan="4" className="px-6 py-4"><Skeleton className="h-12 w-full" /></td></tr>
                   ))
                ) : filteredBatches?.length > 0 ? (
                  filteredBatches.map((batch) => (
                    <tr key={batch._id} className="hover:bg-secondary/20 transition-colors">
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
                          'bg-red-500/10 text-red-600 border-red-500/20'
                        }`}>
                          {batch.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="4" className="p-12 text-center text-muted-foreground">No records found.</td></tr>
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