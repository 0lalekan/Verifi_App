import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import 'react-toastify/dist/ReactToastify.css';

// --- Screens ---
import HomeScreen from './screens/HomeScreen.jsx'
import LoginScreen from './screens/LoginScreen.jsx'
import RegisterScreen from './screens/RegisterScreen.jsx'
import ForgotPasswordScreen from './screens/ForgotPasswordScreen.jsx';
import ResetPasswordScreen from './screens/ResetPasswordScreen.jsx';
import ProfileScreen from './screens/ProfileScreen.jsx'

// Static Pages (NEW)
import Features from './screens/Features.jsx';
import Pricing from './screens/Pricing.jsx';
import Docs from './screens/Docs.jsx';
import Contact from './screens/Contact.jsx';
import Privacy from './screens/Privacy.jsx';
import Terms from './screens/Terms.jsx';

// Consumer Screens
import DashboardScreen from './screens/DashboardScreen.jsx'
import ConsumerScanScreen from './screens/ConsumerScanScreen.jsx' 
import ReportScreen from './screens/ReportScreen.jsx'
import ConsumerReportsScreen from './screens/ConsumerReportsScreen.jsx'

// Manufacturer Screens
import ManufacturerPortalScreen from './screens/ManufacturerPortalScreen.jsx'
import RegisterBatchScreen from './screens/RegisterBatchScreen.jsx'
import BatchUploadScreen from './screens/BatchUploadScreen.jsx'
import ManufacturerInventoryScreen from './screens/ManufacturerInventoryScreen.jsx'
import ManufacturerReportsScreen from './screens/ManufacturerReportsScreen.jsx' 

// Regulator/Admin Screens
import RegulatorDashboardScreen from './screens/RegulatorDashboardScreen.jsx'
import AdminReportsScreen from './screens/AdminReportsScreen.jsx'
import VerificationQueueScreen from './screens/VerificationQueueScreen.jsx'

const queryClient = new QueryClient()

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      
      {/* === Public Routes === */}
      <Route index={true} element={<HomeScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
      <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
      <Route path="/reset-password/:token" element={<ResetPasswordScreen />} />

      {/* === Content Routes (NEW) === */}
      <Route path="/features" element={<Features />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/docs" element={<Docs />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />

      {/* === Protected / General === */}
      <Route path="/dashboard" element={<DashboardScreen />} />
      <Route path="/profile" element={<ProfileScreen />} />

      {/* === Consumer Routes === */}
      <Route path="/verify-product" element={<ConsumerScanScreen />} />
      <Route path="/report" element={<ReportScreen />} />
      <Route path="/consumer/reports" element={<ConsumerReportsScreen />} />

      {/* === Manufacturer Routes === */}
      <Route path="/manufacturer/portal" element={<ManufacturerPortalScreen />} />
      <Route path="/register-batch" element={<RegisterBatchScreen />} />
      <Route path="/bulk-upload" element={<BatchUploadScreen />} />
      <Route path="/manufacturer/inventory" element={<ManufacturerInventoryScreen />} />
      <Route path="/manufacturer/reports" element={<ManufacturerReportsScreen />} />

      {/* === Regulator/Admin Routes === */}
      <Route path="/regulator/dashboard" element={<RegulatorDashboardScreen />} />
      <Route path="/regulator/verification-queue" element={<VerificationQueueScreen />} />
      <Route path="/admin/reports" element={<AdminReportsScreen />} />
      
    </Route>
  ),
)

createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  </QueryClientProvider>,
)