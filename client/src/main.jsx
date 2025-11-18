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
import ForgotPasswordScreen from './screens/ForgotPasswordScreen.jsx'
import DashboardScreen from './screens/DashboardScreen.jsx'
import DrugVerifyScreen from './screens/DrugVerifyScreen.jsx'
import AdminDashboardScreen from './screens/AdminDashboardScreen.jsx'
import RegulatorDashboardScreen from './screens/RegulatorDashboardScreen.jsx'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import 'react-toastify/dist/ReactToastify.css';

const queryClient = new QueryClient()

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} element={<DashboardScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/verify-drug" element={<DrugVerifyScreen />} />
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
