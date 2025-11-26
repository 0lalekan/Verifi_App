import React from 'react';
import { Briefcase, ArrowRight } from 'lucide-react';

const Careers = () => {
  return (
    <div className="min-h-screen w-full bg-background bg-gradient-mesh dark:bg-gradient-mesh-dark p-4 md:p-8 pt-24 transition-colors duration-500 flex flex-col items-center text-center">
      
      <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-600 mb-8">
        <Briefcase size={32} />
      </div>

      <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
        Join the Mission
      </h1>
      
      <p className="text-xl text-muted-foreground max-w-2xl mb-12 leading-relaxed">
        We are building the trust layer for the global economy. 
        If you are passionate about cryptography, supply chains, or saving lives from counterfeit drugs, we want you.
      </p>

      <div className="glass rounded-[2.5rem] p-12 max-w-3xl w-full">
        <h3 className="text-2xl font-bold text-foreground mb-2">No Open Roles Yet</h3>
        <p className="text-muted-foreground mb-8">
          We are currently fully staffed, but we are always looking for exceptional talent.
        </p>
        
        <div className="p-6 bg-secondary/50 rounded-2xl border border-border/50 text-left">
          <p className="font-bold text-foreground mb-1">Future Roles:</p>
          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
            <li>Full Stack Engineer (MERN)</li>
            <li>Enterprise Sales Manager</li>
            <li>Supply Chain Analyst</li>
          </ul>
        </div>

        <div className="mt-8">
          <a href="mailto:careers@verifi.ng" className="inline-flex items-center text-primary font-bold hover:underline">
            Send us your CV <ArrowRight size={16} className="ml-2" />
          </a>
        </div>
      </div>

    </div>
  );
};

export default Careers;