import React from 'react';

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all">
    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-2xl mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
    <p className="text-slate-500 leading-relaxed">{description}</p>
  </div>
);

const Features = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-slate-900 text-white py-24 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6">Built for Trust</h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          A complete ecosystem designed to eliminate counterfeit goods and protect brand integrity.
        </p>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 py-20 -mt-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon="🛡️"
            title="Anti-Clone Security"
            description="Our intelligent algorithms detect scan velocity anomalies. If a single QR code is scanned in multiple locations simultaneously, it's instantly flagged as a clone."
          />
          <FeatureCard 
            icon="📍"
            title="Geo-Fencing"
            description="Regulators get a 'God View' map of all product scans in real-time. Identify hotspots for fake goods and deploy enforcement teams precisely."
          />
          <FeatureCard 
            icon="🏭"
            title="Batch Serialization"
            description="Manufacturers can generate unique, cryptographically secure batch IDs. Supports bulk CSV uploads for managing thousands of SKUs in seconds."
          />
          <FeatureCard 
            icon="🎁"
            title="Consumer Rewards"
            description="Incentivize verification. Consumers earn loyalty points for every legitimate product scanned, which can be redeemed for discounts."
          />
          <FeatureCard 
            icon="📱"
            title="Mobile First"
            description="No specialized hardware required. Works on any smartphone with a camera via our Progressive Web App (PWA) technology."
          />
          <FeatureCard 
            icon="🔔"
            title="Instant Alerts"
            description="When a fake is detected, the manufacturer and regulator are notified immediately with the GPS location of the incident."
          />
        </div>
      </div>
    </div>
  );
};

export default Features;