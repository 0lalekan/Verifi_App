import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import api from '../api'; 
import useAuthStore from '../store';
import { toast } from 'react-toastify';
import { Eye, EyeOff, CheckCircle2, User, Factory } from 'lucide-react';

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
    <div className="min-h-screen w-full flex items-center justify-center bg-background bg-gradient-mesh dark:bg-gradient-mesh-dark p-4 sm:p-8 transition-colors duration-500">
      
      {/* Centered Form Container - Using 'glass' utility for consistency */}
      <div className="w-full max-w-2xl glass rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
        
        <div className="p-8 sm:p-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-display font-bold tracking-tight text-foreground">Create an account</h2>
            <p className="text-muted-foreground mt-2">Start verifying products in seconds.</p>
          </div>

          <form onSubmit={submitHandler} className="space-y-6">
            
            {/* Name Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="firstName">First Name</label>
                <input
                  name="firstName"
                  type="text"
                  required
                  className="flex h-12 w-full rounded-xl border border-input bg-background/50 px-4 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Jane"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="lastName">Last Name</label>
                <input
                  name="lastName"
                  type="text"
                  required
                  className="flex h-12 w-full rounded-xl border border-input bg-background/50 px-4 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="email">Email</label>
              <input
                name="email"
                type="email"
                required
                className="flex h-12 w-full rounded-xl border border-input bg-background/50 px-4 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0"
                placeholder="jane@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="password">Password</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="flex h-12 w-full rounded-xl border border-input bg-background/50 px-4 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0 pr-10"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-secondary"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Role Selection Cards */}
            <div className="space-y-3 pt-2">
              <label className="text-sm font-medium text-foreground">I am a...</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Consumer Card */}
                <div 
                  onClick={() => selectRole('consumer')}
                  className={`relative flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                    formData.role === 'consumer' 
                      ? 'border-primary bg-primary/10 dark:bg-primary/20' 
                      : 'border-border/60 bg-background/30 hover:bg-background/50 hover:border-border'
                  }`}
                >
                  <div className={`mt-0.5 p-2 rounded-full ${formData.role === 'consumer' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
                    <User size={18} />
                  </div>
                  <div>
                    <h3 className={`font-bold text-sm ${formData.role === 'consumer' ? 'text-primary' : 'text-foreground'}`}>Consumer</h3>
                    <p className="text-xs text-muted-foreground mt-1">I want to scan and verify products.</p>
                  </div>
                  {formData.role === 'consumer' && <div className="absolute top-4 right-4 text-primary"><CheckCircle2 size={18} /></div>}
                </div>

                {/* Manufacturer Card */}
                <div 
                  onClick={() => selectRole('manufacturer')}
                  className={`relative flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                    formData.role === 'manufacturer' 
                      ? 'border-primary bg-primary/10 dark:bg-primary/20' 
                      : 'border-border/60 bg-background/30 hover:bg-background/50 hover:border-border'
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

            <button
              type="submit"
              disabled={mutation.isPending}
              className="inline-flex h-14 items-center justify-center rounded-xl bg-primary px-8 w-full text-base font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 mt-6"
            >
              {mutation.isPending ? 'Creating Account...' : 'Create Account'}
            </button>

          </form>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary hover:underline transition-all">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterScreen;