import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';

import { AuthProvider, useAuth } from './context/AuthContext';
import { QueryProvider } from './context/QueryContext';
import CustomerLayout from './components/layout/CustomerLayout';

import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Queries from './pages/Queries';
import NewQuery from './pages/NewQuery';
import QueryDetails from './pages/QueryDetails';
import Profile from './pages/Profile';
import Support from './pages/Support';

function FullPageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f8fc]">
      <div className="text-center">
        <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
        <p className="mt-3 text-sm font-semibold text-slate-500">
          Checking your session...
        </p>
      </div>
    </div>
  );
}

function ProtectedRoute() {
  const { isLoggedIn, authLoading } = useAuth();
  const location = useLocation();

  if (authLoading) return <FullPageLoader />;

  if (!isLoggedIn) {
    return (
      <Navigate
        to="/"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return <Outlet />;
}

function PublicOnlyRoute() {
  const { isLoggedIn, authLoading } = useAuth();

  if (authLoading) return <FullPageLoader />;

  return isLoggedIn ? <Navigate to="/dashboard" replace /> : <Outlet />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<CustomerLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/queries" element={<Queries />} />
          <Route path="/queries/:id" element={<QueryDetails />} />
          <Route path="/new-query" element={<NewQuery />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/support" element={<Support />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <QueryProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </QueryProvider>
    </AuthProvider>
  );
}
