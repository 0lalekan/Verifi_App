import React, { useState, useRef, useMemo } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import { toast } from 'react-toastify';
import { useZxing } from 'react-zxing';
import { BrowserMultiFormatReader, BarcodeFormat, DecodeHintType } from '@zxing/library';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Image as ImageIcon, 
  Zap, 
  XCircle, 
  CheckCircle2, 
  CameraOff,
  ScanLine,
  Loader2
} from 'lucide-react';

const ConsumerScanScreen = () => {
  const [batchNumber, setBatchNumber] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [isScanning, setIsScanning] = useState(true);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  
  const fileInputRef = useRef(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const scanHints = useMemo(() => new Map([
    [DecodeHintType.TRY_HARDER, true],
    [DecodeHintType.POSSIBLE_FORMATS, [
      BarcodeFormat.QR_CODE, 
      BarcodeFormat.CODE_128, 
      BarcodeFormat.EAN_13,
      BarcodeFormat.UPC_A,
      BarcodeFormat.DATA_MATRIX
    ]],
    [DecodeHintType.ASSUME_GS1, true]
  ]), []);

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
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try { navigator.vibrate([100, 50, 100]); } catch (e) { /* ignore */ }
      }
    },
    onError: () => {
      toast.error('Verification failed. Please try again.');
      setIsScanning(true);
    },
  });

  const handleVerify = (code) => {
    if (!code) return;
    setBatchNumber(code);
    
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

  const { ref: cameraRef } = useZxing({
    paused: !isScanning || !!verificationResult,
    constraints: { video: { facingMode: 'environment' } },
    onDecodeResult: (result) => {
      if (isScanning && !verificationResult) {
        setIsScanning(false); 
        handleVerify(result.getText());
      }
    },
    onError: (err) => {
      if (err.name === 'NotAllowedError' || err.name === 'NotFoundError') {
        setCameraError("Camera access denied.");
        setIsScanning(false);
      }
    },
    hints: scanHints
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsProcessingImage(true);
    setIsScanning(false);

    try {
      const reader = new BrowserMultiFormatReader();
      const imageUrl = URL.createObjectURL(file);
      const result = await reader.decodeFromImage(undefined, imageUrl, scanHints);
      if (result) handleVerify(result.getText());
    } catch (error) {
      toast.error('No valid code found.');
      setIsScanning(true);
    } finally {
      setIsProcessingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100dvh-6rem)] px-4 w-full bg-background bg-gradient-mesh dark:bg-gradient-mesh-dark transition-colors duration-500">
      
      <div className="w-full max-w-md mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center gap-4 shrink-0 mb-2">
          <button 
            onClick={() => navigate(-1)}
            className="p-3 rounded-2xl bg-background/50 hover:bg-background/80 border border-border/50 backdrop-blur-md transition-all shadow-sm"
          >
            <ArrowLeft size={20} className="text-foreground" />
          </button>
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Verify Product</h1>
            <p className="text-sm text-muted-foreground">Scan or enter code.</p>
          </div>
        </div>

        {/* Camera Card */}
        <div className="relative w-full aspect-square rounded-[2.5rem] overflow-hidden shadow-2xl border-[4px] border-white/20 dark:border-white/10 bg-black/90 flex items-center justify-center shrink-0">
          
          {!cameraError && !verificationResult && (
            <video ref={cameraRef} className="w-full h-full object-cover" playsInline />
          )}

          {cameraError && (
            <div className="flex flex-col items-center text-center p-6 text-white">
              <CameraOff size={40} className="text-destructive mb-4" />
              <p className="font-bold text-lg">Camera Disabled</p>
              <p className="text-sm opacity-60 mt-2">Enable permissions or use manual entry below.</p>
            </div>
          )}

          {/* Overlay UI */}
          {isScanning && !cameraError && !verificationResult && !isProcessingImage && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-64 h-64 relative">
                 <motion.div 
                   className="absolute w-full h-1 bg-brand-500/80 shadow-[0_0_20px_rgba(16,185,129,1)] rounded-full"
                   animate={{ top: ["10%", "90%", "10%"] }}
                   transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
                 />
                 <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-brand-500 rounded-tl-3xl" />
                 <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-brand-500 rounded-tr-3xl" />
                 <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-brand-500 rounded-bl-3xl" />
                 <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-brand-500 rounded-br-3xl" />
              </div>
              <div className="absolute bottom-8 bg-black/50 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10">
                <span className="text-white text-xs font-bold tracking-widest uppercase">Align Code</span>
              </div>
            </div>
          )}

          {isProcessingImage && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-20">
              <Loader2 size={48} className="text-brand-500 animate-spin mb-4" />
              <p className="text-white font-bold">Processing...</p>
            </div>
          )}
        </div>

        {/* Manual Input */}
        {!verificationResult && (
          <div className="glass p-1.5 rounded-[1.5rem] flex items-center gap-2">
            <div className="relative flex-1">
              <ScanLine size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Enter Batch Number"
                className="w-full h-14 pl-12 pr-4 rounded-2xl bg-transparent border-none text-foreground font-bold text-lg focus:ring-0 outline-none"
                value={batchNumber}
                onChange={e => setBatchNumber(e.target.value)}
              />
            </div>
            <button 
              onClick={() => handleVerify(batchNumber)}
              disabled={!batchNumber}
              className="h-14 px-6 bg-primary text-primary-foreground rounded-2xl font-bold shadow-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Verify
            </button>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="h-14 w-14 flex items-center justify-center bg-secondary text-foreground rounded-2xl hover:bg-secondary/80 transition-all"
            >
              <ImageIcon size={24} />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </div>
        )}

        {/* Result Modal */}
        <AnimatePresence>
          {verificationResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
            >
              <div className="w-full max-w-sm bg-background rounded-[2.5rem] shadow-2xl border border-border p-8 text-center relative overflow-hidden">
                
                {verificationResult.status === 'Valid' ? (
                  <>
                    <Confetti numberOfPieces={200} recycle={false} className="!absolute !inset-0 !w-full !h-full pointer-events-none" />
                    <div className="w-20 h-20 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-emerald-500/5">
                      <CheckCircle2 size={40} strokeWidth={3} />
                    </div>
                    <h2 className="text-3xl font-display font-bold text-emerald-600 mb-2">Authentic</h2>
                    <p className="text-lg font-semibold text-foreground mb-8">{verificationResult.product?.productName}</p>
                    
                    <div className="bg-secondary/50 rounded-2xl p-5 border border-border space-y-3 mb-8 text-left">
                      <div className="flex justify-between">
                        <span className="text-xs font-bold text-muted-foreground uppercase">Batch</span>
                        <span className="text-sm font-mono font-bold text-foreground">{batchNumber}</span>
                      </div>
                      <div className="h-px bg-border/50" />
                      <div className="flex justify-between">
                        <span className="text-xs font-bold text-muted-foreground uppercase">Expiry</span>
                        <span className="text-sm font-bold text-foreground">
                          {verificationResult.product?.expiryDate ? new Date(verificationResult.product.expiryDate).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* DYNAMIC ERROR STATE */}
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 animate-pulse ${
                      verificationResult.status === 'Expired' ? 'bg-amber-500/10 text-amber-600 ring-amber-500/5' : 'bg-red-500/10 text-red-600 ring-red-500/5'
                    }`}>
                      {verificationResult.status === 'Expired' ? <Zap size={40} /> : <XCircle size={40} strokeWidth={3} />}
                    </div>
                    
                    <h2 className={`text-3xl font-display font-bold mb-2 ${
                      verificationResult.status === 'Expired' ? 'text-amber-600' : 'text-red-600'
                    }`}>
                      {verificationResult.status}
                    </h2>
                    
                    <p className="text-muted-foreground mb-8 leading-relaxed">
                      {/* Display the specific warning message from backend, or a default fallback */}
                      {verificationResult.message || "This code is not recognized. It may be a counterfeit product."}
                    </p>
                    
                    <button 
                      onClick={() => navigate('/report')}
                      className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-lg shadow-red-500/20 mb-3"
                    >
                      Report Issue
                    </button>
                  </>
                )}

                <button 
                  onClick={() => { setVerificationResult(null); setIsScanning(true); setBatchNumber(''); }}
                  className="w-full py-3.5 bg-secondary hover:bg-secondary/80 text-foreground rounded-xl font-bold"
                >
                  Scan Next
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default ConsumerScanScreen;