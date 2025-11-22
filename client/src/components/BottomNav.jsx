import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import useAuthStore from '../store';
import { 
  LayoutDashboard, 
  ShieldCheck, 
  PlusCircle, 
  FileText, 
  ScanLine, 
  ListChecks, 
  User,
  History,
  Globe,
  Building2,
} from 'lucide-react';

const BottomNav = () => {
  const location = useLocation();
  const { userInfo } = useAuthStore();

  if (!userInfo) return null; // Don't show on landing page if not logged in

  const isActive = (path) => location.pathname === path;

  let links = [];

  // Define links based on Role
  if (userInfo.role === 'manufacturer') {
    links = [
      { to: '/manufacturer/portal', label: 'Home', icon: <LayoutDashboard size={20} /> },
      { to: '/manufacturer/inventory', label: 'Stock', icon: <ShieldCheck size={20} /> },
      // FAB: Primary Action
      { to: '/register-batch', label: 'Add', icon: <PlusCircle size={28} />, isFab: true },
      { to: '/manufacturer/reports', label: 'Alerts', icon: <FileText size={20} /> },
      { to: '/profile', label: 'Profile', icon: <User size={20} /> },
    ];
  } else if (userInfo.role === 'consumer') {
    links = [
      { to: '/dashboard', label: 'Home', icon: <LayoutDashboard size={20} /> },
      { to: '/consumer/reports', label: 'History', icon: <History size={20} /> },
      // FAB: Primary Action
      { to: '/verify-product', label: 'Scan', icon: <ScanLine size={28} />, isFab: true },
      { to: '/report', label: 'Report', icon: <FileText size={20} /> },
      { to: '/profile', label: 'Profile', icon: <User size={20} /> },
    ];
  } else if (userInfo.role === 'regulator') {
    links = [
      { to: '/regulator/dashboard', label: 'Home', icon: <LayoutDashboard size={20} /> },
      { to: '/regulator/logs', label: 'Logs', icon: <Globe size={20} /> },
      // FAB: Primary Action
      { to: '/regulator/registry', label: 'Registry', icon: <ShieldCheck size={28} />, isFab: true },
      { to: '/regulator/manufacturers', label: 'Entities', icon: <Building2 size={20} /> },
      { to: '/admin/reports', label: 'Cases', icon: <FileText size={20} /> },
    ];
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-xl border-t border-border h-20 px-6 flex justify-between items-center z-50 pb-safe transition-all duration-300 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
      {links.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          className={`flex flex-col items-center justify-center w-full h-full transition-all relative ${
            isActive(link.to) 
              ? 'text-primary' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {link.isFab ? (
            <div className={`absolute -top-10 p-3 rounded-full border-4 border-background shadow-xl transition-transform ${
              isActive(link.to) ? 'bg-primary text-primary-foreground scale-110' : 'bg-primary text-primary-foreground hover:scale-105'
            }`}>
              {link.icon}
            </div>
          ) : (
            <>
              <div className="mb-1">{link.icon}</div>
              <span className="text-[10px] font-bold uppercase tracking-wide">{link.label}</span>
            </>
          )}
          
          {/* Active Indicator Dot for non-FAB items */}
          {!link.isFab && isActive(link.to) && (
            <span className="absolute -bottom-0.5 w-1 h-1 bg-primary rounded-full" />
          )}
        </Link>
      ))}
    </div>
  );
};

export default BottomNav;