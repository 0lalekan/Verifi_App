import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import useAuthStore from '../store';
import { toast } from 'react-toastify';

const LoginScreen = () => {
  const navigate = useNavigate();
  const { userInfo, setCredentials } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
  }, [navigate, userInfo]);

  const mutation = useMutation({
    mutationFn: async (userData) => await axios.post('/api/users/login', userData),
    onSuccess: (data) => {
      setCredentials(data.data);
      navigate('/');
      toast.success('Login successful');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || error.message);
    }
  });

  const submitHandler = (e) => {
    e.preventDefault();
    mutation.mutate({ email, password });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800">Member Login</h2>
        <p className="text-slate-500">Securely access your Verifi account.</p>
      </div>

      <form onSubmit={submitHandler} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 text-left">
            Email address
          </label>
          <div className="mt-1">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-700 text-left">
            Password
          </label>
          <div className="mt-1">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center">
            <input id="remember_me" name="remember_me" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded" />
            <label htmlFor="remember_me" className="ml-2 block text-slate-800">Keep me signed in</label>
          </div>

          <div >
            <Link to="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">Forgot password?</Link>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {mutation.isPending ? 'Loading...' : 'Login'}
          </button>
        </div>
      </form>

      <p className="text-center text-sm text-slate-600">
        Not a member?{' '}
        <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
          Create an account
        </Link>
      </p>
    </div>
  );
};

export default LoginScreen;
