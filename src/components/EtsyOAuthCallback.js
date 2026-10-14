import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { integrationApi } from '../services/api';

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
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(0, 0, 0, 0.04)',
    padding: '36px 32px',
    textAlign: 'center',
  },
  logoBadge: {
    width: '52px',
    height: '52px',
    borderRadius: '14px',
    background: 'linear-gradient(135deg, #c2410c 0%, #ea580c 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    fontSize: '26px',
    margin: '0 auto 20px auto',
    boxShadow: '0 4px 10px rgba(234, 88, 12, 0.25)',
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
    borderTopColor: '#ea580c',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 20px auto',
  },
  errorAlert: {
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#b91c1c',
    padding: '14px 16px',
    borderRadius: '8px',
    fontSize: '13px',
    marginBottom: '24px',
    lineHeight: '1.4',
    textAlign: 'left',
  },
  successBadge: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: '#dcfce7',
    color: '#16a34a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
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

export default function EtsyOAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing'); // 'processing' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState(null);
  const executedRef = useRef(false);

  useEffect(() => {
    // Avoid double execution in React StrictMode
    if (executedRef.current) return;
    executedRef.current = true;

    async function processCallback() {
      const code = searchParams.get('code');
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
        await integrationApi.etsyCallback(code);
        setStatus('success');
        // Brief timeout so user sees success confirmation before redirect
        setTimeout(() => {
          navigate('/platforms', { replace: true });
        }, 1200);
      } catch (err) {
        console.error('Error exchanging OAuth code:', err);
        setStatus('error');
        setErrorMessage(
          err.message || 'Failed to complete OAuth token exchange with Etsy.'
        );
      }
    }

    processCallback();
  }, [searchParams, navigate]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logoBadge}>🛍️</div>

        {status === 'processing' && (
          <>
            <div style={styles.spinner} />
            <h1 style={styles.title}>Connecting Etsy...</h1>
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
              Your Etsy shop is now connected. Redirecting you back to Platforms...
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
