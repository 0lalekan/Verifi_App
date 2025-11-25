import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useZxing } from 'react-zxing';
import api from '../api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  PackageCheck, 
  Truck, 
  MapPin, 
  FileText, 
  Loader2,
  ScanLine
} from 'lucide-react';

const ScanStockScreen = () => {
  const navigate = useNavigate();
  const [result, setResult] = useState('');
  const [isScanning, setIsScanning] = useState(true);
  
  const [formData, setFormData] = useState({
    action: 'Received', // Default
    location: '',
    notes: ''
  });

  const { ref } = useZxing({
    paused: !isScanning,
    onDecodeResult: (result) => {
      setResult(result.getText());
      setIsScanning(false);
      toast.success('Code Scanned!');
    },
  });

  const mutation = useMutation({
    mutationFn: async (data) => (await api.post('/products/transfer', data)).data,
    onSuccess: () => {
      toast.success(`Stock marked as ${formData.action}`);
      setResult('');
      setFormData({ action: 'Received', location: '', notes: '' });
      setIsScanning(true);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Transfer failed');
      setIsScanning(true); // Retry
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!result) return toast.error("Please scan a batch code first");
    
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
          {/* Camera Section */}
          <div className="relative h-64 bg-black flex items-center justify-center overflow-hidden">
            {isScanning ? (
              <>
                <video ref={ref} className="absolute inset-0 w-full h-full object-cover opacity-80" />
                <div className="relative z-10 w-48 h-48 border-2 border-emerald-500/50 rounded-2xl flex items-center justify-center">
                  <ScanLine size={32} className="text-emerald-500 animate-pulse" />
                </div>
                <div className="absolute bottom-4 bg-black/60 px-4 py-1 rounded-full text-white text-xs font-bold backdrop-blur-sm">
                  Align QR Code
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center text-center p-6">
                <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/20">
                  <PackageCheck size={32} className="text-white" />
                </div>
                <h3 className="text-white font-bold text-xl">{result}</h3>
                <button onClick={() => { setIsScanning(true); setResult(''); }} className="mt-4 text-xs text-emerald-400 hover:underline">Scan Again</button>
              </div>
            )}
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div>
              <h2 className="text-2xl font-display font-bold text-foreground mb-1">Update Custody</h2>
              <p className="text-muted-foreground text-sm">Log the movement of this product batch.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                type="button"
                onClick={() => setFormData({...formData, action: 'Received'})}
                className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                  formData.action === 'Received' 
                    ? 'bg-primary/10 border-primary text-primary' 
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