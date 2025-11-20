import React from 'react';

const DocSection = ({ title, children }) => (
  <div className="mb-12">
    <h2 className="text-2xl font-bold text-slate-900 mb-4 border-b border-slate-200 pb-2">{title}</h2>
    <div className="text-slate-600 leading-relaxed space-y-4">
      {children}
    </div>
  </div>
);

const Docs = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-200">
        <div className="text-center mb-12">
          <span className="text-emerald-600 font-bold tracking-wider uppercase text-xs">Developer Resources</span>
          <h1 className="text-4xl font-extrabold text-slate-900 mt-2">Documentation</h1>
          <p className="text-slate-500 mt-4">Technical guides and API references for integrating with Verifi.</p>
        </div>

        <DocSection title="1. Introduction">
          <p>
            Verifi provides a decentralized verification layer for supply chains. Our platform allows manufacturers to serialize products 
            and consumers to verify authenticity via a public ledger.
          </p>
          <p>
            These docs cover the usage of our web platform and the underlying REST API.
          </p>
        </DocSection>

        <DocSection title="2. Manufacturer Onboarding">
          <p>To start registering products, you must have a verified Manufacturer account.</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Step 1:</strong> Register an account and select "Manufacturer" role.</li>
            <li><strong>Step 2:</strong> Complete your Organization Profile in settings.</li>
            <li><strong>Step 3:</strong> Wait for Regulator approval (usually 24-48 hours).</li>
            <li><strong>Step 4:</strong> Once verified, access the Portal to generate batches.</li>
          </ul>
        </DocSection>

        <DocSection title="3. Batch Management API">
          <p>Manufacturers can automate batch creation using our API.</p>
          <div className="bg-slate-900 text-slate-300 p-4 rounded-xl font-mono text-sm overflow-x-auto">
            <p className="text-emerald-400 mb-2">// POST /api/products</p>
            <p>{"{"}</p>
            <p className="pl-4">"batchNumber": "BATCH-2024-001",</p>
            <p className="pl-4">"productName": "Paracetamol 500mg",</p>
            <p className="pl-4">"quantity": 5000,</p>
            <p className="pl-4">"expiryDate": "2026-12-31"</p>
            <p>{"}"}</p>
          </div>
        </DocSection>

        <DocSection title="4. Consumer Verification">
          <p>
            Consumers do not need an account to scan products, but logging in allows them to earn <strong>Trust Points</strong>.
            Scans are geo-tagged to help identify regions with high counterfeit activity.
          </p>
        </DocSection>
      </div>
    </div>
  );
};

export default Docs;