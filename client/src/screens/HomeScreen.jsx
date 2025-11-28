import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
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
  ShoppingBag,
  Box
} from 'lucide-react';

// --- ANIMATED COUNTER ---
// Simple fade-in implementation to keep it lightweight
const AnimatedCounter = ({ value }) => (
  <motion.span 
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, ease: "easeOut" }}
  >
    {value}
  </motion.span>
);

// --- FEATURE PILL ---
const FeaturePill = ({ icon: Icon, text }) => (
  <motion.div 
    whileHover={{ scale: 1.05 }}
    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 border border-border/50 text-xs font-bold text-muted-foreground backdrop-blur-md uppercase tracking-wider cursor-default"
  >
    <Icon size={12} className="text-primary" /> {text}
  </motion.div>
);

// --- STEP CARD ---
const StepCard = ({ number, title, description, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="relative p-6 rounded-[2rem] border border-border/50 bg-background/40 backdrop-blur-md hover:bg-background/60 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
  >
    <div className="absolute -top-4 -left-4 w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform">
      {number}
    </div>
    <h3 className="text-xl font-display font-bold text-foreground mt-4 mb-2">{title}</h3>
    <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
  </motion.div>
);

// --- VIDEO SHOWCASE ---
const VideoShowcase = () => {
  const [activeTab, setActiveTab] = useState('consumer'); 

  const content = {
    consumer: {
      title: "Scan. Verify. Earn.",
      description: "See how easy it is for a shopper to verify a product in seconds using the Verifi mobile app.",
      videoPlaceholder: "bg-gradient-to-br from-emerald-900/80 to-black", 
      icon: <Smartphone size={20} />,
      color: "text-emerald-500"
    },
    business: {
      title: "Track. Manage. Secure.",
      description: "Watch how Manufacturers and Distributors track inventory movement and spot counterfeits in real-time.",
      videoPlaceholder: "bg-gradient-to-br from-blue-900/80 to-black",
      icon: <Factory size={20} />,
      color: "text-blue-500"
    }
  };

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4"
          >
            See Verifi in Action
          </motion.h2>
          
          <div className="inline-flex items-center bg-secondary p-1 rounded-full border border-border mt-6">
            <button 
              onClick={() => setActiveTab('consumer')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                activeTab === 'consumer' 
                  ? 'bg-background text-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Smartphone size={16} /> Consumer
            </button>
            <button 
              onClick={() => setActiveTab('business')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                activeTab === 'business' 
                  ? 'bg-background text-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Layers size={16} /> Partners
            </button>
          </div>
        </div>

        <div className="relative max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="p-2 rounded-[2.5rem] bg-white/5 border border-border/50 shadow-2xl backdrop-blur-sm"
            >
              <div className={`aspect-video rounded-[2rem] overflow-hidden relative flex items-center justify-center group cursor-pointer ${content[activeTab].videoPlaceholder}`}>
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
                
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  className="w-20 h-20 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center z-10"
                >
                  <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg text-black pl-1">
                    <Play size={24} fill="currentColor" />
                  </div>
                </motion.div>

                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent flex justify-between items-end">
                  <div className="text-white max-w-md">
                    <div className={`flex items-center gap-2 mb-2 font-bold ${content[activeTab].color}`}>
                      {content[activeTab].icon} {activeTab === 'consumer' ? 'Consumer App' : 'Logistics Portal'}
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{content[activeTab].title}</h3>
                    <p className="text-white/80 text-sm leading-relaxed">{content[activeTab].description}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

const HomeScreen = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -150]);

  return (
    <div className="min-h-screen w-full bg-background transition-colors duration-500 overflow-x-hidden relative">
      
      {/* --- DYNAMIC BACKGROUND BLOBS (Fixed for Light Mode) --- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div 
          style={{ y: y1, x: -50 }}
          className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-emerald-500/10 rounded-full blur-[100px] dark:bg-emerald-500/5" 
        />
        <motion.div 
          style={{ y: y2, x: 50 }}
          className="absolute top-[20%] right-[-10%] w-[45vw] h-[45vw] bg-blue-500/10 rounded-full blur-[100px] dark:bg-blue-500/5" 
        />
      </div>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 px-6 md:pt-40 md:pb-32 max-w-7xl mx-auto z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left: Copy & CTA */}
          <div className="text-left">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-wrap gap-3 mb-6"
            >
              <FeaturePill icon={ShieldCheck} text="Bank-Grade Security" />
              <FeaturePill icon={Globe} text="Global Tracking" />
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-5xl md:text-7xl font-display font-extrabold tracking-tight mb-6 leading-[1.1] text-foreground"
            >
              Trust is <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600">
                Verifiable.
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed max-w-lg font-light"
            >
              The digital standard for supply chain integrity. We help brands eliminate counterfeits and empower consumers with instant cryptographic verification.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <Link
                to="/register"
                className="group flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-2xl text-lg font-bold shadow-lg shadow-primary/25 hover:scale-105 hover:shadow-xl transition-all"
              >
                Start Free 
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="flex items-center justify-center gap-2 px-8 py-4 bg-background border border-border text-foreground rounded-2xl text-lg font-bold hover:bg-secondary transition-all group"
              >
                <Play size={18} className="fill-current opacity-50 group-hover:opacity-100 transition-opacity" />
                Live Demo
              </Link>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="border-t border-border pt-6"
            >
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Trusted by industry leaders</p>
              <div className="flex gap-6 opacity-40 grayscale mix-blend-multiply dark:mix-blend-screen">
                {/* Simulated Logos */}
                {[1,2,3,4].map(i => (
                   <div key={i} className="h-8 w-24 bg-foreground/20 rounded animate-pulse"></div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right: The Original 3D Visual (Restored & Enhanced) */}
          <div className="relative z-10 lg:h-[600px] flex items-center justify-center perspective-1000">
            <motion.div 
              animate={{ 
                scale: [1, 1.05, 1],
                opacity: [0.5, 0.8, 0.5] 
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-blue-500/20 rounded-full blur-[80px]" 
            />
            
            <motion.div 
              initial={{ y: 50, opacity: 0, rotateX: 10 }}
              animate={{ y: 0, opacity: 1, rotateX: 0 }}
              transition={{ duration: 1, type: "spring", bounce: 0.4 }}
              className="relative w-full max-w-md"
            >
              {/* MAIN CARD */}
              <motion.div 
                whileHover={{ rotateY: 5, rotateX: 5 }}
                className="bg-background/60 backdrop-blur-xl p-6 rounded-[2.5rem] border border-border shadow-2xl relative overflow-hidden transform transition-transform"
              >
                {/* Card Header */}
                <div className="flex justify-between items-center mb-8 opacity-50">
                  <div className="w-12 h-4 bg-foreground/20 rounded-full" />
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-foreground/20" />
                    <div className="w-2 h-2 rounded-full bg-foreground/20" />
                  </div>
                </div>

                {/* Scan Area */}
                <div className="relative aspect-square bg-black/5 dark:bg-black/40 rounded-[2rem] border-2 border-dashed border-border mb-6 overflow-hidden flex items-center justify-center">
                  <ScanLine size={64} className="text-muted-foreground/30" />
                  
                  {/* Moving Laser Line */}
                  <motion.div 
                    className="absolute top-0 left-0 right-0 h-0.5 bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.8)]"
                    animate={{ top: ["10%", "90%", "10%"] }}
                    transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
                  />

                  {/* Success Overlay */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1.5, duration: 0.5 }}
                    className="absolute inset-0 bg-background/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center"
                  >
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 1.6 }}
                      className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-white mb-4 shadow-lg shadow-emerald-500/40"
                    >
                      <CheckCircle2 size={32} strokeWidth={3} />
                    </motion.div>
                    <h3 className="text-xl font-bold text-foreground">Authentic</h3>
                    <p className="text-xs text-muted-foreground mt-1">Batch #2024-X92 Verified</p>
                  </motion.div>
                </div>

                {/* Card Footer Lines */}
                <div className="space-y-3">
                  <div className="h-3 w-full bg-secondary rounded-full" />
                  <div className="h-3 w-2/3 bg-secondary rounded-full" />
                </div>
              </motion.div>

              {/* Floating Stat Cards (Original Style) */}
              <motion.div 
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1, y: [0, -15, 0] }}
                transition={{ 
                  x: { duration: 0.8, delay: 0.8 },
                  y: { duration: 6, repeat: Infinity, ease: "easeInOut" }
                }}
                className="absolute -right-4 top-20 bg-background/80 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-border hidden md:block"
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
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1, y: [0, 15, 0] }}
                transition={{ 
                  x: { duration: 0.8, delay: 1 },
                  y: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
                }}
                className="absolute -left-8 bottom-32 bg-background/80 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-border hidden md:block"
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
      <div className="border-y border-border bg-secondary/30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { label: 'Products Secured', value: '10M+' },
            { label: 'Fake Attempts Blocked', value: '50k+' },
            { label: 'Partner Brands', value: '200+' },
            { label: 'System Uptime', value: '99.9%' },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="text-3xl md:text-4xl font-display font-black text-foreground mb-1">
                <AnimatedCounter value={stat.value} />
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* --- VIDEO SHOWCASE --- */}
      <VideoShowcase />

      {/* --- HOW IT WORKS --- */}
      <section className="py-24 relative bg-secondary/20">
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
              description="Manufacturers upload production data. Verifi generates cryptographically unique IDs for every single item."
              delay={0.1}
            />
            <StepCard 
              number="2"
              title="Label Products"
              description="Apply our secure QR codes to your packaging. These codes link the physical product to its digital twin."
              delay={0.2}
            />
            <StepCard 
              number="3"
              title="Verify Instantly"
              description="Consumers and regulators scan products using any smartphone camera to view the immutable chain of custody."
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* --- ECOSYSTEM SECTION --- */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-foreground">A Unified Ecosystem</h2>
            <p className="text-muted-foreground mt-2">Connecting every stakeholder in the supply chain.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {[
              { icon: Factory, title: "Manufacturers", desc: "Protect revenue.", color: "blue" },
              { icon: Truck, title: "Distributors", desc: "Secure inventory.", color: "purple" },
              { icon: ShoppingBag, title: "Retailers", desc: "Source verified stock.", color: "orange" },
              { icon: Smartphone, title: "Consumers", desc: "Earn rewards.", color: "emerald" },
            ].map((card, i) => (
              <Link 
                key={i} 
                to="/register" 
                className="group relative overflow-hidden p-8 rounded-[2rem] border border-border bg-background/50 hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className={`w-14 h-14 rounded-2xl bg-${card.color}-500/10 text-${card.color}-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <card.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{card.title}</h3>
                <p className="text-sm text-muted-foreground mb-6">{card.desc}</p>
                <div className="flex items-center gap-1 text-sm font-bold text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                  Get Started <ChevronRight size={16} />
                </div>
              </Link>
            ))}

          </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="py-32 px-6 text-center relative overflow-hidden">
        {/* Simple Glow Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-8">
            Ready to secure the future?
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/register"
              className="px-10 py-4 bg-foreground text-background rounded-2xl font-bold hover:opacity-90 transition-opacity shadow-xl"
            >
              Get Started for Free
            </Link>
            <Link
              to="/contact"
              className="px-10 py-4 bg-transparent border-2 border-border hover:border-foreground/50 text-foreground rounded-2xl font-bold transition-all"
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