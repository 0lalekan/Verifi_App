import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const ResetPasswordScreen = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const mutation = useMutation({
    mutationFn: async (passwordData) => {
      const response = await axios.post(`/api/users/reset-password/${token}`, passwordData);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Password reset successful! Please log in.');
      navigate('/');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });

  const submitHandler = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    mutation.mutate({ newPassword });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 via-purple-50 to-indigo-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Reset Password</h1>
        <form onSubmit={submitHandler} className="space-y-6">
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              placeholder="Enter new password"
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              placeholder="Confirm new password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-700 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {mutation.isPending ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-600 mt-6">
          Remember your password?{' '}
          <Link to="/" className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordScreen;
