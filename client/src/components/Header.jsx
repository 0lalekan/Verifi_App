import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store';
import { useUserProfile } from '../hooks/useUserProfile';

const Header = () => {
  const navigate = useNavigate();
  const { userInfo, logout } = useAuthStore();
  // We fetch the full profile here to check verification status
  const { data: userProfile } = useUserProfile({ enabled: !!userInfo });

  const logoutHandler = () => {
    logout();
    navigate('/login');
  };

  // Logic to determine where the Logo clicks to
  const getHomeRoute = () => {
    if (!userInfo) return '/'; 

    switch (userInfo.role) {
      case 'manufacturer':
        return '/manufacturer/portal';
      case 'regulator':
        return '/regulator/dashboard';
      case 'consumer':
      default:
        return '/dashboard';
    }
  };

  const getRoleBasedLinks = () => {
    if (!userInfo) return [];
    
    switch (userInfo.role) {
      case 'consumer':
        return [
          { to: '/dashboard', label: 'Home' },
          { to: '/verify-product', label: 'Scan Now' },
          { to: '/report', label: 'Report' }
        ];
      case 'manufacturer':
        // Base link that is always accessible
        const manufacturerLinks = [
          { to: '/manufacturer/portal', label: 'Portal' }
        ];
        
        // SECURITY CHECK: Only show these if verified
        if (userProfile?.organizationDetails?.isVerified) {
          manufacturerLinks.push(
            { to: '/register-batch', label: 'New Batch' },
            { to: '/bulk-upload', label: 'Bulk Upload' }
          );
        }
        
        return manufacturerLinks;

      case 'regulator':
        return [
          { to: '/regulator/dashboard', label: 'Oversight' },
          { to: '/admin/reports', label: 'Reports' }
        ];
      default:
        return [{ to: '/dashboard', label: 'Dashboard' }];
    }
  };

  const navLinks = getRoleBasedLinks();

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo - Dynamic */}
          <Link to={getHomeRoute()} className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
              V
            </div>
            <span className="text-xl font-bold text-slate-800 tracking-tight">Verifi</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-all"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth Actions */}
          <div className="flex items-center gap-4">
            {userInfo ? (
              <>
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-sm font-bold text-slate-800">{userInfo.firstName}</span>
                  <span className="text-xs text-slate-500 capitalize">{userInfo.role}</span>
                </div>
                <button
                  onClick={logoutHandler}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-red-600 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex gap-3">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900">
                  Log in
                </Link>
                <Link to="/register" className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;