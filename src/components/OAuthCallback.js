import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { integrationApi } from '../services/api';

const platformThemes = {
  etsy: {
    key: 'etsy',
    name: 'Etsy',
    icon: '🛍️',
    gradient: 'linear-gradient(135deg, #c2410c 0%, #ea580c 100%)',
    shadow: '0 4px 12px rgba(234, 88, 12, 0.25)',
    accentColor: '#ea580c',
    callbackFn: (code, state) => integrationApi.etsyCallback(code, state),
  },
  paypal: {
    key: 'paypal',
    name: 'PayPal',
    icon: '💳',
    gradient: 'linear-gradient(135deg, #003087 0%, #0070ba 100%)',
    shadow: '0 4px 12px rgba(0, 112, 186, 0.25)',
    accentColor: '#0070ba',
    callbackFn: (code, state) => integrationApi.paypalCallback(code, state),
  },
};

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
    maxWidth: '460px',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
    border: '1px solid #e2e8f0',
    padding: '36px 32px',
    textAlign: 'center',
  },
  logoBadge: {
    width: '56px',
    height: '56px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    fontSize: '26px',
    margin: '0 auto 20px auto',
  },
  title: {
    fontSize: '22px',
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: '8px',
  },
  statusText: {
    fontSize: '14px',
    color: '#64748b',
    lineHeight: '1.5',
    marginBottom: '24px',
  },
  spinner: {
    width: '36px',
    height: '36px',
    border: '3px solid #e2e8f0',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 20px auto',
  },
  errorAlert: {
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#b91c1c',
    padding: '14px 16px',
    borderRadius: '10px',
    fontSize: '13px',
    marginBottom: '24px',
    lineHeight: '1.5',
    textAlign: 'left',
  },
  successBadge: {
    width: '52px',
    height: '52px',
    borderRadius: '50%',
    backgroundColor: '#dcfce7',
    color: '#16a34a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '0 auto 16px auto',
  },
  btnPrimary: {
    padding: '10px 20px',
    borderRadius: '8px',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
};

/**
 * Shared OAuth Callback component for OAuth 2.0 providers (Etsy, PayPal, etc.)
 */
export default function OAuthCallback({ platform: explicitPlatform }) {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing'); // 'processing' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState(null);
  const executedRef = useRef(false);

  // Detect platform through props, query params, pathname, or localStorage
  const detectPlatform = () => {
    if (explicitPlatform) return explicitPlatform.toLowerCase();

    const paramPlatform = searchParams.get('platform');
    if (paramPlatform) return paramPlatform.toLowerCase();

    const pathname = location.pathname.toLowerCase();
    if (pathname.includes('paypal')) return 'paypal';
    if (pathname.includes('etsy')) return 'etsy';

    const storedPlatform = localStorage.getItem('oauth_platform');
    if (storedPlatform) return storedPlatform.toLowerCase();

    return 'paypal'; // Default fallback
  };

  const platformKey = detectPlatform();
  const theme = platformThemes[platformKey] || platformThemes.paypal;

  useEffect(() => {
    // Avoid double execution in React StrictMode
    if (executedRef.current) return;
    executedRef.current = true;

    async function processCallback() {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const error = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');

      if (error) {
        setStatus('error');
        setErrorMessage(errorDescription || `OAuth authorization rejected: ${error}`);
        return;
      }

      if (!code) {
        setStatus('error');
        setErrorMessage('No authorization code was found in the URL callback query.');
        return;
      }

      try {
        if (platformKey === 'paypal') {
          await integrationApi.paypalCallback(code, state);
        } else if (platformKey === 'etsy') {
          await integrationApi.etsyCallback(code, state);
        } else {
          // If undetermined, attempt PayPal first then Etsy
          try {
            await integrationApi.paypalCallback(code, state);
          } catch (firstErr) {
            await integrationApi.etsyCallback(code, state);
          }
        }

        // Clean up localStorage flag
        localStorage.removeItem('oauth_platform');

        setStatus('success');
        // Brief timeout so user sees success confirmation before navigating back
        setTimeout(() => {
          navigate('/platforms', { replace: true });
        }, 1200);
      } catch (err) {
        console.error(`Error exchanging OAuth code for ${theme.name}:`, err);
        setStatus('error');
        setErrorMessage(
          err.message || `Failed to complete OAuth token exchange with ${theme.name}.`
        );
      }
    }

    processCallback();
  }, [searchParams, location.pathname, navigate, platformKey, theme.name]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div
          style={{
            ...styles.logoBadge,
            background: theme.gradient,
            boxShadow: theme.shadow,
          }}
        >
          {theme.icon}
        </div>

        {status === 'processing' && (
          <>
            <div
              style={{
                ...styles.spinner,
                borderTopColor: theme.accentColor,
              }}
            />
            <h1 style={styles.title}>Connecting {theme.name}...</h1>
            <p style={styles.statusText}>
              Validating your authorization code and securing API integration tokens.
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div style={styles.successBadge}>✓</div>
            <h1 style={styles.title}>Connected Successfully!</h1>
            <p style={styles.statusText}>
              Your {theme.name} account is now connected. Redirecting you back to Platforms...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <h1 style={styles.title}>Connection Failed</h1>
            <div style={styles.errorAlert}>
              <strong>Error:</strong> {errorMessage}
            </div>
            <button
              type="button"
              style={styles.btnPrimary}
              onClick={() => navigate('/platforms')}
            >
              Return to Platforms
            </button>
          </>
        )}
      </div>
    </div>
  );
}
