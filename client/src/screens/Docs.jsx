import React from 'react';
import { Book, Code, Terminal, FileText, ChevronRight } from 'lucide-react';

const DocSection = ({ title, children }) => (
  <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <h2 className="text-2xl font-display font-bold text-foreground mb-4 pb-2 border-b border-border/50">{title}</h2>
    <div className="text-muted-foreground leading-relaxed space-y-4">
      {children}
    </div>
  </div>
);

const CodeBlock = ({ title, code }) => (
  <div className="my-6 rounded-2xl overflow-hidden border border-border/50 shadow-lg bg-[#1e1e1e]">
    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border-b border-white/5">
      <div className="flex gap-1.5">
        <div className="w-3 h-3 rounded-full bg-red-500/50" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
        <div className="w-3 h-3 rounded-full bg-green-500/50" />
      </div>
      <span className="ml-2 text-xs text-gray-400 font-mono">{title}</span>
    </div>
    <div className="p-4 overflow-x-auto">
      <pre className="text-sm font-mono text-gray-300">
        <code>{code}</code>
      </pre>
    </div>
  </div>
);

const Docs = () => {
  return (
    <div className="min-h-screen w-full bg-background bg-gradient-mesh dark:bg-gradient-mesh-dark p-4 md:p-8 pt-24 transition-colors duration-500">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Navigation (Desktop) */}
        <div className="hidden lg:block col-span-1">
          <div className="sticky top-32 space-y-1">
            <div className="font-bold text-foreground mb-4 px-3 flex items-center gap-2"><Book size={18}/> Documentation</div>
            {['Introduction', 'Manufacturer Onboarding', 'Batch API', 'Consumer Verification'].map((item, i) => (
              <a key={i} href={`#${item}`} className="block px-3 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-secondary/50 rounded-lg transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="col-span-1 lg:col-span-3">
          <div className="glass rounded-[2.5rem] p-8 md:p-12 shadow-xl">
            
            <div className="mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wide mb-4">
                <Terminal size={14} /> Developer Resources
              </div>
              <h1 className="text-4xl font-display font-extrabold text-foreground mb-4">Verifi Documentation</h1>
              <p className="text-lg text-muted-foreground">
                Comprehensive guides and API references for integrating with the Verifi supply chain protocol.
              </p>
            </div>

            <DocSection title="1. Introduction">
              <p>
                Verifi provides a decentralized verification layer for supply chains. Our platform allows manufacturers to serialize products 
                and consumers to verify authenticity via a public ledger.
              </p>
              <p>
                This documentation covers the usage of our web platform and the underlying REST API for automated integrations.
              </p>
            </DocSection>

            <DocSection title="2. Manufacturer Onboarding">
              <p>To start registering products, you must have a verified Manufacturer account. This ensures the integrity of the root of trust.</p>
              <div className="grid gap-3 mt-4">
                {[
                  "Register an account and select 'Manufacturer' role.",
                  "Complete your Organization Profile in settings with RC Number.",
                  "Wait for Regulator approval (typically 24-48 hours).",
                  "Access the Manufacturer Portal to generate batch identities."
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-secondary/30 border border-border/50">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-sm text-foreground/80">{step}</span>
                  </div>
                ))}
              </div>
            </DocSection>

            <DocSection title="3. Batch Management API">
              <p>
                Manufacturers can automate batch creation using our REST API. This is useful for integrating Verifi directly into your ERP or production line software.
              </p>
              
              <CodeBlock 
                title="POST /api/products"
                code={`// Example Request
{
  "batchNumber": "BATCH-2024-001",
  "productName": "Paracetamol 500mg",
  "quantity": 5000,
  "expiryDate": "2026-12-31",
  "manufacturingDate": "2024-01-15",
  "productAttributes": {
    "factory_id": "LAG-01",
    "line": "A4"
  }
}`} 
              />
            </DocSection>

            <DocSection title="4. Consumer Verification">
              <p>
                Consumers do not need an account to scan products, but logging in allows them to earn <strong>Trust Points</strong>.
                Scans are geo-tagged to help identify regions with high counterfeit activity.
              </p>
              <div className="mt-4 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-sm">
                <strong>Note:</strong> Location data is anonymized and aggregated for privacy protection.
              </div>
            </DocSection>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Docs;