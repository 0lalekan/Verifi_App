import React from 'react';
import { Link } from 'react-router-dom';

const HomeScreen = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 relative z-10 text-center">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-medium text-sm tracking-wide animate-pulse">
            🛡️ Official Verification Standard
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
            Secure the Supply Chain.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              Protect Public Health.
            </span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">
            Stop counterfeit goods at the source. Verifi empowers consumers to validate products instantly, helps manufacturers protect their brand, and gives regulators a god-view of the market.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-bold rounded-xl shadow-lg shadow-emerald-500/30 transition-all transform hover:-translate-y-1"
            >
              Get Started Now
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-lg font-semibold rounded-xl backdrop-blur-sm transition-all"
            >
              Live Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Value Proposition Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">A Unified Ecosystem</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Verifi connects all stakeholders in the supply chain to create a transparent, fraud-resistant marketplace.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {/* Consumer Card */}
            <div className="group p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                🤳
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">For Consumers</h3>
              <p className="text-slate-600 leading-relaxed">
                Instantly verify product authenticity by scanning QR codes. Earn loyalty points for every scan and report suspicious items directly to authorities.
              </p>
            </div>

            {/* Manufacturer Card */}
            <div className="group p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                🏭
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">For Manufacturers</h3>
              <p className="text-slate-600 leading-relaxed">
                Register batches securely and track inventory movement. Use our Bulk Upload tool to onboard thousands of products in seconds and stop revenue loss.
              </p>
            </div>

            {/* Regulator Card */}
            <div className="group p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-purple-200 hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-300">
              <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                👁️
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">For Regulators</h3>
              <p className="text-slate-600 leading-relaxed">
                Access a "God View" dashboard of real-time scan data. Identify counterfeit hotspots and act on whistleblower reports with precise geolocation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats / Trust Section */}
      <section className="py-20 bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-bold text-emerald-400 mb-2">100%</div>
              <div className="text-slate-400 text-sm uppercase tracking-wider">Traceability</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-2">50k+</div>
              <div className="text-slate-400 text-sm uppercase tracking-wider">Scans Processed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">24/7</div>
              <div className="text-slate-400 text-sm uppercase tracking-wider">Real-time Monitoring</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-400 mb-2">Zero</div>
              <div className="text-slate-400 text-sm uppercase tracking-wider">Tolerance for Fakes</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeScreen;