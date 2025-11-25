import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Zap, 
  Globe, 
  ChevronRight, 
  Factory, 
  Smartphone, 
  ScanLine, 
  CheckCircle2,
  Play,
  Truck,
  Layers,
  ShoppingBag
} from 'lucide-react';

const FeaturePill = ({ icon: Icon, text }) => (
  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 border border-border/50 text-xs font-bold text-muted-foreground backdrop-blur-md uppercase tracking-wider">
    <Icon size={12} className="text-primary" /> {text}
  </div>
);

const StepCard = ({ number, title, description }) => (
  <div className="relative p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
    <div className="absolute -top-4 -left-4 w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg">
      {number}
    </div>
    <h3 className="text-xl font-bold text-foreground mt-2 mb-2">{title}</h3>
    <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
  </div>
);

// --- NEW: Video Showcase Component ---
const VideoShowcase = () => {
  const [activeTab, setActiveTab] = useState('consumer'); // 'consumer' | 'business'

  const content = {
    consumer: {
      title: "Scan. Verify. Earn.",
      description: "See how easy it is for a shopper to verify a product in seconds using the Verifi mobile app.",
      // Replace with your actual YouTube/Vimeo thumbnail or video URL later
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
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">See Verifi in Action</h2>
          <p className="text-muted-foreground">Experience the platform from every angle.</p>
          
          {/* Toggle Switch */}
          <div className="inline-flex items-center bg-secondary/50 p-1.5 rounded-full border border-border/50 mt-8 backdrop-blur-md">
            <button 
              onClick={() => setActiveTab('consumer')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                activeTab === 'consumer' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Smartphone size={16} /> For Consumers
            </button>
            <button 
              onClick={() => setActiveTab('business')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                activeTab === 'business' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
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
                
                {/* Simulated UI Elements (Replace with real video/image later) */}
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

const HomeScreen = () => {
  return (
    <div className="min-h-screen w-full bg-background bg-gradient-mesh dark:bg-gradient-mesh-dark transition-colors duration-500 overflow-x-hidden">
      
      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 px-6 md:pt-40 md:pb-32 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left: Copy & CTA */}
          <div className="text-left z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="flex flex-wrap gap-3 mb-6">
              <FeaturePill icon={ShieldCheck} text="Bank-Grade Security" />
              <FeaturePill icon={Globe} text="Global Tracking" />
            </div>

            <h1 className="text-5xl md:text-7xl font-display font-extrabold tracking-tight mb-6 leading-[1.1]">
              Trust is <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600">
                Verifiable.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed max-w-lg font-light">
              The digital standard for supply chain integrity. We help brands eliminate counterfeits and empower consumers with instant cryptographic verification.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                to="/register"
                className="group flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-2xl text-lg font-bold hover:scale-105 hover:shadow-xl hover:shadow-primary/20 transition-all"
              >
                Start Free 
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="flex items-center justify-center gap-2 px-8 py-4 bg-background/50 backdrop-blur-md border border-border text-foreground rounded-2xl text-lg font-bold hover:bg-secondary transition-all group"
              >
                <Play size={18} className="fill-current opacity-50 group-hover:opacity-100 transition-opacity" />
                Live Demo
              </Link>
            </div>

            {/* Trusted By Strip */}
            <div className="border-t border-border/50 pt-6">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Trusted by industry leaders</p>
              <div className="flex gap-6 opacity-50 grayscale mix-blend-luminosity">
                <div className="h-8 w-20 bg-foreground/20 rounded"></div>
                <div className="h-8 w-20 bg-foreground/20 rounded"></div>
                <div className="h-8 w-20 bg-foreground/20 rounded"></div>
                <div className="h-8 w-20 bg-foreground/20 rounded"></div>
              </div>
            </div>
          </div>

          {/* Right: Dynamic 3D Visual */}
          <div className="relative z-10 lg:h-[600px] flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-blue-500/20 rounded-full blur-[100px] opacity-60 animate-pulse" />
            
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1 }}
              className="relative w-full max-w-md"
            >
              <div className="glass p-6 rounded-[2.5rem] border-white/20 shadow-2xl relative overflow-hidden">
                
                <div className="flex justify-between items-center mb-8 opacity-50">
                  <div className="w-12 h-4 bg-foreground/20 rounded-full" />
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-foreground/20" />
                    <div className="w-2 h-2 rounded-full bg-foreground/20" />
                  </div>
                </div>

                <div className="relative aspect-square bg-black/5 dark:bg-black/40 rounded-[2rem] border-2 border-dashed border-border mb-6 overflow-hidden flex items-center justify-center">
                  <ScanLine size={64} className="text-muted-foreground/20" />
                  
                  <motion.div 
                    className="absolute top-0 left-0 right-0 h-1 bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.8)]"
                    animate={{ top: ["10%", "90%", "10%"] }}
                    transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
                  />

                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1.5, duration: 0.5 }}
                    className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center"
                  >
                    <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-white mb-4 shadow-lg shadow-emerald-500/40">
                      <CheckCircle2 size={32} strokeWidth={3} />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">Authentic</h3>
                    <p className="text-xs text-muted-foreground mt-1">Batch #2024-X92 Verified</p>
                  </motion.div>
                </div>

                <div className="space-y-3">
                  <div className="h-12 w-full bg-primary/10 rounded-xl animate-pulse" />
                  <div className="h-12 w-full bg-secondary/50 rounded-xl" />
                </div>
              </div>

              {/* Floating Stats */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-8 top-20 glass p-4 rounded-2xl shadow-xl border border-white/20 hidden md:block"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                    <Globe size={20} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-muted-foreground uppercase">Scans Today</div>
                    <div className="text-xl font-display font-bold text-foreground">14,203</div>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -left-8 bottom-32 glass p-4 rounded-2xl shadow-xl border border-white/20 hidden md:block"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-muted-foreground uppercase">Security</div>
                    <div className="text-xl font-display font-bold text-foreground">Active</div>
                  </div>
                </div>
              </motion.div>

            </motion.div>
          </div>
        </div>
      </section>

      {/* --- STATS BANNER --- */}
      <div className="border-y border-border/40 bg-background/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { label: 'Products Secured', value: '10M+' },
            { label: 'Fake Attempts Blocked', value: '50k+' },
            { label: 'Partner Brands', value: '200+' },
            { label: 'System Uptime', value: '99.9%' },
          ].map((stat, i) => (
            <div key={i}>
              <div className="text-3xl md:text-4xl font-display font-black text-foreground mb-1">{stat.value}</div>
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* --- VIDEO SHOWCASE (New) --- */}
      <VideoShowcase />

      {/* --- HOW IT WORKS --- */}
      <section className="py-24 relative bg-secondary/30 border-y border-border/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">Simple Integration.</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We've simplified supply chain security into three steps. No specialized hardware required.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard 
              number="1"
              title="Register Batch"
              description="Manufacturers upload batch data via CSV or API. Verifi generates cryptographically unique IDs for every single item."
            />
            <StepCard 
              number="2"
              title="Label Products"
              description="Apply our secure QR codes to your packaging. These codes link the physical product to its digital twin on the verified ledger."
            />
            <StepCard 
              number="3"
              title="Verify Instantly"
              description="Consumers and regulators scan products using any smartphone camera. No app download required for basic verification."
            />
          </div>
        </div>
      </section>

      {/* --- ECOSYSTEM SECTION (Updated) --- */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-foreground">A Unified Ecosystem</h2>
            <p className="text-muted-foreground">Connecting every stakeholder in the supply chain.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Manufacturers */}
            <div className="glass-card p-8 rounded-[2rem] hover:border-blue-500/30 transition-colors group">
              <div className="w-12 h-12 bg-blue-500/10 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Factory size={24} />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Manufacturers</h3>
              <p className="text-sm text-muted-foreground mb-4">Protect revenue and brand equity with anti-clone technology.</p>
              <Link to="/register" className="text-blue-600 text-sm font-bold hover:underline flex items-center gap-1">Brand Access <ChevronRight size={14}/></Link>
            </div>

            {/* Distributors */}
            <div className="glass-card p-8 rounded-[2rem] hover:border-purple-500/30 transition-colors group">
              <div className="w-12 h-12 bg-purple-500/10 text-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Truck size={24} />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Distributors & Retail</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Secure your imports. Verify incoming stock via the Chain of Custody and source authentic goods from the Trade Hub.
              </p>
              <Link to="/register" className="text-purple-600 text-sm font-bold hover:underline flex items-center gap-1">Partner Access <ChevronRight size={14}/></Link>
            </div>

            {/* Consumers */}
            <div className="glass-card p-8 rounded-[2rem] hover:border-emerald-500/30 transition-colors group">
              <div className="w-12 h-12 bg-emerald-500/10 text-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Smartphone size={24} />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Consumers</h3>
              <p className="text-sm text-muted-foreground mb-4">Verify goods instantly, find safe pharmacies nearby, and earn rewards.</p>
              <Link to="/register" className="text-emerald-600 text-sm font-bold hover:underline flex items-center gap-1">Join Free <ChevronRight size={14}/></Link>
            </div>

          </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="py-32 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
        
        <div className="max-w-4xl mx-auto glass p-12 rounded-[3rem] shadow-2xl relative z-10 border-t-2 border-white/20">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
            Ready to secure the future?
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join the network of verified manufacturers and empowered consumers today.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/register"
              className="px-10 py-4 bg-foreground text-background rounded-2xl font-bold hover:opacity-90 transition-opacity shadow-xl"
            >
              Get Started for Free
            </Link>
            <Link
              to="/contact"
              className="px-10 py-4 bg-transparent border-2 border-foreground/10 hover:border-foreground/30 text-foreground rounded-2xl font-bold transition-all"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomeScreen;