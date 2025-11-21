import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import FakeMapComponent from '../components/FakeMapComponent';
import { 
  ArrowLeft, 
  Filter, 
  MapPin, 
  Eye, 
  MoreHorizontal, 
  CheckCircle2, 
  AlertCircle, 
  Clock,
  XCircle
} from 'lucide-react';
import Skeleton from '../components/Skeleton';

const AdminReportsScreen = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedMapLocation, setSelectedMapLocation] = useState(null);

  const { data: reports, isLoading } = useQuery({
    queryKey: ['allReports'],
    queryFn: async () => (await api.get('/reports')).data,
  });

  const mutation = useMutation({
    mutationFn: async ({ id, status }) => {
      await api.put(`/reports/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['allReports']);
      toast.success('Case status updated');
    },
    onError: () => toast.error('Failed to update status'),
  });

  const handleStatusChange = (id, newStatus) => {
    if (window.confirm(`Mark this case as ${newStatus}?`)) {
      mutation.mutate({ id, status: newStatus });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Resolved': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      case 'Investigating': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'Rejected': return 'bg-red-500/10 text-red-600 border-red-500/20';
      default: return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
    }
  };

  return (
    <div className="min-h-screen w-full bg-background bg-gradient-mesh dark:bg-gradient-mesh-dark p-4 md:p-8 transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
          <div>
            <button onClick={() => navigate('/regulator/dashboard')} className="mb-4 flex items-center text-muted-foreground hover:text-foreground transition-colors font-medium text-sm">
              <ArrowLeft size={18} className="mr-2" /> Dashboard
            </button>
            <h1 className="text-3xl font-display font-bold text-foreground">Case Management</h1>
            <p className="text-muted-foreground mt-1">Triage and resolve whistleblower reports.</p>
          </div>
          
          <div className="flex gap-3">
            <div className="bg-background/60 backdrop-blur-md border border-border px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 shadow-sm">
              <Filter size={16} className="text-muted-foreground" />
              <span>All Cases ({reports?.length || 0})</span>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="glass-card overflow-hidden rounded-[2rem]">
          {isLoading ? (
             <div className="p-6 space-y-4">
               {[1,2,3,4].map(i => <Skeleton key={i} className="h-14 w-full rounded-xl" />)}
             </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/50 bg-secondary/30 text-muted-foreground text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-bold">Reported Item</th>
                    <th className="px-6 py-4 font-bold">Description</th>
                    <th className="px-6 py-4 font-bold">Location</th>
                    <th className="px-6 py-4 font-bold">Status</th>
                    <th className="px-6 py-4 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {reports?.map((report) => (
                    <tr key={report._id} className="hover:bg-secondary/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-foreground">{report.productName}</div>
                        <div className="text-xs font-mono text-muted-foreground bg-secondary/50 inline-block px-1.5 rounded mt-1">
                          {report.batchNumber || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-xs truncate text-sm text-muted-foreground" title={report.description}>
                          {report.description}
                        </div>
                        {report.evidenceImage && (
                          <a href={report.evidenceImage} target="_blank" rel="noreferrer" className="text-xs text-blue-500 font-bold hover:underline mt-1 inline-flex items-center gap-1">
                            <Eye size={10} /> Evidence
                          </a>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {report.coordinates ? (
                          <button 
                            onClick={() => setSelectedMapLocation(report)}
                            className="flex items-center gap-1 text-xs font-bold text-primary hover:underline bg-primary/10 px-2 py-1 rounded-lg transition-colors"
                          >
                            <MapPin size={12} /> View Map
                          </button>
                        ) : (
                          <span className="text-sm text-muted-foreground truncate max-w-[120px] block" title={report.location}>
                            {report.location}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wide ${getStatusColor(report.status)}`}>
                          {report.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="relative inline-block group">
                          <select
                            value={report.status}
                            onChange={(e) => handleStatusChange(report._id, e.target.value)}
                            className="appearance-none bg-background border border-border hover:border-primary text-foreground text-xs font-bold py-2 pl-3 pr-8 rounded-lg cursor-pointer outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Investigating">Investigate</option>
                            <option value="Resolved">Resolve</option>
                            <option value="Rejected">Reject</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-muted-foreground">
                            <MoreHorizontal size={14} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Map Modal */}
      {selectedMapLocation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setSelectedMapLocation(null)}>
          <div className="w-full max-w-3xl bg-background rounded-[2rem] overflow-hidden shadow-2xl border border-border animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
             <div className="p-5 border-b border-border flex justify-between items-center bg-secondary/30">
                <h3 className="font-bold text-foreground flex items-center gap-2">
                  <MapPin className="text-red-500" size={20} /> Incident Location
                </h3>
                <button onClick={() => setSelectedMapLocation(null)} className="p-2 hover:bg-background rounded-full transition-colors">
                  <XCircle size={24} className="text-muted-foreground" />
                </button>
             </div>
             <div className="h-96 relative">
                <FakeMapComponent scanLogs={[{ location: selectedMapLocation.coordinates, status: 'Fake' }]} />
             </div>
             <div className="p-4 bg-background text-xs text-muted-foreground font-mono border-t border-border">
                GPS: {selectedMapLocation.coordinates.latitude.toFixed(6)}, {selectedMapLocation.coordinates.longitude.toFixed(6)}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReportsScreen;