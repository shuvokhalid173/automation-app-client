import React, { useState, useEffect, useCallback } from 'react';
import { domainApi, integrationApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const LEXOFFICE_API_SETTINGS_URL = 'https://app.lexoffice.de/addons/public-api';

const platformIcons = {
  gmx: {
    badge: 'GMX',
    color: '#1e3a8a',
    bg: '#dbeafe',
    icon: '✉️',
  },
  paypal: {
    badge: 'PayPal',
    color: '#003087',
    bg: '#e0f2fe',
    icon: '💳',
  },
  etsy: {
    badge: 'Etsy',
    color: '#c2410c',
    bg: '#ffedd5',
    icon: '🛍️',
  },
  lexware: {
    badge: 'Lexware',
    color: '#047857',
    bg: '#d1fae5',
    icon: '📊',
  },
  ebay: {
    badge: 'eBay',
    color: '#b91c1c',
    bg: '#fee2e2',
    icon: '🏷️',
  },
};

const styles = {
  container: {
    width: '100%',
  },
  header: {
    marginBottom: '32px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: '-0.5px',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '15px',
    color: '#64748b',
    lineHeight: '1.5',
    maxWidth: '680px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '24px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
  },
  cardTop: {
    marginBottom: '20px',
  },
  badgeRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
  },
  iconBox: {
    width: '46px',
    height: '46px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '22px',
  },
  urlTag: {
    fontSize: '12px',
    color: '#64748b',
    backgroundColor: '#f1f5f9',
    padding: '4px 10px',
    borderRadius: '6px',
    fontFamily: 'monospace',
  },
  platformNameRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
    marginBottom: '8px',
  },
  platformName: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1e293b',
  },
  connectedPill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 10px',
    borderRadius: '20px',
    backgroundColor: '#dcfce7',
    color: '#15803d',
    fontSize: '12px',
    fontWeight: '700',
    border: '1px solid #bbf7d0',
  },
  description: {
    fontSize: '14px',
    color: '#475569',
    lineHeight: '1.6',
    minHeight: '66px',
  },
  cardFooter: {
    borderTop: '1px solid #f1f5f9',
    paddingTop: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '12px',
  },
  btnDetails: {
    padding: '8px 16px',
    borderRadius: '8px',
    backgroundColor: '#f8fafc',
    color: '#334155',
    fontSize: '13px',
    fontWeight: '600',
    border: '1px solid #e2e8f0',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  btnConnect: {
    padding: '8px 18px',
    borderRadius: '8px',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    fontSize: '13px',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    boxShadow: '0 1px 2px rgba(37, 99, 235, 0.2)',
  },
  btnConnected: {
    backgroundColor: '#10b981',
    color: '#ffffff',
    cursor: 'default',
    boxShadow: '0 1px 2px rgba(16, 185, 129, 0.2)',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 0',
    color: '#64748b',
  },
  spinner: {
    width: '36px',
    height: '36px',
    border: '3px solid #e2e8f0',
    borderTopColor: '#2563eb',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '16px',
  },
  errorBox: {
    padding: '16px 20px',
    borderRadius: '10px',
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#b91c1c',
    marginBottom: '24px',
    fontSize: '14px',
  },
  modalBackdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '520px',
    padding: '28px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '20px',
    color: '#94a3b8',
    cursor: 'pointer',
  },
  detailRow: {
    marginBottom: '14px',
  },
  detailLabel: {
    fontSize: '12px',
    fontWeight: '700',
    textTransform: 'uppercase',
    color: '#64748b',
    marginBottom: '4px',
  },
  detailValue: {
    fontSize: '14px',
    color: '#1e293b',
    backgroundColor: '#f8fafc',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
  },
  // --- Connection modal ---
  connectModalContent: {
    backgroundColor: '#ffffff',
    borderRadius: '18px',
    width: '100%',
    maxWidth: '540px',
    padding: '28px',
    boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.35)',
    animation: 'pp-modal-in 0.22s ease-out',
  },
  connectHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '12px',
    marginBottom: '20px',
  },
  connectHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  connectTitle: {
    fontSize: '20px',
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: '2px',
  },
  connectSubtitle: {
    fontSize: '14px',
    color: '#64748b',
    lineHeight: '1.5',
  },
  instructionBox: {
    background: 'linear-gradient(135deg, #ecfdf5 0%, #f0fdfa 100%)',
    border: '1px solid #a7f3d0',
    borderRadius: '12px',
    padding: '16px 18px',
    marginBottom: '22px',
  },
  instructionHeading: {
    fontSize: '12px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    color: '#047857',
    marginBottom: '12px',
  },
  stepList: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  stepItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    fontSize: '14px',
    color: '#1e293b',
    lineHeight: '1.5',
  },
  stepNumber: {
    flexShrink: 0,
    width: '22px',
    height: '22px',
    borderRadius: '50%',
    backgroundColor: '#047857',
    color: '#ffffff',
    fontSize: '12px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '1px',
  },
  stepLink: {
    color: '#047857',
    fontWeight: '700',
    textDecoration: 'underline',
  },
  fieldLabel: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '700',
    color: '#334155',
    marginBottom: '8px',
  },
  inputWrap: {
    position: 'relative',
  },
  input: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '11px 72px 11px 14px',
    fontSize: '14px',
    fontFamily: 'monospace',
    color: '#0f172a',
    borderRadius: '10px',
    border: '1px solid #cbd5e1',
    outline: 'none',
    transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
  },
  inputToggle: {
    position: 'absolute',
    right: '8px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    color: '#64748b',
    fontSize: '12px',
    fontWeight: '700',
    cursor: 'pointer',
    padding: '4px 8px',
  },
  inlineError: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '14px',
    padding: '10px 14px',
    borderRadius: '10px',
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#b91c1c',
    fontSize: '13px',
    fontWeight: '600',
  },
  connectFooter: {
    marginTop: '24px',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
  },
  btnSpinner: {
    width: '14px',
    height: '14px',
    border: '2px solid rgba(255,255,255,0.4)',
    borderTopColor: '#ffffff',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  // --- Toast ---
  toast: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    zIndex: 1100,
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '14px 18px',
    borderRadius: '12px',
    backgroundColor: '#0f172a',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '600',
    boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.4)',
    animation: 'pp-toast-in 0.25s ease-out',
  },
  toastIcon: {
    width: '22px',
    height: '22px',
    borderRadius: '50%',
    backgroundColor: '#10b981',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
  },
};

