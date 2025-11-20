import React from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store';

const Footer = () => {
  const { userInfo } = useAuthStore();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold mr-2">V</div>
              <span className="text-2xl font-bold text-white tracking-tight">Verifi</span>
            </div>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              The global standard for product authenticity. Protecting consumers and brands through decentralized verification.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Platform</h3>
            <ul className="space-y-3 text-sm">
              {/* LOGIC CHANGE: Only show Home if NOT logged in */}
              {!userInfo && (
                 <li><Link to="/" className="hover:text-emerald-400 transition-colors">Home</Link></li>
              )}
              
              {userInfo ? (
                // Logged in user sees Dashboard
                <li><Link to="/dashboard" className="hover:text-emerald-400 transition-colors">Dashboard</Link></li>
              ) : (
                // Visitors see Login/Register
                <>
                  <li><Link to="/login" className="hover:text-emerald-400 transition-colors">Login</Link></li>
                  <li><Link to="/register" className="hover:text-emerald-400 transition-colors">Register</Link></li>
                </>
              )}
              
              <li><Link to="/features" className="hover:text-emerald-400 transition-colors">Features</Link></li>
              <li><Link to="/pricing" className="hover:text-emerald-400 transition-colors">Pricing</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Legal</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/privacy" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-emerald-400 transition-colors">Terms of Service</Link></li>
              <li><Link to="/docs" className="hover:text-emerald-400 transition-colors">Documentation</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/contact" className="hover:text-emerald-400 transition-colors flex items-center">
                  <span className="mr-2">📧</span> Contact Support
                </Link>
              </li>
              <li className="flex items-center text-slate-500 cursor-default">
                <span className="mr-2">🏢</span> Lagos, Nigeria
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Verifi Systems. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;