import React, { useState, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useZxing } from 'react-zxing';
import { BrowserMultiFormatReader } from '@zxing/library';
import useAuthStore from '../store';
import Confetti from 'react-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SafetyTips from '../components/SafetyTips';

const ShieldIcon = () => (
  <svg className="w-64 h-64 animate-pulse" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 1l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 1z"/>
  </svg>
);

const ConsumerScanScreen = () => {
  const [batchNumber, setBatchNumber] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [showManual, setShowManual] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { userInfo } = useAuthStore();
  const fileInputQrRef = useRef(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { ref: cameraRef } = useZxing({
    onDecodeResult: (result) => {
      const text = result.getText();
      setBatchNumber(text);
      verifyProduct(text);
    },
    constraints: { video: { facingMode: { ideal: 'environment' } } },
  });

  const verifyProduct = (batchNum) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          mutation.mutate({ batchNumber: batchNum, latitude, longitude, accuracy });
        },
        (error) => {
          console.warn('Geolocation error:', error);
          mutation.mutate({ batchNumber: batchNum, latitude: null, longitude: null, accuracy: null });
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      mutation.mutate({ batchNumber: batchNum, latitude: null, longitude: null, accuracy: null });
    }
  };

  const mutation = useMutation({
    mutationFn: async ({ batchNumber, latitude, longitude, accuracy }) => {
      const response = await axios.post('/api/products/verify', {
        batchNumber,
        latitude,
        longitude,
        accuracy,
      });
      return response.data;
    },
    onSuccess: (data) => {
      setVerificationResult(data);
      setShowManual(false); // close manual
      if (data.status === 'Valid') {
        setShowConfetti(true);
        // successAudio.play(); // Disabled to fix import error
        setTimeout(() => {
          setShowConfetti(false);
        }, 4000);
      } else if (data.status === 'Fake') {
        if (navigator.vibrate) {
          navigator.vibrate([100, 30, 100]);
        }
      }
      queryClient.invalidateQueries(['userProfile']);
    },
    onError: () => {
      setVerificationResult({ status: 'Error' });
      toast.error('Verification failed');
    },
  });

  const handleVerify = () => {
    if (batchNumber.trim()) {
      verifyProduct(batchNumber);
    }
  };

  const handleUploadQrImage = () => {
    fileInputQrRef.current?.click();
  };

  const handleImageDecode = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const reader = new BrowserMultiFormatReader();
      const image = new Image();
      image.onload = () => {
        reader.decodeFromImage(image).then(result => {
          const text = result.getText();
          setBatchNumber(text);
          verifyProduct(text);
        }).catch(err => {
          console.error(err);
          toast.error('Could not decode QR/Barcode from image');
        });
      };
      image.src = URL.createObjectURL(file);
    } catch (error) {
      console.error(error);
      toast.error('Failed to process image');
    }
  };

  const handleShare = async () => {
    const productName = verificationResult.productName || 'product';
    const appLink = window.location.origin;
    const message = `I just verified my ${productName} on Verifi! It's safe. Stay safe this Season! ${appLink} #VerifiNigeria`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Verified safe product on Verifi',
          text: message,
          url: appLink
        });
        toast.success('Shared successfully!');
      } catch (err) {
        console.log('Share cancelled or failed');
      }
    } else {
      try {
        await navigator.clipboard.writeText(message);
        toast.success('Message copied to clipboard!');
      } catch (err) {
        toast.error('Failed to copy message');
      }
    }
  };

  if (verificationResult) {
    const isValid = verificationResult.status === 'Valid';
    const isFake = verificationResult.status === 'Fake';
    return (
      <div className={`w-full h-screen flex flex-col items-center justify-center ${isValid ? 'bg-green-500' : isFake ? 'bg-red-500' : 'bg-gray-500'} relative`}>
        <AnimatePresence>
          {isValid && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <div className="text-white mb-4">
                <ShieldIcon />
              </div>
              <p className="text-white text-3xl font-bold">VERIFIED AUTHENTIC!</p>
              <p className="text-white">You earned {verificationResult.pointsEarned} Points!</p>
              <button
                onClick={handleShare}
                className="mt-6 bg-white text-green-600 px-8 py-3 rounded-lg text-xl font-bold hover:bg-gray-200 transition-colors"
              >
                Share Safety Win 🛡️
              </button>
            </motion.div>
          )}
          {isFake && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <h1 className="text-white text-6xl font-bold mb-8">REPORT NOW</h1>
              <button
                onClick={() => navigate('/report')}
                className="bg-white text-red-500 px-12 py-6 rounded-lg text-3xl font-bold hover:bg-gray-200"
              >
                Whistleblower Form
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        {showConfetti && <Confetti />}
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* QR Scanner Background */}
      <video ref={cameraRef} className="w-full h-full object-cover" />

      {/* Scan Reticle */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-64 h-64 border-4 border-white rounded-lg animate-pulse"></div>
      </div>

      {/* Bottom Sheet */}
      <AnimatePresence>
        {showManual && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="absolute bottom-0 w-full bg-white rounded-t-3xl p-6 max-h-80 flex flex-col"
          >
            <div className="mb-4">
              <label htmlFor="batchNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Enter Batch Number
              </label>
              <input
                id="batchNumber"
                type="text"
                value={batchNumber}
                onChange={(e) => setBatchNumber(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Batch Number or Scan QR/Barcode"
              />
              {!verificationResult && (mutation.isLoading || !showManual) && <div className="mt-4"><SafetyTips /></div>}
            </div>
            <div className="flex space-x-2 mb-4">
              <button
                onClick={handleUploadQrImage}
                className="flex-1 bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600"
              >
                Upload Image
              </button>
              <input
                ref={fileInputQrRef}
                type="file"
                accept="image/*"
                onChange={handleImageDecode}
                className="hidden"
              />
            </div>
            <button
              onClick={handleVerify}
              disabled={!batchNumber.trim() || mutation.isLoading}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              {mutation.isLoading ? 'Verifying...' : 'Verify Now'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Manual Entry Trigger */}
      {!showManual && (
        <div className="absolute bottom-0 w-full p-4">
          <button
            onClick={() => setShowManual(true)}
            className="w-full bg-white text-black py-3 rounded-lg font-semibold"
          >
            Manual Entry
          </button>
        </div>
      )}
    </div>
  );
};

export default ConsumerScanScreen;
