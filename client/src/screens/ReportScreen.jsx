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
  Loader2,
  X,
  ArrowLeft
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
    mutationFn: async (data) => (await api.post('/reports', data)).data,
    onSuccess: () => {
      toast.success('Report submitted securely.');
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
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background bg-gradient-mesh dark:bg-gradient-mesh-dark p-4 py-12 transition-colors duration-500">
      
      <div className="w-full max-w-2xl animate-in slide-in-from-bottom-4 duration-700">
        
        <button onClick={() => navigate(-1)} className="mb-6 flex items-center text-muted-foreground hover:text-foreground transition-colors font-medium text-sm">
          <ArrowLeft size={18} className="mr-2" /> Cancel
        </button>

        <div className="glass rounded-[2.5rem] shadow-2xl overflow-hidden">
          
          {/* Header */}
          <div className="p-8 md:p-10 border-b border-border/50 bg-white/5">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-red-500/10 text-red-500 mb-4 border border-red-500/20">
              <AlertTriangle size={24} />
            </div>
            <h1 className="text-3xl font-display font-bold text-foreground">Report Counterfeit</h1>
            <p className="text-muted-foreground mt-1">
              Securely report suspicious products. Your submission helps protect the community.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Package size={16} className="text-primary" /> Product Name
                </label>
                <input
                  id="productName"
                  type="text"
                  value={formData.productName}
                  onChange={handleChange}
                  className="flex h-12 w-full rounded-xl border border-input bg-background/50 px-4 shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  placeholder="e.g. Fake Medication X"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Hash size={16} className="text-primary" /> Batch Number
                </label>
                <input
                  id="batchNumber"
                  type="text"
                  value={formData.batchNumber}
                  onChange={handleChange}
                  className="flex h-12 w-full rounded-xl border border-input bg-background/50 px-4 shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  placeholder="If visible on packaging"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground flex items-center gap-2">
                <MapPin size={16} className="text-primary" /> Incident Location
              </label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <input
                    id="location"
                    type="text"
                    value={formData.location}
                    onChange={handleChange}
                    className="flex h-12 w-full rounded-xl border border-input bg-background/50 px-4 shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    placeholder="Store address or GPS coordinates"
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={getLocation}
                  disabled={isLocating}
                  className={`h-12 px-4 rounded-xl font-bold text-sm flex items-center gap-2 transition-all border ${
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

            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground flex items-center gap-2">
                <Camera size={16} className="text-primary" /> Photo Evidence
              </label>
              
              {!previewUrl ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-border rounded-2xl p-8 text-center hover:bg-secondary/30 transition-all cursor-pointer group bg-background/30"
                >
                  <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <Camera size={24} className="text-muted-foreground group-hover:text-foreground" />
                  </div>
                  <p className="text-sm font-bold text-foreground">Upload Evidence</p>
                  <p className="text-xs text-muted-foreground mt-1">JPG/PNG (Max 5MB)</p>
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden border border-border h-48 bg-black/5 group">
                  <img src={previewUrl} alt="Evidence" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-colors"><Camera size={20} /></button>
                    <button type="button" onClick={clearFile} className="p-2 bg-red-500/80 backdrop-blur-md rounded-full text-white hover:bg-red-600 transition-colors"><X size={20} /></button>
                  </div>
                </div>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground flex items-center gap-2">
                <FileText size={16} className="text-primary" /> Details
              </label>
              <textarea
                id="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                className="flex w-full rounded-xl border border-input bg-background/50 p-4 text-sm shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-none"
                placeholder="Describe the issue (e.g., broken seal, strange smell)..."
                required
              ></textarea>
            </div>

            {/* Updated Submit Button: Now using Primary (Green) Brand Color */}
            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold text-lg shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {mutation.isPending ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
              Submit Report
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportScreen;