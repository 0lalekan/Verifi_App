import React from 'react';
import { FileText, Gavel, AlertTriangle, Ban, Store } from 'lucide-react';

const Terms = () => {
  return (
    <div className="min-h-screen w-full bg-background bg-gradient-mesh dark:bg-gradient-mesh-dark p-4 md:p-8 pt-24 transition-colors duration-500">
      <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">Terms of Service</h1>
          <p className="text-lg text-muted-foreground">The rules of engagement for the Verifi ecosystem.</p>
        </div>

        <div className="glass rounded-[2.5rem] p-8 md:p-12 shadow-xl space-y-10">
          
          <div>
            <h3 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
              <FileText className="text-primary" /> 1. Account Integrity
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              You agree to provide accurate information during registration. 
              <strong>Manufacturers and Distributors</strong> must provide valid government-issued licenses. 
              Falsifying business credentials will result in an immediate permanent ban and reporting to regulatory authorities.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
              <Store className="text-primary" /> 2. Marketplace & Trade Hub
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-2">
              Verifi acts as a venue to connect verified Manufacturers with Distributors.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground marker:text-primary">
              <li>We do not take possession of goods listed on the Trade Hub.</li>
              <li>All transactions are strictly B2B. Due diligence is the responsibility of the buyer.</li>
              <li>Listings for illegal, restricted, or expired products are prohibited.</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
              <AlertTriangle className="text-primary" /> 3. Safe Map Disclaimer
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              The "Safe Map" aggregates historical scan data to identify low-risk retailers. 
              It is <strong>not a guarantee</strong> of future safety. Verifi is not liable for any counterfeit products purchased from a location marked as "Safe" on the map. Always scan before you use.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
              <Ban className="text-primary" /> 4. Prohibited Conduct
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              You may not:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground marker:text-primary">
              <li>Attempt to reverse-engineer the verification algorithm.</li>
              <li>Spam the system with fake GPS data to manipulate heatmaps.</li>
              <li>Use the platform to distribute malware or malicious code.</li>
            </ul>
          </div>

          <div className="mt-8 pt-8 border-t border-border/50 text-sm text-center text-muted-foreground">
            <p>By using Verifi, you acknowledge that you have read and understood these terms.</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Terms;