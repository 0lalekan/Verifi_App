import React, { useState, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { toast } from 'react-toastify';
import { 
  AlertTriangle, 
  MapPin, 
  Camera, 
  Send, 
  FileText, 
  Package, 
  Hash, 
  CheckCircle2, 
  Loader2,
  X
} from 'lucide-react';

const ReportScreen = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    productName: '',
    batchNumber: '',
    location: '',
    description: ''
  });
  const [evidenceFile, setEvidenceFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLocating, setIsLocating] = useState(false);

  const mutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/reports', data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Report submitted successfully.');
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
        const locString = `Lat: ${pos.coords.latitude.toFixed(6)}, Lon: ${pos.coords.longitude.toFixed(6)}`;
        setFormData(prev => ({ ...prev, location: locString }));
        setIsLocating(false);
        toast.success('Location pinned securely');
      },
      () => {
        setIsLocating(false);
        toast.error('Unable to access GPS. Please type location manually.');
      }
    );
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEvidenceFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const clearFile = () => {
    setEvidenceFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = new FormData();
    Object.keys(formData).forEach(key => submitData.append(key, formData[key]));
    if (evidenceFile) submitData.append('evidenceImage', evidenceFile);
    mutation.mutate(submitData);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background bg-gradient-mesh dark:bg-gradient-mesh-dark pt-24 pb-12 px-4 transition-colors duration-500">
      
      <div className="w-full max-w-2xl animate-in slide-in-from-bottom-4 duration-700">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-destructive/10 text-destructive mb-4 border border-destructive/20 shadow-lg shadow-destructive/5">
            <AlertTriangle size={32} />
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">Whistleblower Report</h1>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            Securely report counterfeit products. Your submission helps protect the community.
          </p>
        </div>

        {/* Main Card */}
        <div className="glass-card p-6 md:p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Product & Batch Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Package size={16} className="text-primary" /> Product Name
                </label>
                <input
                  id="productName"
                  type="text"
                  value={formData.productName}
                  onChange={handleChange}
                  className="flex h-12 w-full rounded-xl border border-input bg-background/50 px-4 py-2 text-sm shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-0 placeholder:text-muted-foreground"
                  placeholder="e.g. Fake Medication X"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Hash size={16} className="text-primary" /> Batch Number (Optional)
                </label>
                <input
                  id="batchNumber"
                  type="text"
                  value={formData.batchNumber}
                  onChange={handleChange}
                  className="flex h-12 w-full rounded-xl border border-input bg-background/50 px-4 py-2 text-sm shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-0 placeholder:text-muted-foreground"
                  placeholder="If visible on box"
                />
              </div>
            </div>

            {/* Location Block */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <MapPin size={16} className="text-primary" /> Incident Location
              </label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <input
                    id="location"
                    type="text"
                    value={formData.location}
                    onChange={handleChange}
                    className="flex h-12 w-full rounded-xl border border-input bg-background/50 px-4 py-2 text-sm shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive"
                    placeholder="Store address or GPS coordinates"
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={getLocation}
                  disabled={isLocating}
                  className={`h-12 px-4 rounded-xl font-medium text-sm flex items-center gap-2 transition-all border ${
                    formData.location.includes('Lat:') 
                      ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
                      : 'bg-secondary hover:bg-secondary/80 border-transparent text-secondary-foreground'
                  }`}
                >
                  {isLocating ? <Loader2 size={18} className="animate-spin" /> : <MapPin size={18} />}
                  <span className="hidden sm:inline">{formData.location.includes('Lat:') ? 'Pinned' : 'Pin GPS'}</span>
                </button>
              </div>
            </div>

            {/* Evidence Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Camera size={16} className="text-primary" /> Photo Evidence
              </label>
              
              {!previewUrl ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-muted-foreground/25 rounded-2xl p-8 text-center hover:bg-secondary/30 transition-all cursor-pointer group"
                >
                  <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <Camera size={24} className="text-muted-foreground group-hover:text-foreground" />
                  </div>
                  <p className="text-sm font-medium text-foreground">Click to upload photo</p>
                  <p className="text-xs text-muted-foreground mt-1">JPG or PNG (Max 5MB)</p>
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden border border-border h-48 bg-black/5 group">
                  <img src={previewUrl} alt="Evidence" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-colors"
                    >
                      <Camera size={20} />
                    </button>
                    <button 
                      type="button"
                      onClick={clearFile}
                      className="p-2 bg-red-500/80 backdrop-blur-md rounded-full text-white hover:bg-red-600 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
              )}
              <input 
                ref={fileInputRef} 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleFileChange} 
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <FileText size={16} className="text-primary" /> Details
              </label>
              <textarea
                id="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                className="flex w-full rounded-xl border border-input bg-background/50 px-4 py-3 text-sm shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive placeholder:text-muted-foreground resize-none"
                placeholder="Describe why you suspect this product (e.g. broken seal, strange smell, wrong packaging)..."
                required
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full h-14 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-xl font-bold text-lg shadow-lg shadow-destructive/20 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 size={20} className="animate-spin" /> Encrypting & Sending...
                </>
              ) : (
                <>
                  Submit Report <Send size={20} />
                </>
              )}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportScreen;