import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ProductVerifyScreen = () => {
  const [isScanning, setIsScanning] = useState(true); // Default to scanning view
  const [result, setResult] = useState(null);

  // Mock verification for UI demo
  const handleSimulatedScan = () => {
    setIsScanning(false);
    setTimeout(() => {
      setResult({ status: 'Valid', product: 'Hennessy VSOP (Batch #9928)' });
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black text-white overflow-hidden">

      {/* 1. The Scanner View */}
      <AnimatePresence>
        {isScanning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative h-full w-full flex flex-col items-center justify-center"
          >
            {/* Camera Feed Placeholder */}
            <div className="absolute inset-0 bg-slate-900 opacity-50" />

            {/* Reticle */}
            <div className="relative z-10 w-72 h-72 border-2 border-white/30 rounded-2xl overflow-hidden">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-verifi-glow -mt-1 -ml-1"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-verifi-glow -mt-1 -mr-1"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-verifi-glow -mb-1 -ml-1"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-verifi-glow -mb-1 -mr-1"></div>

              {/* Laser Animation */}
              <motion.div
                className="w-full h-1 bg-verifi-glow shadow-[0_0_20px_rgba(52,211,153,0.8)]"
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                style={{ position: 'absolute' }}
              />
            </div>

            <p className="relative z-10 mt-8 text-slate-300 font-medium tracking-wide">Align QR code within frame</p>

            <button onClick={handleSimulatedScan} className="relative z-10 mt-8 px-6 py-2 bg-white/10 rounded-full border border-white/20 text-sm">
              Simulate Scan (Dev)
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. The Loading State (Processing) */}
      {!isScanning && !result && (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="w-16 h-16 border-4 border-verifi-glow border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-verifi-glow font-mono">AUTHENTICATING...</p>
        </div>
      )}

      {/* 3. The Result (Mature Success Screen) */}
      {result && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          className="absolute bottom-0 w-full bg-white text-slate-900 rounded-t-3xl p-8 pb-12 shadow-2xl"
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-verifi-success/10 rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl text-verifi-success">✓</span>
            </div>
            <h2 className="text-2xl font-bold text-govt-900">Verified Authentic</h2>
            <p className="text-slate-500 mt-1">{result.product}</p>

            <div className="w-full mt-8 space-y-3">
              <button className="w-full py-4 bg-govt-900 text-white rounded-xl font-semibold shadow-lg hover:bg-govt-800 transition-colors">
                View Certificate
              </button>
              <button onClick={() => {setIsScanning(true); setResult(null);}} className="w-full py-4 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors">
                Scan Another
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ProductVerifyScreen;
