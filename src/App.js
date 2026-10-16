import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import PlatformsPage from './components/PlatformsPage';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import Login from './components/Login';
import EtsyOAuthCallback from './components/EtsyOAuthCallback';

function DashboardRouteWrapper() {
  const navigate = useNavigate();
  return <Dashboard onOpenSettings={() => navigate('/settings')} />;
}

function SettingsRouteWrapper() {
  const navigate = useNavigate();
  return <Settings onBack={() => navigate('/file-dashboard')} />;
}

// Protected route wrapper: redirects unauthenticated users to /login
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

// Public-only route wrapper: redirects already logged-in users away from /login
function PublicOnlyRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/platforms" replace />;
  }
  return children;
}

// Admin-only route wrapper: redirects non-admin users to /platforms
function AdminRoute({ children }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (!user?.isAdmin) {
    return <Navigate to="/platforms" replace />;
  }
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            {/* Redirect / to /platforms */}
            <Route path="/" element={<Navigate to="/platforms" replace />} />

            {/* Public routes */}
            <Route path="/platforms" element={<PlatformsPage />} />
            <Route path="/oauth/etsy/callback" element={<EtsyOAuthCallback />} />
            <Route path="/oauth/callback" element={<Navigate to="/oauth/etsy/callback" replace />} />
            <Route
              path="/login"
              element={
                <PublicOnlyRoute>
                  <Login />
                </PublicOnlyRoute>
              }
            />

            {/* Protected routes: redirect to /login if unauthenticated */}
            <Route
              path="/file-dashboard"
              element={
                <ProtectedRoute>
                  <DashboardRouteWrapper />
                </ProtectedRoute>
              }
            />

            {/* Admin-only settings route */}
            <Route
              path="/settings"
              element={
                <AdminRoute>
                  <SettingsRouteWrapper />
                </AdminRoute>
              }
            />

            {/* Catch-all redirect to /platforms */}
            <Route path="*" element={<Navigate to="/platforms" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
