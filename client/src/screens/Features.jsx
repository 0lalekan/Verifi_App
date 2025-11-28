import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Zap, 
  Globe, 
  Lock, 
  Smartphone, 
  BarChart3, 
  ScanLine, 
  Users,
  Map,
  Store,
  Truck,
  Play,
  Layers,
  Factory,
  Building2 // New Icon
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

// --- Video Showcase Component (Shared) ---
const VideoShowcase = () => {
  const [activeTab, setActiveTab] = useState('consumer'); // 'consumer' | 'business'

  const content = {
    consumer: {
      title: "Scan. Verify. Earn.",
      description: "See how easy it is for a shopper to verify a product in seconds using the Verifi mobile app.",
      videoPlaceholder: "bg-gradient-to-br from-emerald-900 to-black", 
      icon: <Smartphone size={20} />,
      color: "text-emerald-500"
    },
    business: {
      title: "Track. Manage. Secure.",
      description: "Watch how Manufacturers and Distributors track inventory movement and spot counterfeits in real-time.",
      videoPlaceholder: "bg-gradient-to-br from-blue-900 to-black",
      icon: <Factory size={20} />,
      color: "text-blue-500"
    }
  };

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">Platform Walkthrough</h2>
          <p className="text-muted-foreground">Switch views to see how Verifi works for different users.</p>
          
          {/* Toggle Switch */}
          <div className="inline-flex items-center bg-secondary/50 p-1.5 rounded-full border border-border/50 mt-8 backdrop-blur-md">
            <button 
              onClick={() => setActiveTab('consumer')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                activeTab === 'consumer' 
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
              }`}
            >
              <Smartphone size={16} /> For Consumers
            </button>
            <button 
              onClick={() => setActiveTab('business')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                activeTab === 'business' 
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
              }`}
            >
              <Layers size={16} /> For Partners
            </button>
          </div>
        </div>

        {/* Video Container */}
        <div className="relative max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="glass p-2 rounded-[2.5rem] border-white/10 shadow-2xl"
            >
              <div className={`aspect-video rounded-[2rem] overflow-hidden relative flex items-center justify-center group cursor-pointer ${content[activeTab].videoPlaceholder}`}>
                
                {/* Simulated UI Elements */}
                <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                
                {/* Play Button Overlay */}
                <div className="w-20 h-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 z-10">
                  <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <Play size={24} className="fill-current text-black ml-1" />
                  </div>
                </div>

                <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                  <div className="text-white max-w-md">
                    <div className={`flex items-center gap-2 mb-2 font-bold ${content[activeTab].color}`}>
                      {content[activeTab].icon} {activeTab === 'consumer' ? 'Consumer App' : 'Logistics Portal'}
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{content[activeTab].title}</h3>
                    <p className="text-white/70 text-sm leading-relaxed">{content[activeTab].description}</p>
                  </div>
                </div>

              </div>
            </motion.div>
          </AnimatePresence>
          
          {/* Decorative Glow */}
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-3xl blur-[120px] -z-10 transition-colors duration-700 ${
            activeTab === 'consumer' ? 'bg-emerald-500/20' : 'bg-blue-500/20'
          }`} />
        </div>

      </div>
    </section>
  );
};

const Features = () => {
  return (
    <div className="min-h-screen w-full bg-background bg-gradient-mesh dark:bg-gradient-mesh-dark p-4 md:p-8 pt-24 transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl md:text-6xl font-display font-extrabold text-foreground mb-6 tracking-tight">
            Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-600">Trust</span>.
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            A complete ecosystem designed to eliminate counterfeit goods, protect brand integrity, and empower consumers with cryptographic certainty.
          </p>
        </div>

        {/* Video Showcase Section */}
        <VideoShowcase />

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24 mt-12">
          
          {/* Large Card 1: Anti-Clone */}
          <div className="md:col-span-2 glass-card p-10 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity opacity-50 group-hover:opacity-100" />
            <div className="flex-1 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-6">
                <ScanLine size={32} />
              </div>
              <h3 className="text-2xl font-display font-bold text-foreground mb-4">Anti-Clone Technology</h3>
              <p className="text-muted-foreground leading-relaxed">
                Our intelligent algorithms detect scan velocity anomalies in real-time. If a single QR code is scanned in multiple disparate locations simultaneously, it's instantly flagged as a potential clone.
              </p>
            </div>
            <div className="w-full md:w-1/3 bg-background/50 rounded-2xl h-48 border border-border/50 flex items-center justify-center backdrop-blur-sm shadow-inner">
              <div className="text-center">
                <ShieldCheck size={48} className="text-primary mx-auto mb-2 opacity-80" />
                <span className="text-xs font-bold text-primary uppercase tracking-wider">Secure</span>
              </div>
            </div>
          </div>

          {/* Card 2: Safe Map */}
          <FeatureCard 
            icon={Map}
            title="Verified Safe Map"
            description="Consumers can locate trusted pharmacies and retailers nearby using our GPS heatmap of valid scans. Drive foot traffic to legitimate businesses."
          />

          {/* Card 3: Trade Hub */}
          <FeatureCard 
            icon={Store}
            title="B2B Trade Hub"
            description="A closed marketplace connecting Manufacturers directly to verified Distributors. Eliminate middlemen and reduce the risk of grey market diversion."
          />

          {/* Large Card 2: Logistics */}
          <div className="md:col-span-2 glass-card p-10 flex flex-col md:flex-row-reverse items-center gap-8 relative overflow-hidden group">
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -ml-16 -mb-16 transition-opacity opacity-50 group-hover:opacity-100" />
            <div className="flex-1 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center mb-6">
                <Truck size={32} />
              </div>
              <h3 className="text-2xl font-display font-bold text-foreground mb-4">Chain of Custody</h3>
              <p className="text-muted-foreground leading-relaxed">
                Secure product movement from Factory to Warehouse to Retailer. Distributors scan stock upon receipt to create an immutable digital handover record.
              </p>
            </div>
            <div className="w-full md:w-1/3 bg-background/50 rounded-2xl h-48 border border-border/50 flex items-center justify-center backdrop-blur-sm shadow-inner">
               <div className="text-center">
                <span className="text-4xl font-extrabold text-foreground block mb-1">100%</span>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Traceability</span>
              </div>
            </div>
          </div>

          {/* Card 4: Mobile First */}
          <FeatureCard 
            icon={Smartphone}
            title="Mobile First"
            description="No specialized hardware required. Works on any smartphone with a camera via our lightweight Progressive Web App (PWA)."
          />

          {/* Card 5: Alerts */}
          <FeatureCard 
            icon={BarChart3}
            title="Instant Alerts"
            description="When a fake is detected, the manufacturer and regulator are notified immediately with the GPS location of the incident."
          />

          {/* Card 6: Partner Directory (NEW) */}
          <FeatureCard 
            icon={Building2}
            title="Partner Directory"
            description="Discover verified manufacturers and distributors. Connect via WhatsApp to initiate partnerships and secure supply."
          />

        </div>
      </div>
    </div>
  );
};

export default Features;