import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store';
import { useUserProfile } from '../hooks/useUserProfile';
import { usePWAInstall } from '../hooks/usePWAInstall';
import verifiLogo from '../assets/verifi-logo.png';
import { useTheme } from '../hooks/useTheme';
import { 
  LayoutDashboard, 
  ScanLine, 
  LogOut, 
  UserCircle, 
  Sun, 
  Moon, 
  ShieldCheck,
  PlusCircle,
  FileText,
  History,
  Menu,
  X,
  ListChecks,
  Zap,
  Building2,
  Map,
  Store,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo, logout } = useAuthStore();
  const { data: userProfile } = useUserProfile({ enabled: !!userInfo });
  const { theme, toggleTheme } = useTheme();
  const { isInstallable, installApp } = usePWAInstall();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const logoutHandler = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const getHomeRoute = () => {
    if (!userInfo) return '/';
    switch (userInfo.role) {
      case 'manufacturer': return '/manufacturer/portal';
      case 'regulator': return '/regulator/dashboard';
      case 'consumer': return '/dashboard';
      case 'distributor': case 'retailer': return '/market';
      default: return '/dashboard';
    }
  };

  const getNavLinks = () => {
    if (!userInfo) {
      return [
        { to: '/', label: 'Home', icon: <LayoutDashboard size={20} /> },
        { to: '/features', label: 'Features', icon: <Zap size={20} /> },
        { to: '/pricing', label: 'Pricing', icon: <FileText size={20} /> },
      ];
    }
    if (userInfo.role === 'manufacturer') {
      return [
        { to: '/manufacturer/portal', label: 'Home', icon: <LayoutDashboard size={20} /> },
        { to: '/market', label: 'Market', icon: <Store size={20} /> },
        { to: '/manufacturer/inventory', label: 'Inventory', icon: <ShieldCheck size={20} /> },
        { to: '/register-batch', label: 'New Batch', icon: <PlusCircle size={20} /> },
        { to: '/manufacturer/reports', label: 'Reports', icon: <FileText size={20} /> },
      ];
    }
    if (userInfo.role === 'consumer') {
      return [
        { to: '/dashboard', label: 'Home', icon: <LayoutDashboard size={20} /> },
        { to: '/consumer/map', label: 'Safe Map', icon: <Map size={20} /> },
        { to: '/verify-product', label: 'Scan', icon: <ScanLine size={20} /> },
        { to: '/consumer/reports', label: 'Reports', icon: <FileText size={20} /> },
      ];
    }
    if (userInfo.role === 'regulator') {
      return [
        { to: '/regulator/dashboard', label: 'Oversight', icon: <LayoutDashboard size={20} /> },
        { to: '/regulator/registry', label: 'Registry', icon: <ShieldCheck size={20} /> },
        { to: '/regulator/manufacturers', label: 'Entities', icon: <Building2 size={20} /> },
        { to: '/regulator/logs', label: 'Audit Logs', icon: <History size={20} /> },
        { to: '/admin/reports', label: 'Cases', icon: <FileText size={20} /> },
      ];
    }
    if (['distributor', 'retailer'].includes(userInfo.role)) {
      return [
        { to: '/market', label: 'Market', icon: <Store size={20} /> },
        { to: '/scan-stock', label: 'Receive', icon: <ScanLine size={20} /> },
        { to: '/orders', label: 'Orders', icon: <ListChecks size={20} /> },
      ];
    }
    return [];
  };

  const links = getNavLinks();

  return (
    <>
      {/* --- MOBILE TOP BAR --- */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border h-16 px-4 flex items-center justify-between transition-all duration-300">
        <Link to={getHomeRoute()} className="flex items-center gap-2.5">
          <img src={verifiLogo} alt="Verifi" className="w-8 h-8 object-contain" />
          <span className="font-display font-bold text-xl tracking-tight text-foreground">Verifi</span>
        </Link>
        <div className="flex items-center gap-3">
          <button onClick={toggleTheme} className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-secondary/50 transition-colors">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-foreground">
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* --- MOBILE SIDE DRAWER --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* 1. Backdrop (Dims the screen) */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />
            
            {/* 2. Drawer (Slides from Right) */}
            <motion.div
              initial={{ x: '100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '100%' }} 
              transition={{ type: "spring", damping: 25, stiffness: 200 }} 
              // UPDATED: Applied 'glass' class and 'z-[100]' to fix light mode visibility
              className="md:hidden fixed inset-y-0 right-0 z-[100] w-[75%] max-w-xs glass border-l border-border shadow-2xl flex flex-col"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-6 border-b border-border/50">
                <span className="font-display font-bold text-lg text-foreground">Menu</span>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="p-2 rounded-full hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-2">
                {links.map((link) => (
                  <Link 
                    key={link.to} 
                    to={link.to} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-4 p-3.5 rounded-xl text-sm font-bold transition-all ${
                      isActive(link.to) 
                        ? 'bg-primary/10 text-primary' 
                        : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                    }`}
                  >
                    {link.icon} {link.label}
                  </Link>
                ))}
              </div>

              {/* Drawer Footer */}
              <div className="p-6 border-t border-border/50 space-y-4 bg-secondary/10">
                {/* Mobile Install Button */}
                {isInstallable && (
                  <button 
                    onClick={() => { installApp(); setIsMobileMenuOpen(false); }}
                    className="w-full flex items-center justify-center gap-3 p-3.5 rounded-xl bg-blue-500/10 text-blue-600 font-bold text-sm hover:bg-blue-500/20 transition-colors"
                  >
                    <Download size={18} /> Install App
                  </button>
                )}

                {!userInfo ? (
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-2 w-full p-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity">
                    <LogOut size={18} className="rotate-180" /> Login
                  </Link>
                ) : (
                  <>
                    <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3.5 rounded-xl bg-secondary/50 text-foreground font-bold text-sm">
                      <UserCircle size={20} /> My Profile
                    </Link>
                    <button onClick={logoutHandler} className="flex items-center justify-center gap-2 w-full p-3.5 rounded-xl border border-destructive/30 text-destructive font-bold text-sm hover:bg-destructive/10 transition-colors">
                      <LogOut size={18} /> Sign Out
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- DESKTOP FLOATING HEADER (Unchanged) --- */}
      <header className="hidden md:block fixed top-6 left-0 right-0 z-50 px-6 pointer-events-none">
        <div className="max-w-7xl mx-auto glass rounded-[2rem] shadow-2xl pointer-events-auto transition-all duration-300">
          <div className="h-20 px-8 flex items-center justify-between">
            
            {/* Logo */}
            <Link to={getHomeRoute()} className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <img src={verifiLogo} alt="Verifi" className="w-10 h-10 object-contain relative z-10" />
              </div>
              <span className="text-2xl font-display font-extrabold tracking-tight text-foreground">
                Verifi
              </span>
            </Link>

            {/* Navigation */}
            <nav className="flex items-center gap-1 bg-secondary/40 p-1.5 rounded-2xl border border-white/5">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                    isActive(link.to) 
                      ? 'bg-background text-foreground shadow-sm ring-1 ring-black/5 dark:ring-white/10' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-background/40'
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* User Controls */}
            <div className="flex items-center gap-4">
              
              {/* Desktop Install Button */}
              {isInstallable && (
                <button 
                  onClick={installApp}
                  className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/10 text-blue-600 text-xs font-bold hover:bg-blue-500/20 transition-colors"
                >
                  <Download size={16} /> Install App
                </button>
              )}

              <button onClick={toggleTheme} className="p-2.5 rounded-xl text-muted-foreground hover:bg-secondary/50 transition-colors">
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              
              <div className="h-8 w-px bg-border/60"></div>

              {userInfo ? (
                <div className="flex items-center gap-2 pl-2">
                  <Link to="/profile" className="flex items-center gap-3 pl-1 pr-4 py-1.5 rounded-full hover:bg-secondary/50 transition-all group border border-transparent hover:border-border/50">
                    <div className="w-9 h-9 rounded-full bg-background ring-2 ring-border group-hover:ring-primary/50 transition-all flex items-center justify-center overflow-hidden">
                      {userProfile?.profileImage ? (
                        <img src={userProfile.profileImage} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <span className="font-bold text-sm">{userInfo.firstName.charAt(0)}</span>
                      )}
                    </div>
                    <span className="text-sm font-bold text-foreground hidden xl:block">{userInfo.firstName}</span>
                  </Link>
                  <button onClick={logoutHandler} className="p-2.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all" title="Logout">
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 pl-2">
                  <Link to="/login" className="px-5 py-2.5 rounded-xl text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-background/40 transition-all">Login</Link>
                  <Link to="/register" className="px-6 py-2.5 rounded-xl text-sm font-bold bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">Get Started</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;