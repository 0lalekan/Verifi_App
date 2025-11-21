import React, { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import api from '../api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useUserProfile } from '../hooks/useUserProfile';
import { 
  Upload, 
  FileText, 
  Download, 
  ArrowLeft, 
  Loader2, 
  FileSpreadsheet,
  CheckCircle2
} from 'lucide-react';

const BatchUploadScreen = () => {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const { data: userProfile, isLoading } = useUserProfile();

  useEffect(() => {
    if (!isLoading && userProfile) {
      if (!userProfile.organizationDetails?.isVerified) {
        toast.error("Account verification required.");
        navigate('/manufacturer/portal');
      }
    }
  }, [userProfile, isLoading, navigate]);

  const downloadTemplate = () => {
    const template = 'batchNumber,productName,quantity,expiryDate,manufacturingDate,description\n';
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Verifi_Template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const mutation = useMutation({
    mutationFn: async (formData) => (await api.post('/products/bulk-upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    })).data,
    onSuccess: (data) => {
      toast.success(`Success! Processed ${data.count} records.`);
      setFile(null);
    },
    onError: () => toast.error('Upload failed. Check CSV format.'),
  });

  const handleUpload = (e) => {
    e.preventDefault();
    if (!file) return toast.error('Please select a CSV file');
    const formData = new FormData();
    formData.append('batchFile', file);
    mutation.mutate(formData);
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Checking permissions...</div>;

  return (
    <div className="min-h-screen w-full bg-background bg-gradient-mesh dark:bg-gradient-mesh-dark p-4 md:p-8 transition-colors duration-500 flex flex-col items-center justify-center">
      
      <div className="w-full max-w-xl animate-in slide-in-from-bottom-4 duration-700">
        
        <button onClick={() => navigate(-1)} className="mb-6 flex items-center text-muted-foreground hover:text-foreground transition-colors font-medium text-sm">
          <ArrowLeft size={18} className="mr-2" /> Back to Portal
        </button>

        <div className="glass rounded-[2.5rem] p-1 overflow-hidden shadow-2xl">
          <div className="bg-background/50 backdrop-blur-xl p-8 md:p-12 rounded-[2.3rem] text-center">
            
            <div className="w-20 h-20 bg-blue-500/10 text-blue-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/10">
              <Upload size={40} />
            </div>
            
            <h1 className="text-3xl font-display font-bold text-foreground mb-3">Bulk Inventory Import</h1>
            <p className="text-muted-foreground mb-8 max-w-sm mx-auto text-sm">
              Upload a CSV manifest to register thousands of serialized products instantly.
            </p>

            <form onSubmit={handleUpload} className="space-y-6">
              
              <div 
                className={`relative group border-2 border-dashed rounded-3xl p-10 transition-all duration-300 cursor-pointer ${
                  file 
                    ? 'border-emerald-500 bg-emerald-500/5' 
                    : 'border-border hover:border-primary hover:bg-primary/5'
                }`}
              >
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                />
                
                <div className="space-y-3 relative z-10 flex flex-col items-center">
                  {file ? (
                    <>
                      <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center">
                        <CheckCircle2 size={24} />
                      </div>
                      <div>
                        <p className="font-bold text-foreground text-lg">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                      </div>
                      <button type="button" onClick={(e) => { e.preventDefault(); setFile(null); }} className="text-xs text-red-500 hover:underline z-30 relative font-medium">Remove file</button>
                    </>
                  ) : (
                    <>
                      <div className="w-14 h-14 bg-secondary text-muted-foreground rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <FileSpreadsheet size={28} />
                      </div>
                      <div>
                        <p className="font-bold text-foreground">Click to upload</p>
                        <p className="text-xs text-muted-foreground">or drag and drop CSV file</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <button
                  type="button"
                  onClick={downloadTemplate}
                  className="flex items-center justify-center gap-2 py-4 px-4 rounded-xl font-bold text-sm border border-border bg-secondary/30 hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                >
                  <Download size={18} /> Template
                </button>
                <button
                  type="submit"
                  disabled={mutation.isPending || !file}
                  className="flex items-center justify-center gap-2 py-4 px-4 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
                >
                  {mutation.isPending ? <Loader2 className="animate-spin" /> : 'Start Import'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchUploadScreen;