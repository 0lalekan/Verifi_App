import React from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

const PricingCard = ({ tier, price, description, features, recommended, buttonText, link }) => (
  <div className={`relative p-8 rounded-[2.5rem] flex flex-col h-full transition-all duration-300 ${
    recommended 
      ? 'bg-background border-2 border-primary shadow-2xl scale-105 z-10' 
      : 'glass-card hover:border-primary/30'
  }`}>
    {recommended && (
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wide px-4 py-1.5 rounded-full shadow-lg">
        Most Popular
      </div>
    )}
    
    <div className="mb-8">
      <h3 className="text-lg font-bold text-muted-foreground uppercase tracking-wider mb-2">{tier}</h3>
      <div className="flex items-baseline gap-1">
        <span className="text-4xl font-display font-extrabold text-foreground">{price}</span>
        {price !== 'Free' && <span className="text-muted-foreground font-medium">/month</span>}
      </div>
      <p className="text-sm text-muted-foreground mt-4 leading-relaxed">{description}</p>
    </div>

    <ul className="space-y-4 mb-8 flex-1">
      {features.map((feature, index) => (
        <li key={index} className="flex items-start gap-3 text-sm text-foreground/80">
          <div className="mt-0.5 p-0.5 rounded-full bg-emerald-500/10 text-emerald-500 shrink-0">
            <Check size={14} strokeWidth={3} />
          </div>
          {feature}
        </li>
      ))}
    </ul>

    <Link 
      to={link} 
      className={`w-full py-4 rounded-xl font-bold text-center transition-all ${
        recommended 
          ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 hover:-translate-y-0.5' 
          : 'bg-secondary text-foreground hover:bg-secondary/80'
      }`}
    >
      {buttonText}
    </Link>
  </div>
);

const Pricing = () => {
  return (
    <div className="min-h-screen w-full bg-background bg-gradient-mesh dark:bg-gradient-mesh-dark p-4 md:p-8 pt-24 transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-4xl md:text-6xl font-display font-extrabold text-foreground mb-6 tracking-tight">
            Transparent <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Pricing</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Start securing your supply chain today. No hidden fees. Cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">
          
          <PricingCard 
            tier="Consumer"
            price="Free"
            description="For individuals who want to verify products and ensure their safety."
            features={[
              "Unlimited Product Scans",
              "Fraud Reporting",
              "Earn Loyalty Points",
              "Personal Scan History",
              "Community Alerts"
            ]}
            buttonText="Get Started"
            link="/register"
          />
          
          <PricingCard 
            tier="Manufacturer"
            price="₦50,000"
            recommended={true}
            description="For brands looking to secure their products and gain supply chain visibility."
            features={[
              "Up to 100,000 Batches/mo",
              "Real-time Analytics Dashboard",
              "Bulk CSV Upload",
              "Dynamic QR Code Generation",
              "Brand Protection Alerts",
              "Priority Email Support"
            ]}
            buttonText="Start Free Trial"
            link="/register"
          />

          <PricingCard 
            tier="Enterprise"
            price="Custom"
            description="For large organizations and regulators requiring dedicated infrastructure."
            features={[
              "Unlimited Batches",
              "Regulator Oversight Tools",
              "API Access & Webhooks",
              "Custom Domain Integration",
              "Dedicated Account Manager",
              "99.9% SLA Guarantee"
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