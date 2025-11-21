import { useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { Outlet } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import useAuthStore from './store';
import io from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL 
  ? new URL(import.meta.env.VITE_API_BASE_URL).origin 
  : 'http://localhost:5000';

const socket = io(SOCKET_URL, {
  withCredentials: true,
  transports: ['websocket', 'polling'],
});

const App = () => {
  const { userInfo } = useAuthStore();

  useEffect(() => {
    if (userInfo?.role === 'regulator') {
      socket.on('admin_alert', (data) => {
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
      {/* Header is Fixed/Sticky */}
      <Header />
      
      {/* LAYOUT FIX:
         - pt-20: Enough for the 16-unit mobile header (64px)
         - md:pt-44: Enough for the 24-unit desktop header (96px) + top-6 offset (24px) + breathing room
         - pb-24: Keeps mobile content above the bottom nav bar
      */}
      <main className="flex-grow relative z-0 pt-20 md:pt-44 pb-24 md:pb-0 min-h-screen bg-background transition-colors duration-300">
        <div className="container mx-auto px-4 md:px-6">
          <Outlet />
        </div>
      </main>
      
      <div className="hidden md:block">
        <Footer userRole={userInfo?.role} />
      </div>
      
      <ToastContainer position="bottom-center" theme="colored" />
    </>
  );
};

export default App;