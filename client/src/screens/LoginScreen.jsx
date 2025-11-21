import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import api from '../api';
import useAuthStore from '../store';
import { toast } from 'react-toastify';
import { Eye, EyeOff, ArrowRight, ShieldCheck, Lock } from 'lucide-react';

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
    <div className="min-h-screen w-full flex">
      
      {/* Left Side - Artistic / Brand */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 bg-gradient-mesh opacity-20"></div>
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-slate-900 to-transparent z-10"></div>
        
        <div className="relative z-20 text-white max-w-lg">
          <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl border border-emerald-500/30 flex items-center justify-center mb-8 backdrop-blur-md">
            <ShieldCheck size={32} className="text-emerald-400" />
          </div>
          <h1 className="text-5xl font-display font-bold mb-6 leading-tight">
            Secure the future of <span className="text-emerald-400">authenticity.</span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            Join thousands of manufacturers and consumers building a transparent supply chain ecosystem. Verify products instantly with cryptographic certainty.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 bg-background flex items-center justify-center p-8 sm:p-12 lg:p-24">
        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
            <p className="mt-2 text-muted-foreground">
              Enter your credentials to access your workspace.
            </p>
          </div>

          <form onSubmit={submitHandler} className="space-y-6 mt-8">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex h-12 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                placeholder="name@example.com"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium leading-none" htmlFor="password">
                  Password
                </label>
                <Link to="/forgot-password" class="text-sm font-medium text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex h-12 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 pr-10 transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={mutation.isPending}
              className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 w-full text-sm font-bold text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 shadow-lg shadow-primary/20"
            >
              {mutation.isPending ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign In <ArrowRight size={18} />
                </span>
              )}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                New to Verifi?
              </span>
            </div>
          </div>

          <div className="text-center">
            <Link to="/register" className="inline-flex h-12 items-center justify-center rounded-xl border border-input bg-background px-8 w-full text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;