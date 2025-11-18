import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import HomeScreen from './screens/HomeScreen.jsx'
import LoginScreen from './screens/LoginScreen.jsx'
import RegisterScreen from './screens/RegisterScreen.jsx'
import Features from './screens/Features.jsx'
import Pricing from './screens/Pricing.jsx'
import Docs from './screens/Docs.jsx'
import Contact from './screens/Contact.jsx'
import ForgotPasswordScreen from './screens/ForgotPasswordScreen.jsx';
import ResetPasswordScreen from './screens/ResetPasswordScreen.jsx';
import DashboardScreen from './screens/DashboardScreen.jsx'
import ProfileScreen from './screens/ProfileScreen.jsx'
import ProductVerifyScreen from './screens/ProductVerifyScreen.jsx'
import BatchUploadScreen from './screens/BatchUploadScreen.jsx'
import RegisterBatchScreen from './screens/RegisterBatchScreen.jsx'
import AdminDashboardScreen from './screens/AdminDashboardScreen.jsx'
import RegulatorDashboardScreen from './screens/RegulatorDashboardScreen.jsx'
import ReportScreen from './screens/ReportScreen.jsx'
import AdminReportsScreen from './screens/AdminReportsScreen.jsx'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import 'react-toastify/dist/ReactToastify.css';

const queryClient = new QueryClient()

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} element={<DashboardScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
      <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
      <Route path="/reset-password/:token" element={<ResetPasswordScreen />} />
      <Route path="/profile" element={<ProfileScreen />} />
      <Route path="/verify-product" element={<ProductVerifyScreen />} />
      <Route path="/bulk-upload" element={<BatchUploadScreen />} />
      <Route path="/register-batch" element={<RegisterBatchScreen />} />
      <Route path="/report" element={<ReportScreen />} />
      <Route path="/admin/reports" element={<AdminReportsScreen />} />
      <Route path="/admin-dashboard" element={<AdminDashboardScreen />} />
      <Route path="/regulator-map" element={<RegulatorDashboardScreen />} />
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
