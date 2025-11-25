import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Shield, Zap, Crown } from 'lucide-react';

const PricingCard = ({ tier, price, description, features, recommended, buttonText, link, color }) => (
  <div className={`relative p-8 rounded-[2.5rem] flex flex-col h-full transition-all duration-300 ${
    recommended 
      ? 'bg-background border-2 border-primary shadow-2xl md:scale-105 z-10' 
      : 'glass-card hover:border-primary/30'
  }`}>
    {recommended && (
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wide px-4 py-1.5 rounded-full shadow-lg whitespace-nowrap">
        Most Popular
      </div>
    )}
    
    <div className="mb-8">
      <h3 className={`text-lg font-bold uppercase tracking-wider mb-2 ${color}`}>{tier}</h3>
      <div className="flex items-baseline gap-1">
        <span className="text-4xl font-display font-extrabold text-foreground">{price}</span>
        {price !== 'Free' && <span className="text-muted-foreground font-medium text-sm">/mo</span>}
      </div>
      <p className="text-sm text-muted-foreground mt-4 leading-relaxed">{description}</p>
    </div>

    <ul className="space-y-4 mb-8 flex-1">
      {features.map((feature, index) => (
        <li key={index} className="flex items-start gap-3 text-sm text-foreground/80">
          <div className={`mt-0.5 p-0.5 rounded-full bg-opacity-10 shrink-0 ${color.replace('text-', 'bg-').replace('600', '500')} ${color}`}>
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
            Simple, Transparent <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Pricing</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Start small and scale your production security as you grow. Consumers always verify for free.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">
          
          {/* Starter Plan */}
          <PricingCard 
            tier="Starter"
            price="Free"
            color="text-slate-500"
            description="For small businesses and startups testing the waters."
            features={[
              "5 Batches / month",
              "Max 500 items per batch",
              "Basic Audit Logs",
              "Manual Data Entry",
              "View-Only Marketplace"
            ]}
            buttonText="Start Free"
            link="/register"
          />
          
          {/* Growth Plan */}
          <PricingCard 
            tier="Growth"
            price="₦50,000"
            color="text-blue-600"
            recommended={true}
            description="For growing brands requiring automation and distribution."
            features={[
              "100 Batches / month",
              "Max 10,000 items per batch",
              "Bulk CSV Upload",
              "Post 50 Market Listings",
              "Real-time Fraud Alerts"
            ]}
            buttonText="Get Started"
            link="/register"
          />

          {/* Scale Plan */}
          <PricingCard 
            tier="Scale"
            price="₦150,000"
            color="text-purple-600"
            description="For industrial operations requiring full supply chain visibility."
            features={[
              "Unlimited Batches",
              "Unlimited Market Listings",
              "Full Chain of Custody",
              "Advanced Heatmaps & Analytics",
              "Dedicated Account Manager"
            ]}
            buttonText="Contact Sales"
            link="/contact"
          />
        </div>

        {/* Consumer Note */}
        <div className="mt-20 text-center">
          <p className="text-muted-foreground text-sm bg-secondary/50 inline-block px-6 py-2 rounded-full border border-border">
            Looking for the Consumer App? <Link to="/register" className="text-primary font-bold hover:underline">Sign up for free</Link> to verify products and earn points.
          </p>
        </div>

      </div>
    </div>
  );
};

export default Pricing;