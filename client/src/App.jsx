import { useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { Outlet } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import useAuthStore from './store';
import io from 'socket.io-client';

// Initialize socket outside component to prevent reconnections
const socket = io('http://localhost:5000', {
  withCredentials: true,
  transports: ['websocket', 'polling'], // Force specific transports to avoid connection issues
});

const App = () => {
  const { userInfo } = useAuthStore();

  useEffect(() => {
    // Only listen if user is a Regulator
    if (userInfo?.role === 'regulator') {
      socket.on('admin_alert', (data) => {
        // Play sound?
        toast.error(data.message, {
          position: "top-right",
          autoClose: 10000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
      });
    }

    return () => {
      socket.off('admin_alert');
    };
  }, [userInfo]);

  return (
    <>
      <div className="relative z-50">
        <Header />
      </div>
      <main className="flex-grow py-3 z-0 relative">
        <div className="container mx-auto px-4">
          <Outlet />
        </div>
      </main>
      <Footer userRole={userInfo?.role} />
      <ToastContainer />
    </>
  );
};

export default App;