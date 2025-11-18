import Header from './components/Header';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

const App = () => {
  return (
    <>
      <div className='relative z-50'>
        <Header />
      </div>
      <main className='py-3 z-0 relative'>
        <div className='container mx-auto px-4'>
          <Outlet />
        </div>
      </main>
      <ToastContainer />
    </>
  );
};

export default App;
