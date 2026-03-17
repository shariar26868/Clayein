import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard  from './pages/AdminDashboard';
import ProductDetail   from './pages/ProductDetail';
import AdminLogin      from './pages/AdminLogin';
import ForgotPassword  from './pages/ForgotPassword';
import ResetPassword   from './pages/ResetPassword';
import InvestorLogin   from './pages/InvestorLogin';
import InvestorView    from './pages/InvestorView';

function AdminRoute({ children }) {
  const token = localStorage.getItem('admin_token');
  return token ? children : <Navigate to="/admin/login" replace />;
}

function InvestorRoute({ children }) {
  const token = localStorage.getItem('investor_token');
  return token ? children : <Navigate to="/investor/login" replace />;
}

export default function App() {
  // Apply saved theme on load
  useEffect(() => {
    const saved = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"               element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/product/:id"    element={<AdminRoute><ProductDetail /></AdminRoute>} />

        <Route path="/admin/login"              element={<AdminLogin />} />
        <Route path="/admin/forgot-password"    element={<ForgotPassword />} />
        <Route path="/admin/reset-password/:token" element={<ResetPassword />} />

        <Route path="/investor/login"     element={<InvestorLogin />} />
        <Route path="/investor/dashboard" element={<InvestorRoute><InvestorView /></InvestorRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}