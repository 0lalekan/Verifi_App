import React from 'react';
import { Shield, Users, Globe, ArrowRight, Target, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const ValueCard = ({ icon: Icon, title, description }) => (
  <div className="glass-card p-8 flex flex-col items-center text-center hover:border-primary/30 transition-all group">
    <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner">
      <Icon size={32} />
    </div>
    <h3 className="text-xl font-display font-bold text-foreground mb-3">{title}</h3>
    <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
  </div>
);

const About = () => {
  return (
    <div className="min-h-screen w-full bg-background bg-gradient-mesh dark:bg-gradient-mesh-dark p-4 md:p-8 pt-24 transition-colors duration-500">
      <div className="max-w-6xl mx-auto">
        
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wide mb-6 border border-primary/20">
            <Shield size={14} /> Our Mission
          </div>
          <h1 className="text-4xl md:text-7xl font-display font-extrabold text-foreground mb-6 tracking-tight leading-[1.1]">
            Securing the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-600">Chain of Trust</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            We are on a mission to eliminate counterfeit products from the global market using blockchain transparency and AI-driven verification.
          </p>
        </div>

        {/* Story Section */}
        <div className="glass rounded-[2.5rem] p-8 md:p-16 mb-24 relative overflow-hidden shadow-2xl animate-in zoom-in-95 duration-700 delay-100">
          {/* Background Decor */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <h2 className="text-3xl font-display font-bold text-foreground mb-6 flex items-center gap-3">
                <Target className="text-primary" /> Who We Are
              </h2>
              <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
                <p>
                  Verifi was founded with a simple yet ambitious goal: to restore faith in the products we use every day. From pharmaceuticals to luxury goods, counterfeiting is a trillion-dollar problem that endangers lives and erodes trust.
                </p>
                <p>
                  We enable manufacturers to create immutable digital twins for their products, allowing consumers to verify authenticity instantly with a smartphone scan.
                </p>
              </div>
              <div className="mt-8">
                <Link to="/contact" className="inline-flex items-center font-bold text-primary hover:text-primary/80 transition-colors group">
                  Get in touch <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
            
            {/* Impact Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card p-6 text-center rounded-3xl border-white/20">
                <div className="text-4xl font-extrabold text-foreground mb-1">10M+</div>
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Products Verified</div>
              </div>
              <div className="glass-card p-6 text-center rounded-3xl mt-8 border-white/20">
                <div className="text-4xl font-extrabold text-foreground mb-1">50+</div>
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Global Brands</div>
              </div>
              <div className="glass-card p-6 text-center rounded-3xl border-white/20">
                <div className="text-4xl font-extrabold text-foreground mb-1">99.9%</div>
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Uptime</div>
              </div>
              <div className="glass-card p-6 text-center rounded-3xl mt-8 border-white/20">
                <div className="text-4xl font-extrabold text-foreground mb-1">24/7</div>
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Support</div>
              </div>
            </div>
          </div>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          <ValueCard 
            icon={Globe}
            title="Transparency"
            description="We believe information should be accessible. Our public ledger ensures that product history is open and verifiable by anyone, anywhere."
          />
          <ValueCard 
            icon={Shield}
            title="Integrity"
            description="Security is not an afterthought. We use military-grade encryption and decentralized consensus to ensure data can never be tampered with."
          />
          <ValueCard 
            icon={Users}
            title="Community"
            description="We empower consumers to be the first line of defense. By rewarding verifications with Trust Points, we build a global network of vigilance."
          />
        </div>

        {/* CTA */}
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-red-500">
            <Heart size={32} fill="currentColor" />
          </div>
          <h2 className="text-3xl font-display font-bold text-foreground mb-6">Ready to join the movement?</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register" className="px-8 py-4 bg-primary text-primary-foreground rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all hover:-translate-y-0.5">
              Create Free Account
            </Link>
            <Link to="/features" className="px-8 py-4 bg-secondary text-foreground rounded-xl font-bold hover:bg-secondary/80 transition-all">
              Explore Features
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;