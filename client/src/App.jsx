import { useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import BottomNav from './components/BottomNav';
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
      
      {/* Main Content 
         pb-24 is critical here: it reserves space so the BottomNav doesn't cover content 
      */}
      <main className="flex-grow relative z-0 pt-20 md:pt-44 pb-24 md:pb-0 min-h-screen bg-background transition-colors duration-300">
        <div className="container mx-auto px-4 md:px-6">
          <Outlet />
        </div>
      </main>
      
      {/* Desktop Footer */}
      <div className="hidden md:block">
        <Footer userRole={userInfo?.role} />
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav /> {/* <--- Add this line */}
      
      {/* Ensure Toast doesn't get hidden behind the nav */}
      <ToastContainer position="top-center" theme="colored" className="mb-20 md:mb-0" />
    </>
  );
};

export default App;