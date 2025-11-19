import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store';
import { useUserProfile } from '../hooks/useUserProfile';
import verifiLogo from '../assets/verifi-logo.png';

const Header = () => {
  const navigate = useNavigate();
  const { userInfo, logout } = useAuthStore();
  const { data: userProfile } = useUserProfile({ enabled: !!userInfo });

  const logoutHandler = () => {
    logout();
    navigate('/login');
  };

  const getHomeRoute = () => {
    if (!userInfo) return '/'; 
    switch (userInfo.role) {
      case 'manufacturer': return '/manufacturer/portal';
      case 'regulator': return '/regulator/dashboard';
      case 'consumer': default: return '/dashboard';
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
        const manufacturerLinks = [{ to: '/manufacturer/portal', label: 'Portal' }];
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
      default: return [{ to: '/dashboard', label: 'Dashboard' }];
    }
  };

  const navLinks = getRoleBasedLinks();
  
  // Image URL Logic (Relative path handling)
  const profileImg = userProfile?.profileImage 
    ? `http://localhost:5000${userProfile.profileImage}` 
    : null;

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          <Link to={getHomeRoute()} className="flex items-center gap-2 group">
            <img src={verifiLogo} alt="Verifi Logo" className="w-8 h-8 rounded-lg shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform" />
            <span className="text-xl font-bold text-slate-800 tracking-tight">Verifi</span>
          </Link>

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

          <div className="flex items-center gap-4">
            {userInfo ? (
              <>
                <Link 
                  to="/profile" 
                  className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-1.5 pr-3 rounded-xl transition-all group border border-transparent hover:border-slate-100"
                >
                  <div className="w-9 h-9 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm flex items-center justify-center">
                    {profileImg ? (
                      <img src={profileImg} alt="User" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-sm font-bold text-slate-500">
                        {userInfo.firstName.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="hidden sm:flex flex-col items-start">
                    <span className="text-sm font-bold text-slate-800 group-hover:text-blue-600 leading-tight">
                      {userInfo.firstName}
                    </span>
                    <span className="text-[10px] text-slate-500 capitalize leading-tight">
                      {userInfo.role}
                    </span>
                  </div>
                </Link>
                
                <button
                  onClick={logoutHandler}
                  className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Logout"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
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
