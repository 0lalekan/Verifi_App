import Header from './components/Header';
import Footer from './components/Footer';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import useAuthStore from './store';

const App = () => {
  const { userInfo } = useAuthStore();

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
