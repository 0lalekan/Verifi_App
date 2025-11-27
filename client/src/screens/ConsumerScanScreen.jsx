import React, { useState, useRef, useMemo, useEffect } from 'react';
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
  Loader2,
  ZoomIn, 
  ZoomOut
} from 'lucide-react';

const ConsumerScanScreen = () => {
  const [batchNumber, setBatchNumber] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [isScanning, setIsScanning] = useState(true);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  
  // --- ZOOM STATE ---
  const [zoom, setZoom] = useState(1);
  const [maxZoom, setMaxZoom] = useState(5); // Default to 5 if caps fail
  const [showZoom, setShowZoom] = useState(false);
  
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
    setIsScanning(false);

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
        width: { ideal: 1920 }, 
        height: { ideal: 1080 } 
      } 
    },
    timeBetweenDecodingAttempts: 300,
    onDecodeResult: (result) => {
      if (isScanning && !verificationResult) {
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

  // --- CAMERA CAPABILITIES (ZOOM & FOCUS) ---
  useEffect(() => {
    const checkCapabilities = () => {
      const video = cameraRef.current;
      if (!video || !video.srcObject) return;

      const track = video.srcObject.getVideoTracks()[0];
      if (!track) return;

      // Check if we can apply constraints (required for zoom)
      if (typeof track.applyConstraints !== 'function') return;

      // Try to get actual capabilities
      const capabilities = track.getCapabilities ? track.getCapabilities() : {};
      
      // 1. Setup Zoom
      if (capabilities.zoom) {
        // If the browser honestly reports zoom support
        setMaxZoom(capabilities.zoom.max);
        setShowZoom(true);
      } else {
        // FALLBACK: Force show slider if applyConstraints exists
        // Many phones support zoom but don't report it via getCapabilities
        setShowZoom(true); 
      }

      // 2. Force Focus Mode
      if (capabilities.focusMode && capabilities.focusMode.includes('continuous')) {
        track.applyConstraints({ advanced: [{ focusMode: 'continuous' }] })
          .catch(() => {});
      }
    };

    // Delay check to ensure stream is fully active
    const timeoutId = setTimeout(checkCapabilities, 500);
    return () => clearTimeout(timeoutId);

  }, [isScanning, cameraRef.current?.srcObject]);

  const handleZoomChange = (e) => {
    const newZoom = Number(e.target.value);
    setZoom(newZoom);
    
    const video = cameraRef.current;
    if (video && video.srcObject) {
      const track = video.srcObject.getVideoTracks()[0];
      if (track && track.applyConstraints) {
        track.applyConstraints({ advanced: [{ zoom: newZoom }] })
          .catch(err => console.log("Zoom failed", err));
      }
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsProcessingImage(true);
    setIsScanning(false);

    try {
      const reader = new BrowserMultiFormatReader();
      const imageUrl = URL.createObjectURL(file);
      const hints = new Map();
      hints.set(DecodeHintType.TRY_HARDER, true);
      
      const result = await reader.decodeFromImage(undefined, imageUrl, hints);
      if (result) handleVerify(result.getText());
    } catch (error) {
      toast.error('No valid code found in image.');
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
            <video 
              ref={cameraRef} 
              className="w-full h-full object-cover" 
              playsInline 
              muted 
            />
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
            <>
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-64 h-64 relative">
                   {/* REMOVED: Moving Green Line Animation */}
                   
                   {/* Corners */}
                   <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-brand-500 rounded-tl-3xl" />
                   <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-brand-500 rounded-tr-3xl" />
                   <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-brand-500 rounded-bl-3xl" />
                   <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-brand-500 rounded-br-3xl" />
                </div>
              </div>

              {/* Zoom Controls */}
              {showZoom && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-48 flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 z-20">
                  <ZoomOut size={16} className="text-white/80" />
                  <input 
                    type="range" 
                    min="1" 
                    max={Math.min(maxZoom, 5)} 
                    step="0.1" 
                    value={zoom}
                    onChange={handleZoomChange}
                    className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-brand-500"
                  />
                  <ZoomIn size={16} className="text-white/80" />
                </div>
              )}
            </>
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