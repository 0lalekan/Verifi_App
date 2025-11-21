import React from 'react';
import { Shield, Lock, Eye } from 'lucide-react';

const Privacy = () => {
  return (
    <div className="min-h-screen w-full bg-background bg-gradient-mesh dark:bg-gradient-mesh-dark p-4 md:p-8 pt-24 transition-colors duration-500">
      <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold text-foreground mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground">We value your trust and data security.</p>
        </div>

        <div className="glass rounded-[2.5rem] p-8 md:p-12 shadow-xl">
          <div className="prose dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
            <p className="mb-6">
              At Verifi, we take your privacy seriously. This policy describes how we collect, use, and protect your data when you use our platform.
            </p>

            <h3 className="text-xl font-bold text-foreground mt-8 mb-4 flex items-center gap-2">
              <Shield size={20} className="text-primary"/> 1. Data Collection
            </h3>
            <p>
              We collect geolocation data during product scans to help identify counterfeit hotspots. This data is:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2 marker:text-primary">
              <li><strong>Anonymized:</strong> We do not link scan locations to specific user identities publicly.</li>
              <li><strong>Aggregated:</strong> Data is used to generate heatmaps for regulators.</li>
            </ul>

            <h3 className="text-xl font-bold text-foreground mt-8 mb-4 flex items-center gap-2">
              <Lock size={20} className="text-primary"/> 2. Account Information
            </h3>
            <p>
              For Manufacturers and Regulators, we collect business verification documents (RC Numbers, Licenses) to validate legitimacy. This information is stored encrypted and is only accessible by authorized compliance officers.
            </p>

            <h3 className="text-xl font-bold text-foreground mt-8 mb-4 flex items-center gap-2">
              <Eye size={20} className="text-primary"/> 3. Data Sharing
            </h3>
            <p>
              We do not sell your personal data to third parties. Information is shared only with:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2 marker:text-primary">
              <li><strong>Regulators:</strong> To assist in enforcement actions against counterfeiters.</li>
              <li><strong>Manufacturers:</strong> Limited to aggregate scan data (e.g., "50 scans in Lagos") to help them track inventory flow.</li>
            </ul>

            <div className="mt-12 pt-8 border-t border-border/50 text-sm text-center">
              <p>Last updated: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;