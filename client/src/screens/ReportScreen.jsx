import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const ReportScreen = () => {
  const navigate = useNavigate();
  const [productName, setProductName] = useState('');
  const [batchNumber, setBatchNumber] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [evidenceFile, setEvidenceFile] = useState(null);
  const [isLocating, setIsLocating] = useState(false);

  const mutation = useMutation({
    mutationFn: async (formData) => {
      const response = await axios.post('/api/reports', formData);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Report submitted successfully!');
      navigate('/dashboard');
    },
    onError: () => {
      toast.error('Failed to submit report');
    },
  });

  const submitHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('productName', productName);
    formData.append('batchNumber', batchNumber);
    formData.append('location', location);
    formData.append('description', description);
    if (evidenceFile) {
      formData.append('evidenceImage', evidenceFile);
    }
    mutation.mutate(formData);
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by this browser');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation(`Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`);
        setIsLocating(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        toast.error('Failed to get current location');
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Report Suspected Counterfeit</h1>
        <form onSubmit={submitHandler} className="space-y-6">
          <div>
            <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-2">
              Product Name
            </label>
            <input
              id="productName"
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              placeholder="e.g. Amoxicillin 500mg"
              required
            />
          </div>

          <div>
            <label htmlFor="batchNumber" className="block text-sm font-medium text-gray-700 mb-2">
              Batch Number
            </label>
            <input
              id="batchNumber"
              type="text"
              value={batchNumber}
              onChange={(e) => setBatchNumber(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              placeholder="e.g. LOT12345"
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Location Purchased
            </label>
            <div className="flex gap-2">
              <input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                placeholder="e.g. Lagos Pharmacy or click button to get current location"
                required
              />
              <button
                type="button"
                onClick={getCurrentLocation}
                disabled={isLocating}
                className="px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 transition-all duration-300"
                title="Use Current Location"
              >
                {isLocating ? '...' : '📍 Use Current Location'}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              placeholder="Describe the issue with the product..."
              required
            />
          </div>

          <div>
            <label htmlFor="evidenceImage" className="block text-sm font-medium text-gray-700 mb-2">
              Evidence Image
            </label>
            <input
              id="evidenceImage"
              type="file"
              accept="image/*"
              onChange={(e) => setEvidenceFile(e.target.files[0])}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          <button
            type="submit"
            disabled={mutation.isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-700 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {mutation.isLoading ? 'Submitting...' : 'Submit Report'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportScreen;
