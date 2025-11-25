import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import api from '../api';
import useAuthStore from '../store';
import { toast } from 'react-toastify';
import { Eye, EyeOff, ArrowRight, ShieldCheck, Lock, Mail, Loader2 } from 'lucide-react';

const LoginScreen = () => {
  const navigate = useNavigate();
  const { userInfo, setCredentials } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const getRedirectPath = (role) => {
    switch (role) {
      case 'manufacturer': return '/manufacturer/portal';
      case 'regulator': return '/regulator/dashboard';
      case 'distributor': case 'retailer': return '/market'; // New
      case 'consumer': return '/dashboard';
      default: return '/dashboard';
    }
  };

  useEffect(() => {
    if (userInfo) navigate(getRedirectPath(userInfo.role));
  }, [navigate, userInfo]);

  const mutation = useMutation({
    mutationFn: async (userData) => await api.post('/users/login', userData),
    onSuccess: (data) => {
      const user = data.data;
      setCredentials(user);
      navigate(getRedirectPath(user.role));
      toast.success(`Welcome back, ${user.firstName}!`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Invalid credentials');
    }
  });

  const submitHandler = (e) => {
    e.preventDefault();
    mutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background bg-gradient-mesh dark:bg-gradient-mesh-dark p-4 transition-colors duration-500">
      
      <div className="w-full max-w-md animate-in zoom-in-95 duration-500">
        
        <div className="glass rounded-[2.5rem] p-8 md:p-10 shadow-2xl border border-white/20">
          
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
              <ShieldCheck size={32} className="text-emerald-500" />
            </div>
            <h1 className="text-3xl font-display font-bold text-foreground mb-2">Welcome Back</h1>
            <p className="text-muted-foreground text-sm">
              Enter your credentials to access your workspace.
            </p>
          </div>

          <form onSubmit={submitHandler} className="space-y-5">
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground ml-1" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
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

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-sm font-bold text-foreground" htmlFor="password">
                  Password
                </label>
                <Link to="/forgot-password" class="text-xs font-bold text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-10 py-3.5 rounded-xl border border-input bg-background/50 shadow-sm focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-muted-foreground"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full py-3.5 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="animate-spin" size={20} /> Signing in...
                </>
              ) : (
                <>
                  Sign In <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="relative mt-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/60" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background/50 backdrop-blur-xl px-3 text-muted-foreground font-medium rounded-full">
                New to Verifi?
              </span>
            </div>
          </div>

          <div className="text-center mt-6">
            <Link to="/register" className="inline-flex items-center justify-center w-full py-3.5 rounded-xl border-2 border-border hover:border-primary/50 hover:bg-primary/5 text-foreground font-bold transition-all">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;