import React, { useState, useRef, useMemo } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import { toast } from 'react-toastify';
import { useZxing } from 'react-zxing';
import { BrowserMultiFormatReader, BarcodeFormat, DecodeHintType } from '@zxing/library';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { useNavigate } from 'react-router-dom';

const ConsumerScanScreen = () => {
  const [batchNumber, setBatchNumber] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [isScanning, setIsScanning] = useState(true);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  
  const fileInputRef = useRef(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // --- FIX #1: Expanded Formats to include UPC and others ---
  const scanHints = useMemo(() => new Map([
    [DecodeHintType.TRY_HARDER, true],
    [DecodeHintType.POSSIBLE_FORMATS, [
      BarcodeFormat.QR_CODE, 
      BarcodeFormat.CODE_128, 
      BarcodeFormat.EAN_13,
      BarcodeFormat.EAN_8,        // Added
      BarcodeFormat.DATA_MATRIX,
      BarcodeFormat.CODE_39,
      BarcodeFormat.UPC_A,        // Added (Critical for many products)
      BarcodeFormat.UPC_E,        // Added
      BarcodeFormat.ITF           // Added
    ]],
    
    [DecodeHintType.CHARACTER_SET, 'UTF-8'],
    [DecodeHintType.ASSUME_GS1, true]
  ]), []);

  // --- API Mutation ---
  const mutation = useMutation({
    mutationFn: async ({ batchNumber, latitude, longitude, accuracy }) => {
      const response = await api.post('/products/verify', {
        batchNumber, latitude, longitude, accuracy,
      });
      return response.data;
    },
    onSuccess: (data) => {
      setVerificationResult(data);
      setIsScanning(false);
      queryClient.invalidateQueries(['userProfile']); 
      if (navigator.vibrate) navigator.vibrate(200);
    },
    onError: () => {
      toast.error('Verification failed. Please try again.');
      setIsScanning(true);
    },
  });

  // --- Handlers ---
  const handleVerify = (code) => {
    if (!code) return;
    setBatchNumber(code);
    
    // Get Geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => mutation.mutate({ 
          batchNumber: code, 
          latitude: pos.coords.latitude, 
          longitude: pos.coords.longitude, 
          accuracy: pos.coords.accuracy 
        }),
        () => mutation.mutate({ batchNumber: code }) 
      );
    } else {
      mutation.mutate({ batchNumber: code });
    }
  };

  // --- Camera Scanner ---
  const { ref: cameraRef } = useZxing({
    paused: !isScanning,
    constraints: { 
      video: { facingMode: 'environment' } 
    },
    onDecodeResult: (result) => {
      const text = result.getText();
      if (isScanning) {
        setIsScanning(false); 
        handleVerify(text);
      }
    },
    hints: scanHints
  });

  // --- Image Upload Handler ---
  const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setIsProcessingImage(true);
  setIsScanning(false);

  try {
    const reader = new BrowserMultiFormatReader();
    const imageUrl = URL.createObjectURL(file);

    // Correct way: pass hints as the 3rd argument
    const result = await reader.decodeFromImage(undefined, imageUrl, scanHints);

    if (result) {
      handleVerify(result.getText());
    }
  } catch (error) {
    console.error(error);
    toast.error('No code found. Ensure the image is clear and contains a valid barcode.');
    setIsScanning(true);
  } finally {
    setIsProcessingImage(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }
};


  return (
    <div className="fixed inset-0 bg-black text-white overflow-hidden flex flex-col h-[100dvh]">
      
      {/* --- Result Overlay (Success/Fail) --- */}
      <AnimatePresence>
        {verificationResult && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="absolute z-50 inset-x-0 bottom-0 h-[85vh] bg-white rounded-t-[2.5rem] p-8 text-slate-900 flex flex-col items-center shadow-[0_-20px_60px_rgba(0,0,0,0.5)]"
          >
            <div className="w-16 h-1.5 bg-slate-200 rounded-full mb-8"></div>

            {verificationResult.status === 'Valid' ? (
              <>
                <Confetti numberOfPieces={200} recycle={false} className="!absolute !w-full !h-full" />
                <motion.div 
                  initial={{ scale: 0 }} animate={{ scale: 1 }} 
                  className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-5xl mb-6 shadow-lg shadow-emerald-100"
                >
                  ✅
                </motion.div>
                <h2 className="text-3xl font-extrabold text-emerald-600 mb-2 tracking-tight">Authentic</h2>
                <p className="text-slate-500 text-center mb-8 text-lg">
                  {verificationResult.product?.productName || 'Verified Product'} <br/>
                  <span className="text-sm font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded mt-2 inline-block">
                    {batchNumber}
                  </span>
                </p>
                
                <div className="w-full bg-slate-50 rounded-2xl p-6 mb-auto space-y-4 border border-slate-100">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-medium">Expiry Date</span>
                    <span className="font-bold text-slate-800">
                      {verificationResult.product?.expiryDate 
                        ? new Date(verificationResult.product.expiryDate).toLocaleDateString() 
                        : 'N/A'}
                    </span>
                  </div>
                  <div className="h-px bg-slate-200"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-medium">Reward</span>
                    <span className="font-bold text-emerald-600 flex items-center gap-1">
                      +{verificationResult.pointsEarned} Points ✨
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <motion.div 
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center text-5xl mb-6 shadow-lg shadow-red-100"
                >
                  🚨
                </motion.div>
                <h2 className="text-3xl font-extrabold text-red-600 mb-2 tracking-tight">STOP</h2>
                <h3 className="text-xl font-bold text-slate-800 mb-4">Status: {verificationResult.status}</h3>
                <p className="text-slate-500 text-center mb-8 leading-relaxed">
                  This batch number was NOT found in the official registry or has been flagged. 
                  <strong> Do not use this product.</strong>
                </p>
                <button 
                  onClick={() => navigate('/report')}
                  className="w-full py-4 bg-red-600 text-white rounded-xl font-bold text-lg hover:bg-red-700 transition-all shadow-xl shadow-red-500/20 mb-auto active:scale-95"
                >
                  Report This Item
                </button>
              </>
            )}

            <button 
              onClick={() => { setVerificationResult(null); setIsScanning(true); setBatchNumber(''); }}
              className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-lg hover:bg-slate-800 transition-all active:scale-95"
            >
              Scan Next Item
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Camera Viewport --- */}
      <div className="relative flex-1 bg-black min-h-0 overflow-hidden">
        {/* FIX #2: Changed opacity-90 to opacity-100 for maximum clarity */}
        <video ref={cameraRef} className="w-full h-full object-cover opacity-100" />
        
        {/* Visual Guides */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 pointer-events-none">
          {/* FIX #3: Removed 'backdrop-blur-[2px]' which was blurring the camera view */}
          <div className="relative w-72 h-72 border-2 border-white/30 rounded-3xl overflow-hidden">
            {isScanning && (
              <motion.div
                className="absolute left-0 right-0 h-0.5 bg-emerald-400 shadow-[0_0_30px_3px_rgba(52,211,153,0.6)]"
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 3, ease: "linear", repeat: Infinity }}
              />
            )}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-emerald-500 rounded-tl-lg"></div>
            <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-emerald-500 rounded-tr-lg"></div>
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-emerald-500 rounded-bl-lg"></div>
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-emerald-500 rounded-br-lg"></div>
          </div>
          
          <div className="mt-8 px-6 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10">
            <p className="text-white/90 text-sm font-medium">
              {isProcessingImage ? 'Analyzing Image...' : 'Align QR or Barcode'}
            </p>
          </div>
        </div>
      </div>

      {/* --- Footer Controls --- */}
      {!verificationResult && (
        <div className="bg-slate-900 px-6 pt-6 pb-8 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-10 border-t border-white/10">
          <div className="flex flex-col gap-4">
            
            {/* Manual Entry Form */}
            <form 
              onSubmit={(e) => { e.preventDefault(); handleVerify(batchNumber); }} 
              className="flex gap-3"
            >
              <input
                type="text"
                placeholder="Enter Batch Number"
                value={batchNumber}
                onChange={(e) => setBatchNumber(e.target.value)}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-lg font-mono"
              />
              <button 
                type="submit"
                disabled={mutation.isPending || !batchNumber}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 rounded-xl font-bold transition-all active:scale-95 disabled:opacity-50 disabled:scale-100"
              >
                Check
              </button>
            </form>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-700"></div>
              <span className="flex-shrink mx-4 text-slate-500 text-xs uppercase font-bold tracking-wider">Or Upload</span>
              <div className="flex-grow border-t border-slate-700"></div>
            </div>

            {/* Upload Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-300 font-semibold transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <span className="text-xl">🖼️</span> Upload from Gallery
            </button>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />

          </div>
        </div>
      )}
    </div>
  );
};

export default ConsumerScanScreen;