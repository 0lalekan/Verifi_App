import React from 'react';
import { Shield, Lock, Eye, Database, Globe, Server } from 'lucide-react';

const Section = ({ icon: Icon, title, children }) => (
  <div className="mb-10">
    <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-3">
      <div className="p-2 bg-primary/10 rounded-lg text-primary">
        <Icon size={20} />
      </div>
      {title}
    </h3>
    <div className="text-muted-foreground leading-relaxed space-y-3 pl-1">
      {children}
    </div>
  </div>
);

const Privacy = () => {
  return (
    <div className="min-h-screen w-full bg-background bg-gradient-mesh dark:bg-gradient-mesh-dark p-4 md:p-8 pt-24 transition-colors duration-500">
      <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">Privacy Policy</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your trust is our currency. Here is how we protect the data that powers the Verifi Network.
          </p>
          <p className="text-xs text-muted-foreground mt-4 uppercase tracking-widest">Last Updated: October 2025</p>
        </div>

        <div className="glass rounded-[2.5rem] p-8 md:p-12 shadow-xl">
          
          <Section icon={Database} title="1. Information We Collect">
            <p>We collect information to ensure the integrity of the supply chain:</p>
            <ul className="list-disc pl-5 space-y-2 marker:text-primary">
              <li><strong>Account Data:</strong> Name, Email, Organization Details (RC Number, License) for Manufacturers/Distributors.</li>
              <li><strong>Scan Data:</strong> GPS Coordinates, Device User-Agent, and Timestamp when you verify a product.</li>
              <li><strong>Transaction Data:</strong> Payment history for subscription plans (processed securely via Flutterwave).</li>
            </ul>
          </Section>

          <Section icon={Globe} title="2. Location Data Usage">
            <p>
              Verifi relies on precise geolocation to detect counterfeit hotspots. 
            </p>
            <ul className="list-disc pl-5 space-y-2 marker:text-primary">
              <li><strong>For Consumers:</strong> Your scan location is anonymized and aggregated to build the "Safe Retailer Map". We never track your movement outside the app.</li>
              <li><strong>For Regulators:</strong> Aggregated heatmaps identify regions with high failure rates for enforcement action.</li>
            </ul>
          </Section>

          <Section icon={Eye} title="3. Data Sharing & Disclosure">
            <p>We do not sell your personal data. We only share data in the following strict scenarios:</p>
            <ul className="list-disc pl-5 space-y-2 marker:text-primary">
              <li><strong>With Regulators:</strong> To report confirmed counterfeit incidents and evidence.</li>
              <li><strong>With Manufacturers:</strong> They receive anonymized analytics (e.g., "500 scans in Lagos") to track inventory flow.</li>
              <li><strong>Legal Requirements:</strong> If compelled by a court order or to prevent imminent physical harm.</li>
            </ul>
          </Section>

          <Section icon={Lock} title="4. Data Security">
            <p>
              We employ military-grade AES-256 encryption for data at rest and TLS 1.3 for data in transit. 
              Critical audit logs are cryptographically chained to prevent tampering.
            </p>
          </Section>

          <div className="mt-12 pt-8 border-t border-border/50 text-center">
            <p className="text-sm text-muted-foreground">
              Questions about your data? Contact our Data Protection Officer at <a href="mailto:privacy@verifi.ng" className="text-primary hover:underline font-bold">privacy@verifi.ng</a>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Privacy;