import React from 'react';
import { FileText } from 'lucide-react';

const Terms = () => {
  return (
    <div className="min-h-screen w-full bg-background bg-gradient-mesh dark:bg-gradient-mesh-dark p-4 md:p-8 pt-24 transition-colors duration-500">
      <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold text-foreground mb-2">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="glass rounded-[2.5rem] p-8 md:p-12 shadow-xl">
          <div className="prose dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
            <p className="mb-6">
              Welcome to Verifi. By accessing or using our website, mobile application, or services, you agree to be bound by these Terms of Service.
            </p>

            <h3 className="text-xl font-bold text-foreground mt-8 mb-4 flex items-center gap-2">
              <FileText size={20} className="text-primary"/> 1. Acceptance of Terms
            </h3>
            <p>
              By accessing and using Verifi, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
            </p>

            <h3 className="text-xl font-bold text-foreground mt-8 mb-4 flex items-center gap-2">
              <FileText size={20} className="text-primary"/> 2. Manufacturer Responsibilities
            </h3>
            <ul className="list-disc pl-5 space-y-2 marker:text-primary">
              <li>Manufacturers must provide accurate, truthful product data.</li>
              <li>Falsifying batch records or expiry dates is a violation of platform policy and local laws.</li>
              <li>You are responsible for the security of your account credentials to prevent unauthorized batch generation.</li>
            </ul>

            <h3 className="text-xl font-bold text-foreground mt-8 mb-4 flex items-center gap-2">
              <FileText size={20} className="text-primary"/> 3. Consumer Usage
            </h3>
            <p>
              Consumers agree to use the scanning feature for personal verification purposes only. Any attempt to reverse-engineer the verification algorithm or spam the network with fake scans will result in account suspension.
            </p>

            <div className="mt-12 pt-8 border-t border-border/50 text-sm text-center">
              <p>Questions? Contact us at <a href="mailto:legal@verifi.ng" className="text-primary hover:underline">legal@verifi.ng</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;