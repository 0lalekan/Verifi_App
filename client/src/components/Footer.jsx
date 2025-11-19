import React from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store';

const Footer = ({ userRole }) => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-2">🛡️</span>
              <span className="text-2xl font-bold text-blue-400">Verifi</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Ensuring product authenticity and consumer safety through advanced verification technology.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <span className="sr-only">Facebook</span>
                📘
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <span className="sr-only">Twitter</span>
                🐦
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <span className="sr-only">LinkedIn</span>
                💼
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-400">Quick Links</h3>
            <ul className="space-y-2">
              {(userRole === 'consumer' || !userRole) && (
                <>
                  <li>
                    <Link to="/verify-product" className="text-gray-400 hover:text-white transition-colors">
                      Verify Product
                    </Link>
                  </li>
                  <li>
                    <Link to="/report" className="text-gray-400 hover:text-white transition-colors">
                      Report Issue
                    </Link>
                  </li>
                </>
              )}
              {(userRole === 'manufacturer' || userRole === 'admin') && (
                <>
                  <li>
                    <Link to="/bulk-upload" className="text-gray-400 hover:text-white transition-colors">
                      Bulk Upload
                    </Link>
                  </li>
                  <li>
                    <Link to="/register-batch" className="text-gray-400 hover:text-white transition-colors">
                      Register Batch
                    </Link>
                  </li>
                </>
              )}
              {userRole === 'regulator' && (
                <>
                  <li>
                    <Link to="/regulator/dashboard" className="text-gray-400 hover:text-white transition-colors">
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link to="/regulator-map" className="text-gray-400 hover:text-white transition-colors">
                      Map View
                    </Link>
                  </li>
                </>
              )}
              <li>
                <Link to="/profile" className="text-gray-400 hover:text-white transition-colors">
                  My Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-400">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-400">Stay Updated</h3>
            <p className="text-gray-400 text-sm mb-4">
              Get the latest news about product safety and our features.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-3 py-2 bg-gray-800 text-white rounded-l-md border border-gray-700 focus:outline-none focus:border-blue-400"
              />
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-r-md transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Verifi. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
