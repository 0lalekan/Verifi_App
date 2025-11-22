import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store';
import { useUserProfile } from '../hooks/useUserProfile';
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
  Building2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo, logout } = useAuthStore();
  const { data: userProfile } = useUserProfile({ enabled: !!userInfo });
  const { theme, toggleTheme } = useTheme();
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
      default: return '/dashboard';
    }
  };

  const getNavLinks = () => {
    if (userInfo?.role === 'manufacturer') {
      return [
        { to: '/manufacturer/portal', label: 'Home', icon: <LayoutDashboard size={20} /> },
        { to: '/manufacturer/inventory', label: 'Inventory', icon: <ShieldCheck size={20} /> },
        { to: '/register-batch', label: 'New Batch', icon: <PlusCircle size={20} /> },
        { to: '/manufacturer/reports', label: 'Reports', icon: <FileText size={20} /> },
      ];
    }
    if (userInfo?.role === 'consumer') {
      return [
        { to: '/dashboard', label: 'Home', icon: <LayoutDashboard size={20} /> },
        { to: '/verify-product', label: 'Scan', icon: <ScanLine size={20} /> },
        { to: '/consumer/reports', label: 'Reports', icon: <FileText size={20} /> },
      ];
    }
    if (userInfo?.role === 'regulator') {
      return [
        { to: '/regulator/dashboard', label: 'Oversight', icon: <LayoutDashboard size={20} /> },
        { to: '/regulator/registry', label: 'Registry', icon: <ShieldCheck size={20} /> },
        { to: '/regulator/manufacturers', label: 'Entities', icon: <Building2 size={20} /> },
        { to: '/regulator/logs', label: 'Audit Logs', icon: <History size={20} /> },
        { to: '/admin/reports', label: 'Cases', icon: <FileText size={20} /> },
        { to: '/regulator/verification-queue', label: 'Queue', icon: <ListChecks size={20} /> },
      ];
    }
    return [
       { to: '/', label: 'Home', icon: <LayoutDashboard size={20} /> },
       { to: '/features', label: 'Features', icon: <Zap size={20} /> }
    ];
  };

  const links = getNavLinks();

  return (
    <>
      {/* --- MOBILE TOP BAR --- */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border h-16 px-4 flex items-center justify-between transition-all duration-300">
        <Link to={getHomeRoute()} className="flex items-center gap-2.5">
          <img src={verifiLogo} alt="Verifi" className="w-8 h-8 object-contain" />
          <span className="font-display font-bold text-xl tracking-tight text-foreground">Verifi</span>
        </Link>
        <div className="flex items-center gap-3">
          <button onClick={toggleTheme} className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-secondary/50 transition-colors">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          {userInfo ? (
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-foreground">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          ) : (
            <Link to="/login" className="text-sm font-bold text-primary bg-primary/10 px-4 py-2 rounded-full">Login</Link>
          )}
        </div>
      </header>

      {/* --- MOBILE MENU OVERLAY --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed inset-0 z-40 bg-background pt-24 px-6 pb-6 flex flex-col gap-4"
          >
            {links.map((link) => (
              <Link 
                key={link.to} 
                to={link.to} 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-4 p-4 rounded-2xl text-lg font-bold transition-all ${
                  isActive(link.to) ? 'bg-primary text-primary-foreground' : 'bg-secondary/50 text-muted-foreground'
                }`}
              >
                {link.icon} {link.label}
              </Link>
            ))}
            <div className="h-px bg-border my-2" />
            <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/30 text-foreground font-bold">
              <UserCircle size={20} /> Profile
            </Link>
            <button onClick={logoutHandler} className="flex items-center gap-4 p-4 rounded-2xl bg-destructive/10 text-destructive font-bold mt-auto">
              <LogOut size={20} /> Sign Out
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- DESKTOP FLOATING HEADER --- */}
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
              {userInfo ? links.map((link) => (
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
              )) : (
                <>
                  <Link to="/features" className="px-5 py-2.5 rounded-xl text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-background/40 transition-all">Features</Link>
                  <Link to="/pricing" className="px-5 py-2.5 rounded-xl text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-background/40 transition-all">Pricing</Link>
                  <Link to="/login" className="px-5 py-2.5 rounded-xl text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-background/40 transition-all">Login</Link>
                  <Link to="/register" className="px-6 py-2.5 rounded-xl text-sm font-bold bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">Get Started</Link>
                </>
              )}
            </nav>

            {/* User Controls */}
            <div className="flex items-center gap-4">
              <button onClick={toggleTheme} className="p-2.5 rounded-xl text-muted-foreground hover:bg-secondary/50 transition-colors">
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              
              {userInfo && (
                <>
                  <div className="h-8 w-px bg-border/60"></div>
                  <div className="flex items-center gap-2 pl-2">
                    <Link to="/profile" className="flex items-center gap-3 pl-1 pr-4 py-1.5 rounded-full hover:bg-secondary/50 transition-all group border border-transparent hover:border-border/50">
                      <div className="w-9 h-9 rounded-full bg-background ring-2 ring-border group-hover:ring-primary/50 transition-all flex items-center justify-center overflow-hidden">
                        {userProfile?.profileImage ? (
                          <img src={userProfile.profileImage} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <span className="font-bold text-sm">{userInfo.firstName.charAt(0)}</span>
                        )}
                      </div>
                      <span className="text-sm font-bold text-foreground">{userInfo.firstName}</span>
                    </Link>
                    <button onClick={logoutHandler} className="p-2.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all" title="Logout">
                      <LogOut size={20} />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;