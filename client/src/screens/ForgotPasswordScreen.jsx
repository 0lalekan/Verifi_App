import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../api';
import { toast } from 'react-toastify';
import { Mail, ArrowLeft, Loader2, KeyRound } from 'lucide-react';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');

  const mutation = useMutation({
    mutationFn: async (userData) => (await api.post('/users/forgot-password', userData)).data,
    onSuccess: () => {
      toast.success('Reset link sent to your email.');
      setEmail('');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });

  const submitHandler = (e) => {
    e.preventDefault();
    mutation.mutate({ email });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background bg-gradient-mesh dark:bg-gradient-mesh-dark p-4 transition-colors duration-500">
      <div className="w-full max-w-md animate-in zoom-in-95 duration-500">
        
        <Link to="/login" className="mb-6 inline-flex items-center text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={18} className="mr-2" /> Back to Login
        </Link>

        <div className="glass rounded-[2.5rem] p-8 md:p-10 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary border border-primary/20">
              <KeyRound size={32} />
            </div>
            <h1 className="text-3xl font-display font-bold text-foreground mb-2">Forgot Password?</h1>
            <p className="text-muted-foreground text-sm">
              Enter your email address and we'll send you a secure link to reset your password.
            </p>
          </div>

          <form onSubmit={submitHandler} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-bold text-foreground ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-input bg-background/50 shadow-sm focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-muted-foreground"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full py-3.5 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {mutation.isPending ? <Loader2 className="animate-spin" /> : 'Send Reset Link'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordScreen;