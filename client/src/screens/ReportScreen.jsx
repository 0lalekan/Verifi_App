import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const ReportScreen = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    productName: '',
    batchNumber: '',
    location: '',
    description: ''
  });
  const [evidenceFile, setEvidenceFile] = useState(null);
  const [isLocating, setIsLocating] = useState(false);

  const mutation = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post('/api/reports', data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Report submitted. Thank you for protecting the community.');
      navigate('/dashboard');
    },
    onError: () => toast.error('Submission failed. Please try again.')
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

  const getLocation = () => {
    if (!navigator.geolocation) return toast.error('Geolocation not supported');
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormData(prev => ({ ...prev, location: `Lat: ${pos.coords.latitude}, Lon: ${pos.coords.longitude}` }));
        setIsLocating(false);
        toast.success('Location pinned successfully');
      },
      () => {
        setIsLocating(false);
        toast.error('Unable to retrieve location');
      }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = new FormData();
    Object.keys(formData).forEach(key => submitData.append(key, formData[key]));
    if (evidenceFile) submitData.append('evidenceImage', evidenceFile);
    mutation.mutate(submitData);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <span className="text-4xl mb-4 block">🚨</span>
          <h1 className="text-2xl font-extrabold text-slate-900">Whistleblower Report</h1>
          <p className="text-slate-500 mt-2">Anonymous reporting channel for counterfeit goods.</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Suspect Product Name</label>
              <input
                id="productName"
                type="text"
                value={formData.productName}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                placeholder="e.g. Fake Panadol Extra"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Batch Number</label>
                <input
                  id="batchNumber"
                  type="text"
                  value={formData.batchNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="If visible"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Location</label>
                <button
                  type="button"
                  onClick={getLocation}
                  disabled={isLocating}
                  className={`w-full px-4 py-3 rounded-xl border font-semibold transition-all ${formData.location ? 'bg-green-50 border-green-200 text-green-700' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                >
                  {isLocating ? 'Pinning...' : formData.location ? '✅ Pinned' : '📍 Pin GPS'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Evidence Photo</label>
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:bg-slate-50 cursor-pointer relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEvidenceFile(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <span className="text-2xl block mb-1">📷</span>
                <p className="text-sm text-slate-500">{evidenceFile ? evidenceFile.name : 'Tap to upload photo'}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Incident Details</label>
              <textarea
                id="description"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Describe why you suspect this is fake (e.g., wrong packaging, bad smell)..."
                required
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-500/20 transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
            >
              {mutation.isPending ? 'Submitting Securely...' : 'Submit Report'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportScreen;