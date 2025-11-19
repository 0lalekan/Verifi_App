import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import 'react-toastify/dist/ReactToastify.css';

// Screens
import HomeScreen from './screens/HomeScreen.jsx';
import LoginScreen from './screens/LoginScreen.jsx';
import RegisterScreen from './screens/RegisterScreen.jsx';
import DashboardScreen from './screens/DashboardScreen.jsx';
import ConsumerScanScreen from './screens/ConsumerScanScreen.jsx';
import ReportScreen from './screens/ReportScreen.jsx';
import ManufacturerPortalScreen from './screens/ManufacturerPortalScreen.jsx';
import RegisterBatchScreen from './screens/RegisterBatchScreen.jsx';
import BatchUploadScreen from './screens/BatchUploadScreen.jsx';
import RegulatorDashboardScreen from './screens/RegulatorDashboardScreen.jsx';
import ProfileScreen from './screens/ProfileScreen.jsx';

// Components
import ManufacturerTimeline from './components/ManufacturerTimeline.jsx';

const queryClient = new QueryClient();

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      {/* Public Routes */}
      <Route index={true} element={<HomeScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
      
      {/* Private/Protected Routes */}
      <Route path="/dashboard" element={<DashboardScreen />} />
      <Route path="/profile" element={<ProfileScreen />} />

      {/* Consumer Routes */}
      <Route path="/verify-product" element={<ConsumerScanScreen />} />
      <Route path="/report" element={<ReportScreen />} />

      {/* Manufacturer Routes */}
      <Route path="/manufacturer/portal" element={<ManufacturerPortalScreen />} />
      <Route path="/register-batch" element={<RegisterBatchScreen />} />
      <Route path="/bulk-upload" element={<BatchUploadScreen />} />
      <Route path="/manufacturer/timeline" element={
        <div className="min-h-screen bg-slate-50 py-12">
           {/* Placeholder data until backend connection is fully verified */}
           <ManufacturerTimeline productHistory={[]} />
        </div>
      } />

      {/* Regulator Routes */}
      <Route path="/regulator/dashboard" element={<RegulatorDashboardScreen />} />
    </Route>
  )
);

createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  </QueryClientProvider>
);