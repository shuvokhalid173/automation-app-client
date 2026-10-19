import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import PlatformsPage from './components/PlatformsPage';
import Dashboard from './components/Dashboard';
import SettingsPage from './components/SettingsPage';
import AdminPage from './components/AdminPage';
import Login from './components/Login';
import OAuthCallback from './components/OAuthCallback';
import EtsyOAuthCallback from './components/EtsyOAuthCallback';

function DashboardRouteWrapper() {
  const navigate = useNavigate();
  return <Dashboard onOpenSettings={() => navigate('/settings')} />;
}

function SettingsRouteWrapper() {
  return <SettingsPage />;
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

// Admin-only route wrapper: accessible ONLY by authenticated system owner (ADMIN_EMAIL)
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

// Public-only route wrapper: redirects already logged-in users away from /login
function PublicOnlyRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
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
            <Route path="/oauth/etsy/callback" element={<OAuthCallback platform="etsy" />} />
            <Route path="/oauth/paypal/callback" element={<OAuthCallback platform="paypal" />} />
            <Route path="/oauth/callback" element={<OAuthCallback />} />
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

            {/* Settings route (accessible to authenticated users) */}
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <SettingsRouteWrapper />
                </ProtectedRoute>
              }
            />

            {/* Admin routes (strictly guarded for system owner / ADMIN_EMAIL) */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/domains"
              element={
                <AdminRoute>
                  <AdminPage activeTab="domains" />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/mailboxes"
              element={
                <AdminRoute>
                  <AdminPage activeTab="mailboxes" />
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
