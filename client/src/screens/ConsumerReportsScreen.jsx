import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle, CheckCircle2, XCircle, Clock, FileText } from 'lucide-react';
import Skeleton from '../components/Skeleton';

const ConsumerReportsScreen = () => {
  const navigate = useNavigate();
  const { data: reports, isLoading } = useQuery({
    queryKey: ['myReports'],
    queryFn: async () => (await api.get('/reports/my-reports')).data
  });

  // Helper for Status Badges
  const getStatusBadge = (status) => {
    const styles = {
      Resolved: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
      Investigating: "bg-blue-500/10 text-blue-600 border-blue-500/20",
      Rejected: "bg-red-500/10 text-red-600 border-red-500/20",
      Pending: "bg-amber-500/10 text-amber-600 border-amber-500/20"
    };
    const icons = {
      Resolved: <CheckCircle2 size={14} />,
      Investigating: <Clock size={14} />,
      Rejected: <XCircle size={14} />,
      Pending: <AlertCircle size={14} />
    };

    return (
      <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wide ${styles[status] || styles.Pending}`}>
        {icons[status] || icons.Pending}
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen w-full bg-background bg-gradient-mesh dark:bg-gradient-mesh-dark p-4 md:p-8 transition-colors duration-500">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => navigate(-1)} 
            className="mb-6 flex items-center text-muted-foreground hover:text-foreground transition-colors font-medium text-sm"
          >
            <ArrowLeft size={18} className="mr-2" /> Back to Dashboard
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-2xl bg-red-500/10 text-red-600">
              <FileText size={24} />
            </div>
            <h1 className="text-3xl font-display font-bold text-foreground">My Reports</h1>
          </div>
          <p className="text-muted-foreground ml-1">Track the status of your submitted safety alerts.</p>
        </div>

        {/* Reports List */}
        <div className="space-y-4">
          {isLoading ? (
            [1, 2, 3].map(i => <Skeleton key={i} className="h-40 w-full rounded-[2rem]" />)
          ) : reports && reports.length > 0 ? (
            reports.map((report) => (
              <div key={report._id} className="glass-card p-6 rounded-[2rem] hover:border-primary/30 transition-all group">
                
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{report.productName}</h3>
                    <span className="text-xs text-muted-foreground">{new Date(report.createdAt).toLocaleDateString()}</span>
                  </div>
                  {getStatusBadge(report.status)}
                </div>
                
                <div className="bg-secondary/30 p-4 rounded-xl border border-border/50 mb-4">
                  <p className="text-sm text-muted-foreground italic">"{report.description}"</p>
                </div>

                {report.adminNotes && (
                  <div className="flex gap-3 mt-4 pl-4 border-l-2 border-blue-500/50">
                    <div className="text-xs font-bold text-blue-600 uppercase tracking-wider shrink-0 mt-0.5">Response</div>
                    <p className="text-sm text-foreground">{report.adminNotes}</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="glass-card p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 size={32} className="text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">No Issues Reported</h3>
              <p className="text-muted-foreground max-w-xs mx-auto mb-6">
                You haven't flagged any suspicious products yet. Stay safe!
              </p>
              <Link to="/report" className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
                Submit a Report
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsumerReportsScreen;