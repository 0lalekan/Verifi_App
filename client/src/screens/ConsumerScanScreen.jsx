import React, { useState, useRef, useEffect } from 'react';
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
  Loader2,
  ZoomIn, 
  ZoomOut,
  Camera,
  RefreshCw,
  ScanLine,
  Keyboard,
  Aperture
} from 'lucide-react';

const ConsumerScanScreen = () => {
  // --- STATE ---
  const [capturedImage, setCapturedImage] = useState(null); 
  const [verificationResult, setVerificationResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [batchNumber, setBatchNumber] = useState('');
  
  const fileInputRef = useRef(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // --- API MUTATION ---
  const mutation = useMutation({
    mutationFn: async ({ batchNumber, latitude, longitude, accuracy }) => {
      const response = await api.post('/products/verify', {
        batchNumber, latitude, longitude, accuracy,
      });
      return response.data;
    },
    onSuccess: (data) => {
      setVerificationResult(data);
      setIsProcessing(false);
      // FIX: Invalidate BOTH profile (points) and history (recent activity)
      queryClient.invalidateQueries(['userProfile']); 
      queryClient.invalidateQueries(['userHistory']); // Added this line
      
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try { navigator.vibrate([100, 50, 100]); } catch (e) { /* ignore */ }
      }
    },
    onError: (error) => {
      const msg = error.response?.data?.message || 'Verification failed. Connection error.';
      toast.error(msg);
      setIsProcessing(false);
    },
  });

  // ... (Rest of the file remains exactly the same as the previous turn)
  const handleVerify = (code) => {
    const codeToVerify = code || batchNumber;
    if (!codeToVerify) {
      toast.error("Please enter or scan a valid code.");
      return;
    }
    
    if (code) setBatchNumber(code);
    setIsProcessing(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => mutation.mutate({ 
          batchNumber: codeToVerify, 
          latitude: pos.coords.latitude, 
          longitude: pos.coords.longitude, 
          accuracy: pos.coords.accuracy 
        }),
        (err) => {
           console.warn("GPS Error:", err);
           mutation.mutate({ batchNumber: codeToVerify });
        }
      );
    } else {
      mutation.mutate({ batchNumber: codeToVerify });
    }
  };

  const { ref: cameraRef } = useZxing({
    paused: !!capturedImage || !!verificationResult,
    constraints: { 
      video: { 
        facingMode: 'environment',
        width: { ideal: 1920 }, 
        height: { ideal: 1080 } 
      } 
    },
    onDecodeResult: () => {}, 
    onError: (err) => {
      if (err.name === 'NotAllowedError' || err.name === 'NotFoundError') {
        setCameraError("Camera access denied.");
      }
    }
  });

  const handleZoomChange = (e) => {
    const newZoom = Number(e.target.value);
    setZoom(newZoom);
    const video = cameraRef.current;
    if (video && video.srcObject) {
      const track = video.srcObject.getVideoTracks()[0];
      if (track.getCapabilities && track.getCapabilities().zoom) {
        track.applyConstraints({ advanced: [{ zoom: newZoom }] }).catch(() => {});
      }
    }
  };

  const captureFrame = () => {
    const video = cameraRef.current;
    if (video) {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      setCapturedImage(canvas.toDataURL('image/jpeg'));
    }
  };

  const processCapturedImage = async () => {
    if (!capturedImage) return;
    setIsProcessing(true);

    try {
      const reader = new BrowserMultiFormatReader();
      const hints = new Map();
      hints.set(DecodeHintType.TRY_HARDER, true);
      hints.set(DecodeHintType.POSSIBLE_FORMATS, [
        BarcodeFormat.QR_CODE, 
        BarcodeFormat.CODE_128, 
        BarcodeFormat.EAN_13,
        BarcodeFormat.DATA_MATRIX
      ]);

      const img = new Image();
      img.src = capturedImage;
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const result = await reader.decodeFromImageElement(img, hints);
      handleVerify(result.getText());
    } catch (error) {
      console.error(error);
      toast.error("Could not read barcode. Please retake or type manually.");
      setIsProcessing(false);
    }
  };

  const retake = () => {
    setCapturedImage(null);
    setVerificationResult(null);
    setIsProcessing(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCapturedImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100dvh-6rem)] px-4 w-full bg-background bg-gradient-mesh dark:bg-gradient-mesh-dark transition-colors duration-500">
      
      <div className="w-full max-w-md mx-auto space-y-4">
        
        <div className="flex items-center gap-4 shrink-0 mb-2">
          <button 
            onClick={() => navigate(-1)}
            className="p-3 rounded-2xl bg-background/50 hover:bg-background/80 border border-border/50 backdrop-blur-md transition-all shadow-sm"
          >
            <ArrowLeft size={20} className="text-foreground" />
          </button>
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Verify Product</h1>
            <p className="text-sm text-muted-foreground">Capture photo or enter code.</p>
          </div>
        </div>

        <div className="relative w-full aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-2xl border-[4px] border-white/20 dark:border-white/10 bg-black flex items-center justify-center shrink-0">
          
          {!capturedImage && !cameraError && (
            <video 
              ref={cameraRef} 
              className="w-full h-full object-cover transition-transform duration-200"
              style={{ transform: `scale(${zoom})` }} 
              playsInline 
              muted 
            />
          )}

          {capturedImage && (
            <img 
              src={capturedImage} 
              alt="Captured" 
              className="w-full h-full object-contain bg-black" 
            />
          )}

          {cameraError && (
            <div className="text-center p-6 text-white">
              <CameraOff size={48} className="mx-auto mb-4 opacity-50" />
              <p>Camera Unavailable</p>
            </div>
          )}

          {isProcessing && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-50">
              <Loader2 size={48} className="text-emerald-500 animate-spin mb-4" />
              <p className="text-white font-bold">Verifying...</p>
            </div>
          )}

          {!cameraError && !verificationResult && (
            <div className="absolute bottom-0 left-0 right-0 p-6 pt-12 bg-gradient-to-t from-black/80 to-transparent flex flex-col gap-4 z-20">
              
              {!capturedImage && (
                <div className="flex items-center gap-3 px-4">
                  <ZoomOut size={16} className="text-white/80" />
                  <input 
                    type="range" 
                    min="1" 
                    max="3" 
                    step="0.1" 
                    value={zoom}
                    onChange={handleZoomChange}
                    className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <ZoomIn size={16} className="text-white/80" />
                </div>
              )}

              <div className="flex items-center justify-between px-2">
                
                {!capturedImage ? (
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all border border-white/10"
                  >
                    <ImageIcon size={20} />
                  </button>
                ) : (
                  <button 
                    onClick={retake}
                    className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md text-white font-bold text-sm hover:bg-white/20 transition-all border border-white/10"
                  >
                    Retake
                  </button>
                )}

                {!capturedImage ? (
                  <button 
                    onClick={captureFrame}
                    className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center bg-transparent hover:bg-white/10 transition-all active:scale-95"
                  >
                    <div className="w-16 h-16 rounded-full bg-white" />
                  </button>
                ) : (
                  <button 
                    onClick={processCapturedImage}
                    className="h-14 px-8 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-lg shadow-lg shadow-emerald-500/30 flex items-center gap-2 transition-all active:scale-95"
                  >
                    <ScanLine size={20} /> Verify
                  </button>
                )}

                <div className="w-12 h-12" /> 
              </div>
            </div>
          )}
        </div>

        {!verificationResult && (
          <div className="glass p-2 rounded-[1.5rem] flex items-center gap-2">
            <div className="relative flex-1">
              <Keyboard size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Or type Batch Number..."
                className="w-full h-12 pl-12 pr-4 rounded-2xl bg-transparent border-none text-foreground font-bold text-base focus:ring-0 outline-none"
                value={batchNumber}
                onChange={e => setBatchNumber(e.target.value)}
              />
            </div>
            <button 
              onClick={() => handleVerify()}
              disabled={!batchNumber || isProcessing}
              className="h-10 px-5 bg-secondary hover:bg-secondary/80 text-foreground rounded-xl font-bold text-sm transition-all disabled:opacity-50"
            >
              Verify
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </div>
        )}

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
                  onClick={retake}
                  className="w-full py-3.5 bg-secondary hover:bg-secondary/80 text-foreground rounded-xl font-bold flex items-center justify-center gap-2"
                >
                  <RefreshCw size={18} /> Scan Another
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