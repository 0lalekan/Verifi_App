import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store';
import { useUserProfile } from '../hooks/useUserProfile';

const Header = () => {
  const navigate = useNavigate();
  const { userInfo, logout } = useAuthStore();
  const { data: userProfile } = useUserProfile({ enabled: !!userInfo });

  const logoutHandler = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-slate-900 text-white shadow-lg">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left side - Logo and Dashboard Link */}
          <div className="flex items-center space-x-6">
          <Link to="/" className="text-xl font-bold hover:text-slate-300 transition-colors">
            OgaMed
          </Link>
            {userInfo && (
              <Link to="/dashboard" className="text-sm hover:text-slate-300 transition-colors">
                Dashboard
              </Link>
            )}
          </div>

          {/* Right side - Auth */}
          <div className="flex items-center space-x-4">
            {userInfo ? (
              <>
                <span className="text-sm">
                  Welcome, {userInfo.firstName || 'User'} ({userProfile?.points || 0} pts)
                </span>
                <button
                  onClick={logoutHandler}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
