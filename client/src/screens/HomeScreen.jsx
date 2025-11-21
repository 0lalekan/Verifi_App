import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, Globe, ChevronRight } from 'lucide-react';

const HomeScreen = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground transition-colors duration-300">
      
      {/* Background Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-brand-500/20 rounded-full blur-[120px] -z-10 opacity-50 dark:opacity-20 animate-pulse" />
      
      {/* Hero */}
      <section className="pt-48 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Removed System Operational Badge */}

          <h1 className="text-6xl md:text-9xl font-display font-extrabold tracking-tight mb-8 leading-[0.9] animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Trust is <br/>
            {/* Using the class from index.css for correct Light/Dark contrast */}
            <span className="text-gradient">
              Verifiable.
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed font-light animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
            The modern standard for supply chain integrity. Protect your brand and public health with cryptographic product verification.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6 animate-in fade-in zoom-in duration-1000 delay-300">
            <Link
              to="/register"
              className="group flex items-center justify-center gap-2 px-10 py-5 bg-foreground text-background rounded-full text-xl font-bold hover:scale-105 transition-all shadow-2xl hover:shadow-brand-500/20"
            >
              Start Now 
              <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/login"
              className="px-10 py-5 bg-secondary/50 border border-border text-secondary-foreground rounded-full text-xl font-semibold hover:bg-secondary transition-all backdrop-blur-sm"
            >
              Live Demo
            </Link>
          </div>

        </div>
      </section>

      {/* Features - Bento Strip */}
      <section className="py-32 border-t border-border/40 bg-background/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-16">
           {/* ... Features remain the same ... */}
           <div className="flex flex-col items-center text-center group">
             <div className="w-20 h-20 bg-brand-500/10 text-brand-600 dark:text-brand-400 rounded-[2rem] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
               <ShieldCheck size={40} />
             </div>
             <h3 className="text-2xl font-bold mb-3">Anti-Counterfeit</h3>
             <p className="text-muted-foreground text-lg leading-relaxed">
               Real-time clone detection algorithms that flag suspicious scan velocity instantly.
             </p>
           </div>
           
           <div className="flex flex-col items-center text-center group">
             <div className="w-20 h-20 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-[2rem] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
               <Zap size={40} />
             </div>
             <h3 className="text-2xl font-bold mb-3">Instant Verify</h3>
             <p className="text-muted-foreground text-lg leading-relaxed">
               Works on any smartphone camera. No specialized hardware required.
             </p>
           </div>

           <div className="flex flex-col items-center text-center group">
             <div className="w-20 h-20 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-[2rem] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
               <Globe size={40} />
             </div>
             <h3 className="text-2xl font-bold mb-3">Global Ledger</h3>
             <p className="text-muted-foreground text-lg leading-relaxed">
               Regulators get a "God View" map of supply chain movements and hotspots.
             </p>
           </div>
        </div>
      </section>
    </div>
  );
};

export default HomeScreen;