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
    constraints: { 
      video: { 
        facingMode: 'environment',
        aspectRatio: { ideal: 1 },
        width: { min: 1280, ideal: 1920 },
        height: { min: 720, ideal: 1080 }
      } 
    },
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
    // 1. Static Page Container with Mesh Background
    <div className="flex flex-col items-center justify-center h-[calc(100dvh-6rem)] px-4 w-full overflow-hidden bg-background bg-gradient-mesh dark:bg-gradient-mesh-dark bg-fixed transition-colors duration-500">
      
      <div className="w-full max-w-md mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center gap-4 shrink-0">
          <button 
            onClick={() => navigate(-1)}
            className="p-3 rounded-2xl bg-white/50 dark:bg-black/50 hover:bg-white/80 dark:hover:bg-black/80 border border-border/50 backdrop-blur-md transition-all shadow-sm"
          >
            <ArrowLeft size={20} className="text-foreground" />
          </button>
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Verify Product</h1>
            <p className="text-sm text-muted-foreground">Scan or enter code to check authenticity.</p>
          </div>
        </div>

        {/* 2. Camera Card - THEME AWARE GLASS */}
        <div className="relative w-full aspect-square rounded-[2.5rem] overflow-hidden shadow-2xl border-[3px] border-white/20 dark:border-zinc-700/50 bg-white/30 dark:bg-black/30 backdrop-blur-2xl flex items-center justify-center shrink-0">
          
          {/* Camera Feed */}
          {!cameraError && !verificationResult && (
            <video 
              ref={cameraRef} 
              className="w-full h-full object-cover opacity-100" 
              playsInline 
            />
          )}

          {/* Error State */}
          {cameraError && (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center text-foreground">
              <CameraOff size={40} className="text-destructive mb-4" />
              <p className="font-bold text-lg">Camera Disabled</p>
              <p className="text-sm opacity-60 mt-2">Enable permissions or use manual entry below.</p>
            </div>
          )}

          {/* Scanning Overlay */}
          {isScanning && !cameraError && !verificationResult && !isProcessingImage && (
            <div className="absolute inset-0 pointer-events-none">
              {/* Darken edges slightly to focus attention */}
              <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.2)]"></div>
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 relative">
                   {/* Laser */}
                   <motion.div 
                     className="absolute w-full h-1 bg-brand-500/80 shadow-[0_0_20px_rgba(16,185,129,1)] rounded-full"
                     animate={{ top: ["10%", "90%", "10%"] }}
                     transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
                   />
                   {/* Corner Markers */}
                   <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-brand-500 rounded-tl-3xl shadow-sm" />
                   <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-brand-500 rounded-tr-3xl shadow-sm" />
                   <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-brand-500 rounded-bl-3xl shadow-sm" />
                   <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-brand-500 rounded-br-3xl shadow-sm" />
                </div>
              </div>
              <div className="absolute bottom-8 left-0 right-0 text-center">
                <span className="px-5 py-2 rounded-full bg-black/40 dark:bg-black/60 backdrop-blur-md text-white text-xs font-bold tracking-wider border border-white/10">
                  ALIGN CODE
                </span>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isProcessingImage && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-md flex flex-col items-center justify-center z-20">
              <Loader2 size={48} className="text-brand-500 animate-spin mb-4" />
              <p className="text-foreground font-bold">Processing...</p>
            </div>
          )}
        </div>

        {/* 3. Controls Section - STATIC & VISIBLE */}
        {!verificationResult && (
          <div className="flex flex-col gap-4 shrink-0">
            
            {/* Manual Input - Theme Aware Glassy Background */}
            <form onSubmit={(e) => { e.preventDefault(); handleVerify(batchNumber); }} className="flex gap-3">
              <div className="relative flex-1">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <ScanLine size={20} />
                </div>
                <input 
                  type="text" 
                  placeholder="Enter Batch Number"
                  className="w-full h-14 pl-12 pr-4 rounded-2xl 
                             bg-white/60 dark:bg-black/60 backdrop-blur-md 
                             border-2 border-border focus:border-brand-500 
                             text-foreground placeholder:text-muted-foreground/70 
                             font-bold text-lg shadow-sm transition-all outline-none"
                  value={batchNumber}
                  onChange={e => setBatchNumber(e.target.value)}
                />
              </div>
              <button 
                type="submit"
                disabled={!batchNumber}
                className="h-14 w-14 flex items-center justify-center bg-brand-600 text-white rounded-2xl shadow-lg shadow-brand-500/20 hover:bg-brand-500 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Zap size={24} fill="currentColor" />
              </button>
            </form>

            {/* Gallery Button - Matches Theme */}
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-4 rounded-2xl border-2 border-dashed border-muted-foreground/25 hover:border-brand-500/50 hover:bg-accent/50 text-muted-foreground hover:text-brand-600 transition-all flex items-center justify-center gap-2.5 font-semibold"
            >
              <ImageIcon size={20} />
              Upload from Gallery
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </div>
        )}

        {/* 4. Result Modal */}
        <AnimatePresence>
          {verificationResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            >
              <div className="w-full max-w-md bg-background/90 dark:bg-zinc-900/90 backdrop-blur-xl p-8 text-center rounded-[2.5rem] border border-white/20 shadow-2xl">
                {verificationResult.status === 'Valid' ? (
                  <>
                    <Confetti numberOfPieces={100} recycle={false} className="!absolute !inset-0 !w-full !h-full pointer-events-none" />
                    <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/10">
                      <CheckCircle2 size={40} />
                    </div>
                    <h2 className="text-3xl font-display font-bold text-emerald-600 dark:text-emerald-400 mb-1">Authentic</h2>
                    <p className="text-muted-foreground mb-8 text-lg">{verificationResult.product?.productName}</p>
                    
                    <div className="bg-secondary/50 rounded-2xl p-5 border border-border space-y-3 mb-8 text-left shadow-inner">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-muted-foreground">Batch</span>
                        <span className="font-mono font-bold text-foreground bg-background px-2 py-1 rounded-md border border-border/50">{batchNumber}</span>
                      </div>
                      <div className="h-px bg-border/60" />
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-muted-foreground">Expiry</span>
                        <span className="font-bold text-foreground">
                          {verificationResult.product?.expiryDate ? new Date(verificationResult.product.expiryDate).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-20 h-20 bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-pulse">
                      <XCircle size={40} />
                    </div>
                    <h2 className="text-3xl font-display font-bold text-destructive mb-2">Warning</h2>
                    <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                      This code is <strong>not recognized</strong>. It may be a counterfeit product.
                    </p>
                    <button 
                      onClick={() => navigate('/report')}
                      className="w-full py-4 bg-destructive hover:bg-destructive/90 text-white rounded-2xl font-bold shadow-lg shadow-destructive/20 mb-4 transition-transform active:scale-95"
                    >
                      Report Issue
                    </button>
                  </>
                )}

                <button 
                  onClick={() => { setVerificationResult(null); setIsScanning(true); setBatchNumber(''); }}
                  className="w-full py-4 bg-foreground text-background rounded-2xl font-bold hover:opacity-90 transition-opacity"
                >
                  Scan Next Item
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