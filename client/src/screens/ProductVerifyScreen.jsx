import React, { useState, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-toastify';
import Tesseract from 'tesseract.js';
import useAuthStore from '../store';

const ProductVerifyScreen = () => {
  const [batchNumber, setBatchNumber] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const { userInfo } = useAuthStore();
  const fileInputRef = useRef(null);
  const queryClient = useQueryClient();

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
      if (data.status === 'Valid') {
        toast.success(`You earned ${data.pointsEarned} points!`);
      } else {
        toast.error(data.status === 'Fake' ? 'This product batch is not in our database.' : 'This product batch has expired.');
      }
      queryClient.invalidateQueries(['userProfile']);
    },
    onError: () => {
      setVerificationResult(null);
      toast.error('Verification failed');
    },
  });

  const handleVerify = () => {
    if (batchNumber.trim()) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude, accuracy } = position.coords;
            mutation.mutate({ batchNumber, latitude, longitude, accuracy });
          },
          (error) => {
            console.warn('Geolocation error:', error);
            // Proceed with null coordinates and accuracy if permission denied
            mutation.mutate({ batchNumber, latitude: null, longitude: null, accuracy: null });
          },
          { enableHighAccuracy: true, timeout: 5000 }
        );
      } else {
        // Geolocation not supported, proceed with null coordinates and accuracy
        mutation.mutate({ batchNumber, latitude: null, longitude: null, accuracy: null });
      }
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageScan = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsScanning(true);
    try {
      const result = await Tesseract.recognize(file, 'eng');
      let text = result.data.text;

      // Clean up the extracted text
      text = text.replace(/\s+/g, ' ').trim().toUpperCase();

      // Extract potential batch number (alphanumeric strings including hyphens)
      const batchPattern = /[A-Z0-9\-]{3,20}/g;
      const matches = text.match(batchPattern);
      if (matches && matches.length > 0) {
        // Select the longest potential batch number to increase accuracy
        const sortedMatches = matches.sort((a, b) => b.length - a.length);
        const potentialBatch = sortedMatches[0];
        setBatchNumber(potentialBatch);
        toast.success(`Extracted batch number: ${potentialBatch}`);
      } else {
        toast.error('Could not extract a batch number from the image');
      }
    } catch (error) {
      console.error('OCR Error:', error);
      toast.error('Failed to process image');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Product Batch Verification</h2>
        <div className="mb-4">
          <label htmlFor="batchNumber" className="block text-sm font-medium text-gray-700 mb-2">
            Enter Batch Number
          </label>
          <div className="flex">
            <input
              id="batchNumber"
              type="text"
              value={batchNumber}
              onChange={(e) => setBatchNumber(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Batch Number"
              disabled={isScanning}
            />
            <button
              onClick={handleCameraClick}
              disabled={isScanning}
              className="px-4 py-2 border border-l-0 border-gray-300 bg-gray-50 hover:bg-gray-100 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              title="Scan batch number from image"
            >
              {isScanning ? (
                <span className="text-sm">🔄</span>
              ) : (
                <span className="text-sm">📷</span>
              )}
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImageScan}
            className="hidden"
          />
          {isScanning && (
            <p className="text-sm text-blue-600 mt-1">Processing image with OCR...</p>
          )}
        </div>
        <button
          onClick={handleVerify}
          disabled={mutation.isLoading || isScanning}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isScanning ? 'Reading...' : mutation.isLoading ? 'Verifying...' : 'Verify Now'}
        </button>
        {verificationResult && verificationResult.status === 'Valid' && (
          <div className="mt-6 p-4 bg-green-100 border border-green-300 rounded-md">
            <div className="text-center mb-4">
              <span className="inline-block bg-green-500 text-white text-2xl font-bold px-4 py-2 rounded">
                VERIFIED AUTHENTIC
              </span>
            </div>
            <div className="mb-4">

              <h4 className="text-lg font-semibold text-green-800 mb-2">Product Profile</h4>
              <p>
                <strong>Product Name:</strong> {verificationResult.product.productName}
              </p>
              <p>
                <strong>Manufacturer:</strong> {verificationResult.product.medicalDetails?.manufacturedBy || 'N/A'}
              </p>
              <p>
                <strong>Description:</strong> {verificationResult.product.medicalDetails?.description || 'N/A'}
              </p>
            </div>
            <hr className="my-4" />
            <div>
              <h4 className="text-lg font-semibold text-green-800 mb-2">Usage & Safety</h4>
              <p>
                <strong>Dosage:</strong> {verificationResult.product.medicalDetails?.dosage || 'N/A'}
              </p>
              <p>
                <strong>Active Ingredients:</strong> {verificationResult.product.medicalDetails?.activeIngredients || 'N/A'}
              </p>
              {verificationResult.product.medicalDetails?.sideEffects ? (
                <div className="bg-yellow-100 border border-yellow-400 p-2 rounded mt-2">
                  <strong>Side Effects:</strong> {verificationResult.product.medicalDetails.sideEffects}
                </div>
              ) : (
                <p>
                  <strong>Side Effects:</strong> Consult Pharmacist
                </p>
              )}
            </div>
            <p className="text-green-700 mt-4">
              <strong>Times Verified:</strong> {verificationResult.product.verificationCount}
            </p>
          </div>
        )}
        {verificationResult && verificationResult.status !== 'Valid' && (
          <div className="mt-6 p-4 bg-red-100 border border-red-300 rounded-md text-center">
            <span className="inline-block bg-red-500 text-white text-2xl font-bold px-4 py-2 rounded">
              CAUTION
            </span>
            <p className="mt-4 text-red-800">
              {verificationResult.status === 'Expired' ? 'This product batch has expired.' : 'This product batch is not in our database.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductVerifyScreen;
