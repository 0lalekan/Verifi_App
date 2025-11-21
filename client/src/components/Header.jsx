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
  X,
  Menu,
  ListChecks
} from 'lucide-react';
import { motion } from 'framer-motion';
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
  };

  const isActive = (path) => location.pathname === path;

  // 1. Logic to determine where the Logo clicks to
  const getHomeRoute = () => {
    if (!userInfo) return '/';
    switch (userInfo.role) {
      case 'manufacturer': return '/manufacturer/portal';
      case 'regulator': return '/regulator/dashboard';
      case 'consumer': return '/dashboard';
      default: return '/dashboard';
    }
  };

  // 2. Logic for Navigation Links
  const getNavLinks = () => {
    if (userInfo?.role === 'manufacturer') {
      return [
        { to: '/manufacturer/portal', label: 'Home', icon: <LayoutDashboard size={20} /> },
        { to: '/manufacturer/inventory', label: 'Inventory', icon: <ShieldCheck size={20} /> },
        { to: '/register-batch', label: 'New Batch', icon: <PlusCircle size={24} />, isPrimary: true },
        { to: '/manufacturer/reports', label: 'Reports', icon: <FileText size={20} /> },
        { to: '/profile', label: 'Profile', icon: <UserCircle size={20} /> },
      ];
    }
    if (userInfo?.role === 'consumer') {
      return [
        { to: '/dashboard', label: 'Home', icon: <LayoutDashboard size={20} /> },
        { to: '/consumer/reports', label: 'Reports', icon: <FileText size={20} /> },
        { to: '/verify-product', label: 'Scan', icon: <ScanLine size={24} />, isPrimary: true },
        { to: '/dashboard', label: 'History', icon: <History size={20} /> },
        { to: '/profile', label: 'Profile', icon: <UserCircle size={20} /> },
      ];
    }
    if (userInfo?.role === 'regulator') {
      return [
        { to: '/regulator/dashboard', label: 'Oversight', icon: <LayoutDashboard size={20} /> },
        { to: '/admin/reports', label: 'Reports', icon: <FileText size={20} /> },
        { to: '/regulator/verification-queue', label: 'Queue', icon: <ListChecks size={20} /> },
        { to: '/profile', label: 'Profile', icon: <UserCircle size={20} /> },
      ];
    }
    // Guest Links
    return [
       { to: '/', label: 'Home', icon: <LayoutDashboard size={20} /> },
       { to: '/login', label: 'Login', icon: <UserCircle size={20} /> }
    ];
  };

  const links = getNavLinks();

  return (
    <>
      {/* --- MOBILE TOP BAR --- */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border h-16 px-4 flex items-center justify-between">
        {/* Updated Link to use getHomeRoute() */}
        <Link to={getHomeRoute()} className="flex items-center gap-2">
          <img src={verifiLogo} alt="Verifi" className="w-9 h-9 object-contain" />
          <span className="font-display font-bold text-xl tracking-tight">Verifi</span>
        </Link>
        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} className="p-2 text-muted-foreground hover:text-foreground">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          {!userInfo && (
             <Link to="/login" className="text-sm font-bold text-primary">Login</Link>
          )}
        </div>
      </header>

      {/* --- MOBILE BOTTOM NAV --- */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-2xl border-t border-border pb-safe pt-2 px-2 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <div className="flex justify-around items-end pb-3">
          {links.map((link) => (
            <Link 
              key={link.to} 
              to={link.to}
              className={`flex flex-col items-center justify-center w-full transition-all duration-300 relative ${
                isActive(link.to) ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {link.isPrimary ? (
                <div className="absolute -top-10">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-xl shadow-primary/30 transition-transform active:scale-95 border-4 border-background ${
                    isActive(link.to) ? 'bg-primary text-primary-foreground' : 'bg-foreground text-background'
                  }`}>
                    {link.icon}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1.5">
                  <motion.div whileTap={{ scale: 0.9 }}>{link.icon}</motion.div>
                  <span className="text-[10px] font-semibold tracking-wide">{link.label}</span>
                </div>
              )}
            </Link>
          ))}
        </div>
      </nav>

      {/* --- DESKTOP FLOATING HEADER --- */}
      <header className="hidden md:block fixed top-6 left-6 right-6 z-50">
        <div className="max-w-7xl mx-auto glass rounded-[2rem] shadow-2xl transition-all duration-500 hover:shadow-brand-500/10">
          <div className="h-24 px-10 flex items-center justify-between">
            
            {/* Updated Logo Link */}
            <Link to={getHomeRoute()} className="flex items-center gap-5 group">
              <div className="relative">
                <div className="absolute inset-0 bg-brand-500/30 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <img src={verifiLogo} alt="Verifi" className="w-14 h-14 object-contain relative z-10 transition-transform duration-300 group-hover:scale-110 drop-shadow-sm" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-3xl font-display font-extrabold tracking-tight text-foreground leading-none">
                  Verifi
                </span>
              </div>
            </Link>

            {/* Nav Pills */}
            <nav className="flex items-center gap-2 bg-secondary/30 p-2 rounded-2xl border border-white/5">
              {userInfo ? links.filter(l => l.label !== 'Profile').map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                    isActive(link.to) 
                      ? 'bg-background text-primary shadow-sm scale-105 ring-1 ring-black/5 dark:ring-white/10' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              )) : (
                <>
                  <Link to="/login" className="px-6 py-3 rounded-xl text-sm font-bold text-muted-foreground hover:bg-background/50">Login</Link>
                  <Link to="/register" className="px-6 py-3 rounded-xl text-sm font-bold bg-background text-foreground shadow-sm hover:scale-105 transition-transform">Get Started</Link>
                </>
              )}
            </nav>

            <div className="flex items-center gap-5">
              <button onClick={toggleTheme} className="p-3 rounded-2xl text-muted-foreground hover:bg-secondary transition-colors border border-transparent hover:border-border/50">
                {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
              </button>
              
              {userInfo && (
                <>
                  <div className="h-10 w-px bg-border/50"></div>
                  <Link to="/profile" className="flex items-center gap-3 pl-2 pr-5 py-2 rounded-full bg-secondary/20 border border-border hover:border-primary/20 transition-all group">
                    <div className="w-11 h-11 rounded-full bg-background ring-2 ring-border group-hover:ring-primary/50 transition-all flex items-center justify-center overflow-hidden">
                      {userProfile?.profileImage ? (
                        <img src={userProfile.profileImage} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <span className="font-bold text-base">{userInfo.firstName.charAt(0)}</span>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold leading-none">{userInfo.firstName}</span>
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">{userInfo.role}</span>
                    </div>
                  </Link>
                  <button onClick={logoutHandler} className="p-3.5 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-2xl transition-all">
                    <LogOut size={24} />
                  </button>
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