const keyframes = `
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes pp-modal-in { from { opacity: 0; transform: translateY(12px) scale(0.98); } to { opacity: 1; transform: none; } }
  @keyframes pp-toast-in { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
`;

/**
 * Modal for platforms that connect with direct credentials (e.g. Lexware API key).
 * `onSubmit(apiKey)` must return a Promise; a rejection's message is shown inline.
 */
function ConnectionModal({ isOpen, onClose, domain, onSubmit, visual }) {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Reset form whenever the modal is (re)opened
  useEffect(() => {
    if (isOpen) {
      setApiKey('');
      setShowKey(false);
      setSubmitting(false);
      setError(null);
    }
  }, [isOpen, domain]);

  // Close on Escape (unless a request is in flight)
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape' && !submitting) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, submitting, onClose]);

  if (!isOpen || !domain) return null;

  const isLexware = domain.name === 'Lexware';

  const handleSubmit = async (e) => {
    e.preventDefault();
    const value = apiKey.trim();
    if (!value) {
      setError('Please paste your API key.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit(value);
    } catch (err) {
      setError(err.message || 'Failed to connect. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.modalBackdrop} onClick={() => !submitting && onClose()}>
      <div
        style={styles.connectModalContent}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="connect-modal-title"
      >
        <div style={styles.connectHeader}>
          <div style={styles.connectHeaderLeft}>
            {visual && (
              <div style={{ ...styles.iconBox, backgroundColor: visual.bg, color: visual.color }}>
                {visual.icon}
              </div>
            )}
            <div>
              <h2 id="connect-modal-title" style={styles.connectTitle}>
                Connect {domain.name}
              </h2>
              {isLexware && (
                <p style={styles.connectSubtitle}>
                  Lexoffice requires a Personal API Key to connect.
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            style={styles.closeBtn}
            onClick={onClose}
            disabled={submitting}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {isLexware ? (
          <form onSubmit={handleSubmit} noValidate>
            <div style={styles.instructionBox}>
              <div style={styles.instructionHeading}>How to get your API key</div>
              <ol style={styles.stepList}>
                <li style={styles.stepItem}>
                  <span style={styles.stepNumber}>1</span>
                  <span>Log into your Lexoffice account.</span>
                </li>
                <li style={styles.stepItem}>
                  <span style={styles.stepNumber}>2</span>
                  <span>
                    <a
                      href={LEXOFFICE_API_SETTINGS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={styles.stepLink}
                    >
                      Click this link
                    </a>{' '}
                    to go directly to your Public API settings.
                  </span>
                </li>
                <li style={styles.stepItem}>
                  <span style={styles.stepNumber}>3</span>
                  <span>
                    Click <strong>"Create API Key"</strong>, copy the long token, and paste it below.
                  </span>
                </li>
              </ol>
            </div>

            <label htmlFor="lexoffice-api-key" style={styles.fieldLabel}>
              Lexoffice API Key
            </label>
            <div style={styles.inputWrap}>
              <input
                id="lexoffice-api-key"
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Paste your API key here"
                autoComplete="off"
                spellCheck={false}
                autoFocus
                disabled={submitting}
                style={{
                  ...styles.input,
                  borderColor: error ? '#f87171' : '#cbd5e1',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(4, 120, 87, 0.15)';
                  if (!error) e.currentTarget.style.borderColor = '#047857';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                  if (!error) e.currentTarget.style.borderColor = '#cbd5e1';
                }}
              />
              <button
                type="button"
                style={styles.inputToggle}
                onClick={() => setShowKey((s) => !s)}
                tabIndex={-1}
              >
                {showKey ? 'Hide' : 'Show'}
              </button>
            </div>

            {error && (
              <div style={styles.inlineError} role="alert">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <div style={styles.connectFooter}>
              <button
                type="button"
                style={styles.btnDetails}
                onClick={onClose}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                id="lexoffice-connect-submit"
                style={{
                  ...styles.btnConnect,
                  backgroundColor: '#047857',
                  opacity: submitting || !apiKey.trim() ? 0.7 : 1,
                  cursor: submitting || !apiKey.trim() ? 'not-allowed' : 'pointer',
                }}
                disabled={submitting || !apiKey.trim()}
              >
                {submitting && <span style={styles.btnSpinner} />}
                {submitting ? 'Validating…' : 'Connect'}
              </button>
            </div>
          </form>
        ) : (
          <>
            <p style={styles.connectSubtitle}>
              Direct connection for {domain.name} is not available yet.
            </p>
            <div style={styles.connectFooter}>
              <button type="button" style={styles.btnDetails} onClick={onClose}>
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function PlatformsPage() {
  const { isAuthenticated } = useAuth();
  const [platforms, setPlatforms] = useState([]);
  const [connectedDomainIds, setConnectedDomainIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeModalDomain, setActiveModalDomain] = useState(null);
  const [connectingId, setConnectingId] = useState(null);
  const [connectModalDomain, setConnectModalDomain] = useState(null);
  const [toast, setToast] = useState(null);

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const refreshStatus = useCallback(async () => {
    try {
      const statusRes = await integrationApi.getStatus();
      const ids = Array.isArray(statusRes.data) ? statusRes.data.map(Number) : [];
      setConnectedDomainIds(ids);
    } catch (statusErr) {
      console.error('Failed to load integration status:', statusErr);
    }
  }, []);

  useEffect(() => {
    async function loadPlatformsAndStatus() {
      try {
        setLoading(true);
        setError(null);

        // Fetch domains
        const res = await domainApi.getAll();
        const list = res.data || [];
        setPlatforms(list);

        // If authenticated, fetch integrations status
        if (isAuthenticated) {
          await refreshStatus();
        } else {
          setConnectedDomainIds([]);
        }
      } catch (err) {
        console.error('Failed to load platforms:', err);
        setError(err.message || 'Failed to load platforms');
      } finally {
        setLoading(false);
      }
    }

    loadPlatformsAndStatus();
  }, [isAuthenticated, refreshStatus]);

  const closeConnectModal = useCallback(() => setConnectModalDomain(null), []);

  // Called by ConnectionModal; throwing here surfaces the message inside the modal
  const handleDirectConnectSubmit = async (apiKey) => {
    const domain = connectModalDomain;
    await integrationApi.connectDirect({
      domainId: domain.id,
      platformName: domain.name,
      credentials: { apiKey },
    });
    setConnectModalDomain(null);
    setToast(`${domain.name} connected successfully`);
    await refreshStatus();
  };

  const handleConnect = async (domain) => {
    if (domain.name === 'Lexware') {
      setConnectModalDomain(domain);
      return;
    }
    if (domain.name === 'Etsy') {
      try {
        setConnectingId(domain.id);
        const res = await integrationApi.getEtsyAuthUrl();
        if (res.data && res.data.url) {
          localStorage.setItem('oauth_platform', 'etsy');
          window.location.href = res.data.url;
        } else {
          throw new Error('No authorization URL received');
        }
      } catch (err) {
        console.error('Failed to initiate Etsy OAuth:', err);
        alert(err.message || 'Failed to initiate Etsy connection');
        setConnectingId(null);
      }
      return;
    }
    if (domain.name === 'PayPal') {
      try {
        setConnectingId(domain.id);
        const res = await integrationApi.getPaypalAuthUrl();
        if (res.data && res.data.url) {
          localStorage.setItem('oauth_platform', 'paypal');
          window.location.href = res.data.url;
        } else {
          throw new Error('No authorization URL received');
        }
      } catch (err) {
        console.error('Failed to initiate PayPal OAuth:', err);
        alert(err.message || 'Failed to initiate PayPal connection');
        setConnectingId(null);
      }
      return;
    }
    // For platforms without automated OAuth flow yet, inform the user
    alert(`Integration configuration for ${domain.name} is managed in Settings.`);
  };

  const getPlatformVisual = (name = '') => {
    const key = name.toLowerCase();
    return (
      platformIcons[key] || {
        badge: name.slice(0, 3).toUpperCase(),
        color: '#4f46e5',
        bg: '#eef2ff',
        icon: '🔌',
      }
    );
  };

  return (
    <div style={styles.container}>
      <style>{keyframes}</style>
      <header style={styles.header}>
        <h1 style={styles.title}>Platforms</h1>
        <p style={styles.subtitle}>
          Connect and orchestrate your invoice, mailbox, and payment platforms to automate monthly financial reconciliation.
        </p>
      </header>

      {error && (
        <div style={styles.errorBox}>
          <strong>Error loading platforms:</strong> {error}
        </div>
      )}

      {loading ? (
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <div>Loading platform services...</div>
        </div>
      ) : (
        <div style={styles.grid}>
          {platforms.map((domain) => {
            const visual = getPlatformVisual(domain.name);
            const isConnected = connectedDomainIds.includes(Number(domain.id));
            const isConnecting = connectingId === domain.id;

            return (
              <div
                key={domain.id}
                style={styles.card}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.08)';
                  e.currentTarget.style.borderColor = '#cbd5e1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.04)';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}
              >
                <div style={styles.cardTop}>
                  <div style={styles.badgeRow}>
                    <div
                      style={{
                        ...styles.iconBox,
                        backgroundColor: visual.bg,
                        color: visual.color,
                      }}
                    >
                      {visual.icon}
                    </div>
                    <span style={styles.urlTag}>{domain.url}</span>
                  </div>

                  <div style={styles.platformNameRow}>
                    <h2 style={styles.platformName}>{domain.name}</h2>
                    {isConnected && (
                      <span style={styles.connectedPill}>
                        <span>✓</span> Connected
                      </span>
                    )}
                  </div>

                  <p style={styles.description}>
                    {domain.description || 'Automated integration for synchronizing invoices and monthly financial ledgers.'}
                  </p>
                </div>

                <div style={styles.cardFooter}>
                  {/* Details Button - Always visible */}
                  <button
                    type="button"
                    style={styles.btnDetails}
                    onClick={() => setActiveModalDomain(domain)}
                  >
                    Details
                  </button>

                  {/* Connect Button - Conditionally visible if isAuthenticated === true */}
                  {isAuthenticated && (
                    <>
                      {isConnected ? (
                        <button
                          type="button"
                          style={{
                            ...styles.btnConnect,
                            ...styles.btnConnected,
                          }}
                          disabled
                        >
                          ✓ Connected
                        </button>
                      ) : (
                        <button
                          type="button"
                          style={styles.btnConnect}
                          disabled={isConnecting}
                          onClick={() => handleConnect(domain)}
                        >
                          {isConnecting ? 'Connecting...' : 'Connect'}
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Details Modal */}
      {activeModalDomain && (
        <div
          style={styles.modalBackdrop}
          onClick={() => setActiveModalDomain(null)}
        >
          <div
            style={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={styles.modalTitle}>
              <span>{activeModalDomain.name} Details</span>
              <button
                type="button"
                style={styles.closeBtn}
                onClick={() => setActiveModalDomain(null)}
              >
                ✕
              </button>
            </div>

            <div style={styles.detailRow}>
              <div style={styles.detailLabel}>Platform Name</div>
              <div style={styles.detailValue}>{activeModalDomain.name}</div>
            </div>

            <div style={styles.detailRow}>
              <div style={styles.detailLabel}>Endpoint / Host URL</div>
              <div style={styles.detailValue}>{activeModalDomain.url}</div>
            </div>

            <div style={styles.detailRow}>
              <div style={styles.detailLabel}>Description</div>
              <div style={styles.detailValue}>
                {activeModalDomain.description || 'No custom description set.'}
              </div>
            </div>

            <div style={styles.detailRow}>
              <div style={styles.detailLabel}>Platform ID</div>
              <div style={styles.detailValue}>#{activeModalDomain.id}</div>
            </div>

            <div style={styles.detailRow}>
              <div style={styles.detailLabel}>Connection Status</div>
              <div style={styles.detailValue}>
                {connectedDomainIds.includes(Number(activeModalDomain.id))
                  ? 'Connected (Active)'
                  : 'Not Connected'}
              </div>
            </div>

            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                style={styles.btnDetails}
                onClick={() => setActiveModalDomain(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Direct-credential Connection Modal (e.g. Lexware) */}
      <ConnectionModal
        isOpen={Boolean(connectModalDomain)}
        onClose={closeConnectModal}
        domain={connectModalDomain}
        onSubmit={handleDirectConnectSubmit}
        visual={connectModalDomain ? getPlatformVisual(connectModalDomain.name) : null}
      />

      {/* Success toast */}
      {toast && (
        <div style={styles.toast} role="status" aria-live="polite">
          <span style={styles.toastIcon}>✓</span>
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
