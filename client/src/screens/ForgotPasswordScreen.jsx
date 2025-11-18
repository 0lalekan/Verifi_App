import React from 'react';
import { Link } from 'react-router-dom';

const ForgotPasswordScreen = () => {
  return (
    <div className="space-y-6 text-center">
      <h2 className="text-2xl font-bold text-slate-800">Forgot Password</h2>
      <p className="text-slate-500">Enter your email address to reset your password.</p>
      <form className="space-y-4">
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
              required
              className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Reset Password
          </button>
        </div>
      </form>
      <p className="text-center text-sm text-slate-600">
        Remember your password?{' '}
        <Link to="/" className="font-medium text-indigo-600 hover:text-indigo-500">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default ForgotPasswordScreen;
