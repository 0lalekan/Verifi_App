import React from 'react';
import { 
  ShieldCheck, 
  Zap, 
  Globe, 
  Lock, 
  Smartphone, 
  BarChart3, 
  ScanLine, 
  Users 
} from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description, className }) => (
  <div className={`glass-card p-8 flex flex-col h-full hover:border-primary/30 transition-all group ${className}`}>
    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
      <Icon size={24} />
    </div>
    <h3 className="text-xl font-display font-bold text-foreground mb-3">{title}</h3>
    <p className="text-muted-foreground leading-relaxed text-sm">
      {description}
    </p>
  </div>
);

const Features = () => {
  return (
    <div className="min-h-screen w-full bg-background bg-gradient-mesh dark:bg-gradient-mesh-dark p-4 md:p-8 pt-24 transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-4xl md:text-6xl font-display font-extrabold text-foreground mb-6 tracking-tight">
            Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-600">Trust</span>.
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            A complete ecosystem designed to eliminate counterfeit goods, protect brand integrity, and empower consumers with cryptographic certainty.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          
          {/* Large Card 1 */}
          <div className="md:col-span-2 glass-card p-10 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity opacity-50 group-hover:opacity-100" />
            <div className="flex-1 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-6">
                <ScanLine size={32} />
              </div>
              <h3 className="text-2xl font-display font-bold text-foreground mb-4">Anti-Clone Technology</h3>
              <p className="text-muted-foreground leading-relaxed">
                Our intelligent algorithms detect scan velocity anomalies in real-time. If a single QR code is scanned in multiple disparate locations simultaneously, it's instantly flagged as a potential clone, alerting both the manufacturer and regulator.
              </p>
            </div>
            <div className="w-full md:w-1/3 bg-background/50 rounded-2xl h-48 border border-border/50 flex items-center justify-center backdrop-blur-sm shadow-inner">
              <div className="text-center">
                <ShieldCheck size={48} className="text-primary mx-auto mb-2 opacity-80" />
                <span className="text-xs font-bold text-primary uppercase tracking-wider">Secure</span>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <FeatureCard 
            icon={Globe}
            title="Global Ledger"
            description="Regulators get a 'God View' map of all product scans. Identify hotspots for fake goods and deploy enforcement teams with precision."
          />

          {/* Card 3 */}
          <FeatureCard 
            icon={Lock}
            title="Batch Serialization"
            description="Cryptographically secure batch IDs. Manufacturers can manage millions of SKUs with bulk CSV uploads and instant blockchain registration."
          />

          {/* Large Card 2 */}
          <div className="md:col-span-2 glass-card p-10 flex flex-col md:flex-row-reverse items-center gap-8 relative overflow-hidden group">
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -ml-16 -mb-16 transition-opacity opacity-50 group-hover:opacity-100" />
            <div className="flex-1 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center mb-6">
                <Users size={32} />
              </div>
              <h3 className="text-2xl font-display font-bold text-foreground mb-4">Consumer Rewards</h3>
              <p className="text-muted-foreground leading-relaxed">
                Incentivize verification. Consumers earn loyalty points for every legitimate product scanned, which can be redeemed for discounts or donated to charity.
              </p>
            </div>
            <div className="w-full md:w-1/3 bg-background/50 rounded-2xl h-48 border border-border/50 flex items-center justify-center backdrop-blur-sm shadow-inner">
               <div className="text-center">
                <span className="text-4xl font-extrabold text-foreground block mb-1">500+</span>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Points Earned</span>
              </div>
            </div>
          </div>

          {/* Card 4 */}
          <FeatureCard 
            icon={Smartphone}
            title="Mobile First"
            description="No specialized hardware required. Works on any smartphone with a camera via our lightweight Progressive Web App (PWA)."
          />

          {/* Card 5 */}
          <FeatureCard 
            icon={BarChart3}
            title="Instant Alerts"
            description="When a fake is detected, the manufacturer and regulator are notified immediately with the GPS location of the incident."
          />

          {/* Card 6 */}
          <FeatureCard 
            icon={Zap}
            title="Lightning Fast"
            description="Optimized for low-bandwidth environments. Verification happens in milliseconds, ensuring a smooth user experience."
          />

        </div>
      </div>
    </div>
  );
};

export default Features;