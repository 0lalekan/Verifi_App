import React from 'react';
import { Link } from 'react-router-dom';

const PricingCard = ({ tier, price, features, recommended, buttonText, link }) => (
  <div className={`relative p-8 bg-white rounded-3xl border ${recommended ? 'border-blue-500 shadow-xl scale-105 z-10' : 'border-slate-200 shadow-sm'} flex flex-col`}>
    {recommended && (
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-xs font-bold uppercase tracking-wide px-4 py-1 rounded-full">
        Most Popular
      </div>
    )}
    <h3 className="text-lg font-bold text-slate-900 mb-2">{tier}</h3>
    <div className="mb-6">
      <span className="text-4xl font-extrabold text-slate-900">{price}</span>
      {price !== 'Free' && <span className="text-slate-500 font-medium">/month</span>}
    </div>
    <ul className="space-y-4 mb-8 flex-1">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center text-slate-600 text-sm">
          <span className="mr-3 text-emerald-500">✓</span>
          {feature}
        </li>
      ))}
    </ul>
    <Link 
      to={link} 
      className={`w-full py-3 rounded-xl font-bold text-center transition-all ${
        recommended 
          ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30' 
          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
      }`}
    >
      {buttonText}
    </Link>
  </div>
);

const Pricing = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Transparent Pricing</h1>
          <p className="text-slate-500 max-w-xl mx-auto">
            Start securing your supply chain today. No hidden fees. Cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <PricingCard 
            tier="Consumer"
            price="Free"
            features={[
              "Unlimited Product Scans",
              "Fraud Reporting",
              "Earn Loyalty Points",
              "Basic History"
            ]}
            buttonText="Download App"
            link="/register"
          />
          
          <PricingCard 
            tier="Manufacturer"
            price="₦50,000"
            recommended={true}
            features={[
              "Up to 100 Batches/mo",
              "Real-time Analytics Dashboard",
              "Bulk CSV Upload",
              "QR Code Generation",
              "Email Support"
            ]}
            buttonText="Start Free Trial"
            link="/register"
          />

          <PricingCard 
            tier="Enterprise"
            price="Custom"
            features={[
              "Unlimited Batches",
              "API Access",
              "Custom Domain Integration",
              "Dedicated Account Manager",
              "SLA Guarantee"
            ]}
            buttonText="Contact Sales"
            link="/contact"
          />
        </div>
      </div>
    </div>
  );
};

export default Pricing;