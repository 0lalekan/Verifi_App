import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import api from '../api'; 
import useAuthStore from '../store';
import { toast } from 'react-toastify';
import { Eye, EyeOff, CheckCircle2, User, Factory, ShieldCheck, Loader2 } from 'lucide-react';

const RegisterScreen = () => {
  const navigate = useNavigate();
  const { userInfo, setCredentials } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'consumer'
  });

  const getRedirectPath = (role) => {
    switch (role) {
      case 'manufacturer': return '/manufacturer/portal';
      case 'regulator': return '/regulator/dashboard';
      case 'consumer': default: return '/dashboard';
    }
  };

  useEffect(() => {
    if (userInfo) navigate(getRedirectPath(userInfo.role));
  }, [navigate, userInfo]);

  const mutation = useMutation({
    mutationFn: async (userData) => await api.post('/users', userData),
    onSuccess: (data) => {
      const user = data.data;
      setCredentials(user);
      navigate(getRedirectPath(user.role));
      toast.success(`Welcome to Verifi, ${user.firstName}!`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const selectRole = (role) => {
    setFormData({ ...formData, role });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background bg-gradient-mesh dark:bg-gradient-mesh-dark p-4 py-12 transition-colors duration-500">
      
      <div className="w-full max-w-2xl animate-in zoom-in-95 duration-500">
        
        <div className="glass rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-white/20">
          
          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-primary/20 shadow-lg shadow-primary/10">
              <ShieldCheck size={32} className="text-primary" />
            </div>
            <h2 className="text-3xl font-display font-bold tracking-tight text-foreground">Create an account</h2>
            <p className="text-muted-foreground mt-2 text-sm">Join the secure supply chain network.</p>
          </div>

          <form onSubmit={submitHandler} className="space-y-6">
            
            {/* Role Selection */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-foreground ml-1">I am a...</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div 
                  onClick={() => selectRole('consumer')}
                  className={`relative flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                    formData.role === 'consumer' 
                      ? 'border-primary bg-primary/10' 
                      : 'border-border bg-background/50 hover:border-primary/50'
                  }`}
                >
                  <div className={`mt-0.5 p-2 rounded-full ${formData.role === 'consumer' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
                    <User size={18} />
                  </div>
                  <div>
                    <h3 className={`font-bold text-sm ${formData.role === 'consumer' ? 'text-primary' : 'text-foreground'}`}>Consumer</h3>
                    <p className="text-xs text-muted-foreground mt-1">I want to verify products.</p>
                  </div>
                  {formData.role === 'consumer' && <div className="absolute top-4 right-4 text-primary"><CheckCircle2 size={18} /></div>}
                </div>

                <div 
                  onClick={() => selectRole('manufacturer')}
                  className={`relative flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                    formData.role === 'manufacturer' 
                      ? 'border-primary bg-primary/10' 
                      : 'border-border bg-background/50 hover:border-primary/50'
                  }`}
                >
                  <div className={`mt-0.5 p-2 rounded-full ${formData.role === 'manufacturer' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
                    <Factory size={18} />
                  </div>
                  <div>
                    <h3 className={`font-bold text-sm ${formData.role === 'manufacturer' ? 'text-primary' : 'text-foreground'}`}>Manufacturer</h3>
                    <p className="text-xs text-muted-foreground mt-1">I want to register products.</p>
                  </div>
                  {formData.role === 'manufacturer' && <div className="absolute top-4 right-4 text-primary"><CheckCircle2 size={18} /></div>}
                </div>

              </div>
            </div>

            {/* Name Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground ml-1">First Name</label>
                <input
                  name="firstName"
                  type="text"
                  required
                  className="w-full pl-4 pr-4 py-3 rounded-xl border border-input bg-background/50 shadow-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="Jane"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground ml-1">Last Name</label>
                <input
                  name="lastName"
                  type="text"
                  required
                  className="w-full pl-4 pr-4 py-3 rounded-xl border border-input bg-background/50 shadow-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground ml-1">Email</label>
              <input
                name="email"
                type="email"
                required
                className="w-full pl-4 pr-4 py-3 rounded-xl border border-input bg-background/50 shadow-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                placeholder="jane@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground ml-1">Password</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full pl-4 pr-10 py-3 rounded-xl border border-input bg-background/50 shadow-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
            >
              {mutation.isPending ? <Loader2 className="animate-spin" /> : 'Create Account'}
            </button>

          </form>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-primary hover:underline transition-all">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterScreen;