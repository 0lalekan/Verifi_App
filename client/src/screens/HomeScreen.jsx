import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, Globe, ChevronRight, Lock, Smartphone } from 'lucide-react';

const HomeScreen = () => {
  return (
    <div className="min-h-screen w-full bg-background bg-gradient-mesh dark:bg-gradient-mesh-dark transition-colors duration-500">
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 md:pt-48 md:pb-32">
        <div className="max-w-5xl mx-auto text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
          
          <h1 className="text-5xl md:text-8xl font-display font-extrabold tracking-tight mb-8 leading-[1.1]">
            Trust is <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600">
              Verifiable.
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed font-light">
            The modern standard for supply chain integrity. Protect your brand and public health with cryptographic product verification.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link
              to="/register"
              className="group flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full text-lg font-bold hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 transition-all"
            >
              Start Now 
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 bg-background/50 backdrop-blur-md border border-border text-foreground rounded-full text-lg font-bold hover:bg-secondary transition-all"
            >
              Live Demo
            </Link>
          </div>

        </div>
      </section>

      {/* Features Strip */}
      <section className="py-24 border-t border-border/40 bg-background/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             
             <div className="glass-card p-8 text-center group hover:-translate-y-2 transition-transform duration-300">
               <div className="w-16 h-16 bg-emerald-500/10 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
                 <ShieldCheck size={32} />
               </div>
               <h3 className="text-xl font-display font-bold mb-3 text-foreground">Anti-Counterfeit</h3>
               <p className="text-muted-foreground leading-relaxed">
                 Real-time clone detection algorithms that flag suspicious scan velocity instantly.
               </p>
             </div>
             
             <div className="glass-card p-8 text-center group hover:-translate-y-2 transition-transform duration-300">
               <div className="w-16 h-16 bg-blue-500/10 text-blue-600 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
                 <Zap size={32} />
               </div>
               <h3 className="text-xl font-display font-bold mb-3 text-foreground">Instant Verify</h3>
               <p className="text-muted-foreground leading-relaxed">
                 Works on any smartphone camera. No specialized hardware required.
               </p>
             </div>

             <div className="glass-card p-8 text-center group hover:-translate-y-2 transition-transform duration-300">
               <div className="w-16 h-16 bg-purple-500/10 text-purple-600 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
                 <Globe size={32} />
               </div>
               <h3 className="text-xl font-display font-bold mb-3 text-foreground">Global Ledger</h3>
               <p className="text-muted-foreground leading-relaxed">
                 Regulators get a "God View" map of supply chain movements and hotspots.
               </p>
             </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeScreen;