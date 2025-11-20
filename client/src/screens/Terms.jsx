import React from 'react';

const Terms = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Terms of Service</h1>
      <div className="prose prose-slate">
        <p>By using Verifi, you agree to the following terms:</p>
        <ul className="list-disc pl-5 space-y-2 mt-4">
            <li>You will not attempt to generate fake verification codes.</li>
            <li>Manufacturers must provide accurate product metadata.</li>
            <li>Regulators typically have oversight capabilities within their jurisdiction.</li>
        </ul>
      </div>
    </div>
  );
};

export default Terms;