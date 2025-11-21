import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { toast } from 'react-toastify';
import { Lock, Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react';

const ResetPasswordScreen = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [passwords, setPasswords] = useState({ new: '', confirm: '' });
  const [showPass, setShowPass] = useState({ new: false, confirm: false });

  const mutation = useMutation({
    mutationFn: async (passwordData) => (await api.post(`/users/reset-password/${token}`, passwordData)).data,
    onSuccess: () => {
      toast.success('Password reset successful! Please log in.');
      navigate('/login');
    },
    onError: (error) => toast.error(error?.response?.data?.message || error.message),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) return toast.error('Passwords do not match');
    mutation.mutate({ newPassword: passwords.new });
  };

  const toggleShow = (field) => setShowPass(prev => ({ ...prev, [field]: !prev[field] }));

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background bg-gradient-mesh dark:bg-gradient-mesh-dark p-4 transition-colors duration-500">
      <div className="w-full max-w-md animate-in zoom-in-95 duration-500">
        
        <div className="glass rounded-[2.5rem] p-8 md:p-10 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-500 border border-emerald-500/20">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-3xl font-display font-bold text-foreground mb-2">Reset Password</h1>
            <p className="text-muted-foreground text-sm">Create a strong new password for your account.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground ml-1">New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  type={showPass.new ? "text" : "password"}
                  value={passwords.new}
                  onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                  className="w-full pl-11 pr-10 py-3.5 rounded-xl border border-input bg-background/50 shadow-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
                <button type="button" onClick={() => toggleShow('new')} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPass.new ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground ml-1">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  type={showPass.confirm ? "text" : "password"}
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                  className="w-full pl-11 pr-10 py-3.5 rounded-xl border border-input bg-background/50 shadow-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
                <button type="button" onClick={() => toggleShow('confirm')} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPass.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full py-3.5 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
            >
              {mutation.isPending ? <Loader2 className="animate-spin" /> : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordScreen;