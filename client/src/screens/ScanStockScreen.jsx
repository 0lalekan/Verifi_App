import React, { useState, useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import api from '../api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { BrowserMultiFormatReader, BarcodeFormat, DecodeHintType } from '@zxing/library';
import { useZxing } from 'react-zxing';
import { 
  ArrowLeft, 
  PackageCheck, 
  Truck, 
  MapPin, 
  FileText, 
  Loader2,
  ScanLine,
  Camera,
  RotateCcw,
  Image as ImageIcon,
  CameraOff
} from 'lucide-react';

const ScanStockScreen = () => {
  const navigate = useNavigate();
  const [capturedImage, setCapturedImage] = useState(null);
  const [result, setResult] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    action: 'Received', 
    location: '',
    notes: ''
  });

  // --- CAMERA SETUP (Same as ConsumerScan) ---
  const { ref: cameraRef } = useZxing({
    paused: !!capturedImage || !!result,
    constraints: { 
      video: { 
        facingMode: 'environment',
        width: { ideal: 1920 }, // Force Main Camera
        height: { ideal: 1080 } 
      } 
    },
    onDecodeResult: () => {}, // Manual capture only
    onError: (err) => {
      if (err.name === 'NotAllowedError' || err.name === 'NotFoundError') {
        setCameraError("Camera access denied.");
      }
    }
  });

  // --- CAPTURE & PROCESS ---
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
        BarcodeFormat.QR_CODE, BarcodeFormat.CODE_128, BarcodeFormat.DATA_MATRIX
      ]);

      const img = new Image();
      img.src = capturedImage;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const decodeResult = await reader.decodeFromImageElement(img, hints);
      setResult(decodeResult.getText());
      toast.success('Code Captured!');
    } catch (error) {
      toast.error("Could not read code. Please retake.");
    } finally {
      setIsProcessing(false);
    }
  };

  const resetScan = () => {
    setCapturedImage(null);
    setResult('');
    setIsProcessing(false);
  };

  const mutation = useMutation({
    mutationFn: async (data) => (await api.post('/products/transfer', data)).data,
    onSuccess: () => {
      toast.success(`Stock marked as ${formData.action}`);
      setFormData({ action: 'Received', location: '', notes: '' });
      resetScan();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Transfer failed');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!result) return toast.error("Please capture a batch code first");
    
    mutation.mutate({
      batchNumber: result,
      ...formData
    });
  };

  const getLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setFormData(prev => ({ ...prev, location: `GPS: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}` })),
      () => toast.error("Could not fetch location")
    );
  };

  return (
    <div className="min-h-screen w-full bg-background bg-gradient-mesh dark:bg-gradient-mesh-dark p-4 md:p-8 transition-colors duration-500 pb-24">
      <div className="max-w-2xl mx-auto pt-6">
        
        <button onClick={() => navigate(-1)} className="mb-6 flex items-center text-muted-foreground hover:text-foreground transition-colors font-medium text-sm">
          <ArrowLeft size={18} className="mr-2" /> Back
        </button>

        <div className="glass rounded-[2.5rem] overflow-hidden shadow-2xl">
          
          {/* --- CAMERA AREA --- */}
          <div className="relative h-72 bg-black flex items-center justify-center overflow-hidden">
            {!capturedImage && !cameraError ? (
              <video ref={cameraRef} className="w-full h-full object-cover" playsInline muted />
            ) : capturedImage ? (
              <img src={capturedImage} alt="Captured" className="w-full h-full object-contain" />
            ) : (
              <div className="text-white text-center"><CameraOff className="mx-auto mb-2"/>Camera Disabled</div>
            )}

            {/* Overlay Controls */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
              {!capturedImage ? (
                <button 
                  onClick={captureFrame}
                  className="bg-white text-black px-6 py-2 rounded-full font-bold shadow-lg flex items-center gap-2 hover:bg-gray-100 transition-all active:scale-95"
                >
                  <Camera size={20} /> Capture
                </button>
              ) : !result ? (
                <>
                  <button onClick={resetScan} className="bg-black/50 text-white px-4 py-2 rounded-full backdrop-blur-md border border-white/20">Retake</button>
                  <button 
                    onClick={processCapturedImage} 
                    disabled={isProcessing}
                    className="bg-emerald-500 text-white px-6 py-2 rounded-full font-bold shadow-lg flex items-center gap-2"
                  >
                    {isProcessing ? <Loader2 className="animate-spin" /> : <ScanLine size={20} />} 
                    Process
                  </button>
                </>
              ) : (
                <div className="bg-emerald-500 text-white px-6 py-2 rounded-full font-bold shadow-lg flex items-center gap-2 animate-in zoom-in">
                  <PackageCheck size={20} /> Code: {result}
                </div>
              )}
            </div>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-display font-bold text-foreground">Update Custody</h2>
                <p className="text-muted-foreground text-sm">Log inventory movement.</p>
              </div>
              {result && <button type="button" onClick={resetScan} className="text-xs text-red-500 hover:underline flex items-center gap-1"><RotateCcw size={12}/> Scan New</button>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                type="button"
                onClick={() => setFormData({...formData, action: 'Received'})}
                className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                  formData.action === 'Received' 
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600' 
                    : 'bg-background border-border text-muted-foreground hover:bg-secondary'
                }`}
              >
                <PackageCheck size={24} />
                <span className="font-bold text-sm">Receive</span>
              </button>
              <button 
                type="button"
                onClick={() => setFormData({...formData, action: 'Shipped'})}
                className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                  formData.action === 'Shipped' 
                    ? 'bg-blue-500/10 border-blue-500 text-blue-600' 
                    : 'bg-background border-border text-muted-foreground hover:bg-secondary'
                }`}
              >
                <Truck size={24} />
                <span className="font-bold text-sm">Ship</span>
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <input 
                    type="text" 
                    placeholder="Location / Warehouse ID"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-background/50 border border-input focus:ring-2 focus:ring-primary outline-none text-sm"
                    required
                  />
                </div>
                <button type="button" onClick={getLocation} className="p-3 bg-secondary rounded-xl hover:bg-secondary/80 transition-colors" title="Use GPS">
                  <MapPin size={20} />
                </button>
              </div>

              <div className="relative">
                <FileText className="absolute left-3 top-3 text-muted-foreground" size={16} />
                <textarea 
                  placeholder="Notes (e.g. Condition check passed)"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-background/50 border border-input focus:ring-2 focus:ring-primary outline-none text-sm resize-none h-24"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={!result || mutation.isPending}
              className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
            >
              {mutation.isPending ? <Loader2 className="animate-spin" /> : 'Confirm Update'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ScanStockScreen;