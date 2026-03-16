import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard  from './pages/AdminDashboard';
import ProductDetail   from './pages/ProductDetail';
import AdminLogin      from './pages/AdminLogin';
import ForgotPassword  from './pages/ForgotPassword';
import ResetPassword   from './pages/ResetPassword';
import InvestorLogin   from './pages/InvestorLogin';
import InvestorView    from './pages/InvestorView';

// Admin protected route
function AdminRoute({ children }) {
  const token = localStorage.getItem('admin_token');
  return token ? children : <Navigate to="/admin/login" replace />;
}

// Investor protected route
function InvestorRoute({ children }) {
  const token = localStorage.getItem('investor_token');
  return token ? children : <Navigate to="/investor/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin routes — protected */}
        <Route path="/" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/product/:id" element={<AdminRoute><ProductDetail /></AdminRoute>} />

        {/* Admin auth */}
        <Route path="/admin/login"          element={<AdminLogin />} />
        <Route path="/admin/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin/reset-password/:token" element={<ResetPassword />} />

        {/* Investor routes */}
        <Route path="/investor/login"     element={<InvestorLogin />} />
        <Route path="/investor/dashboard" element={<InvestorRoute><InvestorView /></InvestorRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}