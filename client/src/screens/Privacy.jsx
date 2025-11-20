import React from 'react';

const Privacy = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Privacy Policy</h1>
      <div className="prose prose-slate">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        <p>At Verifi, we take your privacy seriously. This policy describes how we collect, use, and protect your data.</p>
        <h3>1. Data Collection</h3>
        <p>We collect geolocation data during product scans to help identify counterfeit hotspots. This data is anonymized where possible.</p>
        <h3>2. User Accounts</h3>
        <p>Manufacturer and Regulator accounts require verified business identities. Consumer accounts are minimal to encourage usage.</p>
      </div>
    </div>
  );
};

export default Privacy;