import React from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f8fafc',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  navbar: {
    height: '64px',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 28px',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    textDecoration: 'none',
    color: '#0f172a',
  },
  logoBadge: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    fontWeight: '800',
    fontSize: '18px',
    boxShadow: '0 2px 4px rgba(37, 99, 235, 0.25)',
  },
  logoText: {
    fontSize: '20px',
    fontWeight: '800',
    letterSpacing: '-0.5px',
    color: '#0f172a',
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  userPill: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 14px',
    backgroundColor: '#f1f5f9',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#334155',
    border: '1px solid #e2e8f0',
  },
  userAvatar: {
    width: '22px',
    height: '22px',
    borderRadius: '50%',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: '700',
  },
  btnPrimary: {
    padding: '8px 18px',
    borderRadius: '8px',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.15s ease-in-out',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    boxShadow: '0 1px 2px rgba(37, 99, 235, 0.2)',
  },
  btnSecondary: {
    padding: '8px 16px',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    color: '#475569',
    fontSize: '14px',
    fontWeight: '600',
    border: '1px solid #cbd5e1',
    cursor: 'pointer',
    transition: 'all 0.15s ease-in-out',
  },
  btnLogout: {
    padding: '8px 16px',
    borderRadius: '8px',
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    fontSize: '14px',
    fontWeight: '600',
    border: '1px solid #fecaca',
    cursor: 'pointer',
    transition: 'all 0.15s ease-in-out',
  },
  bodyLayout: {
    display: 'flex',
    flex: 1,
  },
  sidebar: {
    width: '240px',
    backgroundColor: '#ffffff',
    borderRight: '1px solid #e2e8f0',
    padding: '24px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    flexShrink: 0,
  },
  sidebarLabel: {
    fontSize: '11px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    color: '#94a3b8',
    padding: '0 12px 8px 12px',
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 14px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#64748b',
    textDecoration: 'none',
    transition: 'all 0.15s ease',
  },
  navLinkActive: {
    backgroundColor: '#eff6ff',
    color: '#2563eb',
    fontWeight: '700',
  },
  navIcon: {
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '20px',
  },
  mainContent: {
    flex: 1,
    padding: '32px 36px',
    overflowY: 'auto',
    maxWidth: '1400px',
  },
};

export default function Layout() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith('/admin');

  const handleLogout = () => {
    logout();
    navigate('/platforms');
  };

  return (
    <div style={styles.container}>
      {/* Top Navbar */}
      <header style={styles.navbar}>
        <div style={styles.logoContainer}>
          <div style={styles.logoBadge}>A</div>
          <span style={styles.logoText}>AIAAS</span>
          {isAdminRoute && (
            <span
              style={{
                marginLeft: '8px',
                padding: '3px 8px',
                borderRadius: '6px',
                backgroundColor: '#fee2e2',
                color: '#dc2626',
                fontSize: '11px',
                fontWeight: '800',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                border: '1px solid #fecaca',
              }}
            >
              Admin Mode
            </span>
          )}
        </div>

        <div style={styles.navRight}>
          {isAuthenticated ? (
            <>
              <div style={styles.userPill}>
                <div style={styles.userAvatar}>
                  {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                </div>
                <span>{user?.username || 'User'}</span>
                {user?.isAdmin && (
                  <span
                    style={{
                      padding: '2px 6px',
                      borderRadius: '4px',
                      backgroundColor: '#fee2e2',
                      color: '#dc2626',
                      fontSize: '10px',
                      fontWeight: '700',
                    }}
                  >
                    Admin
                  </span>
                )}
              </div>
              <button
                type="button"
                style={styles.btnLogout}
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <button
              type="button"
              style={styles.btnPrimary}
              onClick={() => navigate('/login')}
            >
              <span>Login</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Container with Sidebar + Content */}
      <div style={styles.bodyLayout}>
        <aside style={styles.sidebar}>
          {isAdminRoute ? (
            /* Admin Sidebar: strictly contains the two items (Domains & Mailboxes) */
            <>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '4px 10px 14px 10px',
                  borderBottom: '1px solid #f1f5f9',
                  marginBottom: '10px',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: '#fee2e2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                  }}
                >
                  🛡️
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a' }}>
                    Admin Panel
                  </div>
                  <div style={{ fontSize: '11px', color: '#dc2626', fontWeight: '700' }}>
                    System Owner
                  </div>
                </div>
              </div>

              <div style={styles.sidebarLabel}>Admin Navigation</div>

              {/* Item 1: Domains */}
              <NavLink
                to="/admin/domains"
                style={({ isActive }) => ({
                  ...styles.navLink,
                  ...(isActive || location.pathname === '/admin' ? styles.navLinkActive : {}),
                })}
              >
                <span style={styles.navIcon}>🌐</span>
                <span>Domains</span>
              </NavLink>

              {/* Item 2: Mailboxes */}
              <NavLink
                to="/admin/mailboxes"
                style={({ isActive }) => ({
                  ...styles.navLink,
                  ...(isActive ? styles.navLinkActive : {}),
                })}
              >
                <span style={styles.navIcon}>📬</span>
                <span>Mailboxes</span>
              </NavLink>

              {/* Return to App */}
              <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                <NavLink
                  to="/platforms"
                  style={{
                    ...styles.navLink,
                    color: '#64748b',
                    backgroundColor: '#f8fafc',
                  }}
                >
                  <span style={styles.navIcon}>←</span>
                  <span>Exit to Main App</span>
                </NavLink>
              </div>
            </>
          ) : (
            /* Regular User Navigation Sidebar */
            <>
              <div style={styles.sidebarLabel}>Navigation</div>

              {/* Link 1: Platforms (Always visible) */}
              <NavLink
                to="/platforms"
                style={({ isActive }) => ({
                  ...styles.navLink,
                  ...(isActive ? styles.navLinkActive : {}),
                })}
              >
                <span style={styles.navIcon}>⚡</span>
                <span>Platforms</span>
              </NavLink>

              {/* Link 2: File Dashboard (Only when authenticated) */}
              {isAuthenticated && (
                <NavLink
                  to="/file-dashboard"
                  style={({ isActive }) => ({
                    ...styles.navLink,
                    ...(isActive ? styles.navLinkActive : {}),
                  })}
                >
                  <span style={styles.navIcon}>📁</span>
                  <span>File Dashboard</span>
                </NavLink>
              )}

              {/* Link 3: Settings (Accessible to all authenticated users) */}
              {isAuthenticated && (
                <NavLink
                  to="/settings"
                  style={({ isActive }) => ({
                    ...styles.navLink,
                    ...(isActive ? styles.navLinkActive : {}),
                  })}
                >
                  <span style={styles.navIcon}>⚙️</span>
                  <span>Settings</span>
                </NavLink>
              )}

              {/* Admin Panel Entry Link (Visible only to System Owner / Admin) */}
              {isAuthenticated && user?.isAdmin && (
                <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                  <div style={styles.sidebarLabel}>Administration</div>
                  <NavLink
                    to="/admin"
                    style={({ isActive }) => ({
                      ...styles.navLink,
                      color: '#dc2626',
                      backgroundColor: isActive ? '#fef2f2' : 'transparent',
                      fontWeight: isActive ? '700' : '600',
                    })}
                  >
                    <span style={styles.navIcon}>🛡️</span>
                    <span>Admin Panel</span>
                  </NavLink>
                </div>
              )}
            </>
          )}
        </aside>

        {/* Main Content Area */}
        <main style={styles.mainContent}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
