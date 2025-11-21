import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Check, 
  X, 
  Building2, 
  Clock, 
  MapPin, 
  Hash,
  ShieldAlert
} from 'lucide-react';
import Skeleton from '../components/Skeleton';

const VerificationQueueScreen = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: pendingUsers, isLoading } = useQuery({
    queryKey: ['pendingVerifications'],
    queryFn: async () => (await api.get('/users/pending-verifications')).data
  });

  const mutation = useMutation({
    mutationFn: async (userId) => await api.put(`/users/verify/${userId}`),
    onSuccess: () => {
      toast.success('Manufacturer verified successfully');
      queryClient.invalidateQueries(['pendingVerifications']);
    },
    onError: () => toast.error('Failed to verify user')
  });

  return (
    <div className="min-h-screen w-full bg-background bg-gradient-mesh dark:bg-gradient-mesh-dark p-4 md:p-8 transition-colors duration-500">
      <div className="max-w-5xl mx-auto pt-2 pb-20">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10">
          <div>
            <button onClick={() => navigate('/regulator/dashboard')} className="mb-4 flex items-center text-muted-foreground hover:text-foreground transition-colors text-sm font-bold">
              <ArrowLeft size={16} className="mr-2" /> Dashboard
            </button>
            <h1 className="text-3xl font-display font-extrabold text-foreground">Compliance Queue</h1>
            <p className="text-muted-foreground mt-1">Review manufacturer license applications for network access.</p>
          </div>
          <div className="bg-background/60 backdrop-blur-md border border-border px-5 py-2.5 rounded-full text-foreground font-bold text-sm flex items-center gap-2 shadow-sm">
            <Clock size={16} className="text-primary" />
            {pendingUsers?.length || 0} Pending Requests
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-48 w-full rounded-[2rem]" />
            <Skeleton className="h-48 w-full rounded-[2rem]" />
          </div>
        ) : pendingUsers?.length === 0 ? (
          <div className="glass rounded-[2.5rem] p-16 text-center flex flex-col items-center border border-white/20">
            <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-6">
              <Check size={40} />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">All Caught Up!</h3>
            <p className="text-muted-foreground max-w-md">There are no pending verification requests at this time. The network is secure.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {pendingUsers?.map((user) => (
              <div key={user._id} className="glass-card p-6 md:p-8 flex flex-col md:flex-row gap-8 group transition-all hover:border-primary/30 rounded-[2rem]">
                
                {/* Icon */}
                <div className="hidden md:flex w-16 h-16 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-2xl items-center justify-center shrink-0">
                  <Building2 size={32} />
                </div>

                {/* Details */}
                <div className="flex-1 space-y-5">
                  <div>
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-foreground">{user.organizationDetails?.orgName || 'Unnamed Organization'}</h3>
                      <span className="px-3 py-1 bg-amber-500/10 text-amber-600 text-[10px] font-bold uppercase tracking-wide rounded-full border border-amber-500/20">
                        Pending Review
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50"></span>
                      {user.firstName} {user.lastName}
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50"></span>
                      {user.email}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-secondary/30 p-4 rounded-xl border border-border/50">
                      <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                        <Hash size={12} /> License / RC Number
                      </div>
                      <div className="font-mono text-sm font-semibold text-foreground">
                        {user.organizationDetails?.orgLicense || 'N/A'}
                      </div>
                    </div>
                    <div className="bg-secondary/30 p-4 rounded-xl border border-border/50">
                      <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                        <MapPin size={12} /> Headquarters
                      </div>
                      <div className="font-medium text-sm text-foreground">
                        {user.organizationDetails?.orgAddress || 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-row md:flex-col justify-center gap-3 shrink-0 border-t md:border-t-0 md:border-l border-border/50 pt-6 md:pt-0 md:pl-6">
                  <button 
                    onClick={() => mutation.mutate(user._id)}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
                  >
                    <Check size={18} /> Approve
                  </button>
                  <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-background border border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 text-muted-foreground font-bold rounded-xl transition-all active:scale-95">
                    <X size={18} /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VerificationQueueScreen;