import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Search, 
  Building2, 
  ShieldCheck, 
  ShieldAlert, 
  Ban, 
  CheckCircle,
  MoreVertical,
  Power
} from 'lucide-react';
import { toast } from 'react-toastify';
import Skeleton from '../components/Skeleton';

const RegulatorManufacturersScreen = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: manufacturers, isLoading } = useQuery({
    queryKey: ['allManufacturers'],
    queryFn: async () => (await api.get('/users/manufacturers')).data
  });

  // Actions
  const verifyMutation = useMutation({
    mutationFn: async (id) => await api.put(`/users/verify/${id}`),
    onSuccess: () => { toast.success('Manufacturer Verified'); queryClient.invalidateQueries(['allManufacturers']); }
  });

  const revokeMutation = useMutation({
    mutationFn: async (id) => await api.put(`/users/revoke/${id}`),
    onSuccess: () => { toast.warning('License Revoked'); queryClient.invalidateQueries(['allManufacturers']); }
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async (id) => await api.put(`/users/toggle-status/${id}`),
    onSuccess: (data) => { toast.info(data.data.message); queryClient.invalidateQueries(['allManufacturers']); }
  });

  const filteredList = manufacturers?.filter(m => 
    m.organizationDetails?.orgName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full bg-background bg-gradient-mesh dark:bg-gradient-mesh-dark p-4 md:p-8 transition-colors duration-500">
      <div className="max-w-7xl mx-auto pt-2 pb-24">
        
        <div className="mb-8">
          <button onClick={() => navigate('/regulator/dashboard')} className="mb-4 flex items-center text-muted-foreground hover:text-foreground transition-colors text-sm font-bold">
            <ArrowLeft size={16} className="mr-2" /> Dashboard
          </button>
          <h1 className="text-3xl font-display font-extrabold text-foreground">Manufacturer Database</h1>
          <p className="text-muted-foreground mt-1">Manage licenses and access for all registered entities.</p>
        </div>

        {/* Search */}
        <div className="glass-card p-4 mb-6 flex items-center gap-4">
          <Search className="text-muted-foreground ml-2" size={20} />
          <input 
            type="text" 
            placeholder="Search Organization or Email..." 
            className="bg-transparent w-full focus:outline-none text-foreground font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Grid List */}
        <div className="grid gap-4">
          {isLoading ? (
             [1,2,3].map(i => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)
          ) : filteredList?.length > 0 ? (
            filteredList.map((user) => (
              <div key={user._id} className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                
                {/* Info */}
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    user.organizationDetails?.isVerified ? 'bg-blue-500/10 text-blue-600' : 'bg-amber-500/10 text-amber-600'
                  }`}>
                    <Building2 size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-foreground">{user.organizationDetails?.orgName || 'Unnamed Org'}</h3>
                      {!user.isActive && <span className="bg-red-500/10 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded border border-red-500/20">SUSPENDED</span>}
                    </div>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs font-mono text-muted-foreground">
                      <span>Lic: {user.organizationDetails?.orgLicense || 'N/A'}</span>
                      <span>•</span>
                      <span>Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Actions Toolbar */}
                <div className="flex items-center gap-2 md:border-l md:border-border/50 md:pl-6">
                  
                  {/* Verify / Revoke Toggle */}
                  {user.organizationDetails?.isVerified ? (
                    <button 
                      onClick={() => { if(window.confirm('Revoke this license? Products will be flagged.')) revokeMutation.mutate(user._id) }}
                      className="px-4 py-2 rounded-xl bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border border-amber-500/20 font-bold text-xs flex items-center gap-2 transition-all"
                    >
                      <ShieldAlert size={16} /> Revoke License
                    </button>
                  ) : (
                    <button 
                      onClick={() => verifyMutation.mutate(user._id)}
                      className="px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border border-emerald-500/20 font-bold text-xs flex items-center gap-2 transition-all"
                    >
                      <ShieldCheck size={16} /> Approve License
                    </button>
                  )}

                  {/* Suspend / Activate Toggle */}
                  <button 
                    onClick={() => toggleStatusMutation.mutate(user._id)}
                    className={`p-2.5 rounded-xl border transition-all ${
                      user.isActive 
                        ? 'text-muted-foreground border-border hover:text-red-600 hover:border-red-500/30 hover:bg-red-500/10' 
                        : 'text-emerald-600 border-emerald-500/30 bg-emerald-500/10'
                    }`}
                    title={user.isActive ? "Suspend Account" : "Activate Account"}
                  >
                    <Power size={18} />
                  </button>

                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-muted-foreground">No manufacturers found.</div>
          )}
        </div>

      </div>
    </div>
  );
};

export default RegulatorManufacturersScreen;