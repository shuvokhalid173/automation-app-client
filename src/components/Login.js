import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const styles = {
  container: {
    minHeight: 'calc(100vh - 120px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
  },
  card: {
    width: '100%',
    maxWidth: '420px',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(0, 0, 0, 0.04)',
    padding: '36px 32px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '28px',
  },
  logoBadge: {
    width: '48px',
    height: '48px',
    borderRadius: '14px',
    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    fontWeight: '800',
    fontSize: '24px',
    margin: '0 auto 16px auto',
    boxShadow: '0 4px 10px rgba(37, 99, 235, 0.25)',
  },
  title: {
    fontSize: '24px',
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: '-0.5px',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#64748b',
  },
  errorAlert: {
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#b91c1c',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '13px',
    marginBottom: '20px',
    lineHeight: '1.4',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#334155',
  },
  input: {
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    fontSize: '14px',
    color: '#0f172a',
    outline: 'none',
    transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
  },
  btnSubmit: {
    marginTop: '8px',
    padding: '12px 18px',
    borderRadius: '8px',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '700',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    boxShadow: '0 1px 2px rgba(37, 99, 235, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  toggleContainer: {
    marginTop: '24px',
    textAlign: 'center',
    paddingTop: '20px',
    borderTop: '1px solid #f1f5f9',
    fontSize: '13px',
    color: '#64748b',
  },
  toggleBtn: {
    background: 'none',
    border: 'none',
    color: '#2563eb',
    fontWeight: '700',
    cursor: 'pointer',
    padding: '0 4px',
    textDecoration: 'underline',
  },
};

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect target after successful login
  const from = location.state?.from?.pathname || '/platforms';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegister) {
        if (!username.trim()) {
          throw new Error('Please enter a username');
        }
        const res = await authApi.register(username, email, password);
        // Save token & user, update context
        login(res.data.token, res.data.user);
      } else {
        const res = await authApi.login(email, password);
        login(res.data.token, res.data.user);
      }

      // Navigate to destination
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Auth error:', err);
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMode = () => {
    setIsRegister(!isRegister);
    setError(null);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logoBadge}>A</div>
          <h1 style={styles.title}>{isRegister ? 'Create Account' : 'Welcome Back'}</h1>
          <p style={styles.subtitle}>
            {isRegister
              ? 'Register to access and manage your invoice automation'
              : 'Sign in to access your dashboard and platforms'}
          </p>
        </div>

        {error && <div style={styles.errorAlert}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          {isRegister && (
            <div style={styles.fieldGroup}>
              <label htmlFor="username-input" style={styles.label}>
                Username
              </label>
              <input
                id="username-input"
                type="text"
                placeholder="e.g. John Doe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required={isRegister}
                style={styles.input}
                onFocus={(e) => {
                  e.target.style.borderColor = '#2563eb';
                  e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.15)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#cbd5e1';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          )}

          <div style={styles.fieldGroup}>
            <label htmlFor="email-input" style={styles.label}>
              Email Address
            </label>
            <input
              id="email-input"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
              onFocus={(e) => {
                e.target.style.borderColor = '#2563eb';
                e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.15)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#cbd5e1';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label htmlFor="password-input" style={styles.label}>
              Password
            </label>
            <input
              id="password-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
              onFocus={(e) => {
                e.target.style.borderColor = '#2563eb';
                e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.15)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#cbd5e1';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.btnSubmit,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Processing...' : isRegister ? 'Register' : 'Sign In'}
          </button>
        </form>

        <div style={styles.toggleContainer}>
          {isRegister ? (
            <>
              Already have an account?{' '}
              <button
                type="button"
                style={styles.toggleBtn}
                onClick={handleToggleMode}
              >
                Sign In
              </button>
            </>
          ) : (
            <>
              Don't have an account?{' '}
              <button
                type="button"
                style={styles.toggleBtn}
                onClick={handleToggleMode}
              >
                Register
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
