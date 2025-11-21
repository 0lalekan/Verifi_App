import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, MapPin, Image as ImageIcon, ShieldAlert } from 'lucide-react';
import Skeleton from '../components/Skeleton';

const ManufacturerReportsScreen = () => {
  const navigate = useNavigate();
  const { data: reports, isLoading } = useQuery({
    queryKey: ['manufacturerReports'],
    queryFn: async () => (await api.get('/reports/manufacturer-reports')).data
  });

  return (
    <div className="min-h-screen w-full bg-background bg-gradient-mesh dark:bg-gradient-mesh-dark p-4 md:p-8 transition-colors duration-500">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => navigate('/manufacturer/portal')} 
            className="mb-6 flex items-center text-muted-foreground hover:text-foreground transition-colors font-medium text-sm"
          >
            <ArrowLeft size={18} className="mr-2" /> Back to Portal
          </button>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 rounded-2xl bg-red-500/10 text-red-600">
                  <ShieldAlert size={28} />
                </div>
                <h1 className="text-3xl font-display font-bold text-foreground">Brand Intelligence</h1>
              </div>
              <p className="text-muted-foreground ml-1">Live feed of incidents and consumer reports involving your products.</p>
            </div>
            <div className="bg-background/50 border border-border px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground">
              Total Reports: <strong className="text-foreground">{reports?.length || 0}</strong>
            </div>
          </div>
        </div>

        {/* Reports Table/Grid */}
        <div className="glass-card overflow-hidden rounded-[2rem]">
          {isLoading ? (
            <div className="p-6 space-y-4">
               {[1,2,3].map(i => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
            </div>
          ) : reports && reports.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/50 bg-secondary/30 text-muted-foreground text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-bold">Product Details</th>
                    <th className="px-6 py-4 font-bold">Issue Reported</th>
                    <th className="px-6 py-4 font-bold">Location</th>
                    <th className="px-6 py-4 font-bold">Evidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {reports.map((report) => (
                    <tr key={report._id} className="hover:bg-secondary/20 transition-colors group">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-bold text-foreground">{report.productName}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-mono bg-secondary/50 px-1.5 py-0.5 rounded text-muted-foreground">
                              {report.batchNumber || 'Unknown Batch'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <p className="text-sm text-foreground line-clamp-2 font-medium">"{report.description}"</p>
                          <span className="text-xs text-muted-foreground mt-1 block">{new Date(report.createdAt).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin size={14} className="shrink-0" />
                          <span className="truncate max-w-[150px]">{report.location}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {report.evidenceImage ? (
                          <a 
                            href={report.evidenceImage} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-600 text-xs font-bold hover:bg-blue-500/20 transition-colors"
                          >
                            <ImageIcon size={14} /> View Photo
                          </a>
                        ) : (
                          <span className="text-xs text-muted-foreground opacity-50">No Image</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-20 text-center flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                <ShieldCheck size={40} />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Clean Record</h3>
              <p className="text-muted-foreground">No adverse reports found matching your inventory.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper for empty state icon
import { ShieldCheck } from 'lucide-react';

export default ManufacturerReportsScreen;