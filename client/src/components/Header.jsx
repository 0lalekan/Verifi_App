import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useAuthStore from '../store';
import { useUserProfile } from '../hooks/useUserProfile';

const Header = () => {
  const navigate = useNavigate();
  const { userInfo, logout } = useAuthStore();
  const { data: userProfile } = useUserProfile({ enabled: !!userInfo });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const logoutHandler = () => {
    logout();
    navigate('/login');
  };

  const getRoleBasedLinks = () => {
    if (!userInfo) return [];

    const links = [];

    if (userInfo.role === 'patient') {
      links.push({ to: '/', label: 'Dashboard' });
      links.push({ to: '/verify-product', label: 'Verify Product' });
      links.push({ to: '/report', label: 'Report Issue' });
    } else if (userInfo.role === 'pharmacist' || userInfo.role === 'admin') {
      links.push({ to: '/', label: 'Dashboard' });
      links.push({ to: '/register-batch', label: 'Register Batch' });
      links.push({ to: '/bulk-upload', label: 'Bulk Upload' });
    } else {
      links.push({ to: '/', label: 'Dashboard' });
    }

    return links;
  };

  const roleLinks = getRoleBasedLinks();

  return (
    <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white shadow-xl">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-18 items-center py-2">
          {/* Left side - Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-2xl font-bold hover:text-blue-200 transition-colors flex items-center">
              <span className="mr-2">🛡️</span>
              Verifi
            </Link>

            {/* Navigation Links */}
            {roleLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium hover:text-blue-200 transition-colors duration-200 hover:bg-white/10 px-3 py-2 rounded-md"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side - User Info and Auth */}
          <div className="flex items-center space-x-4">
            {userInfo ? (
              <>
                <div className="flex items-center space-x-4 bg-black/20 px-4 py-2 rounded-lg">
                  <span className="text-sm font-medium">
                    Welcome, <Link to="/profile" className="text-yellow-300 hover:text-yellow-200 underline font-semibold">{userInfo.firstName || 'User'}</Link>
                  </span>
                  <div className="flex items-center space-x-1 text-yellow-300">
                    <span className="text-lg">🏆</span>
                    <span className="font-medium">{userProfile?.points || 0} pts</span>
                  </div>
                </div>
                <button
                  onClick={logoutHandler}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  🚪 Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                🚀 Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
