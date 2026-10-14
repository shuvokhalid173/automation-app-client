import React, { useState, useEffect } from 'react';
import { domainApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

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
  platformName: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '8px',
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
};

export default function PlatformsPage() {
  const { isAuthenticated } = useAuth();
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeModalDomain, setActiveModalDomain] = useState(null);
  const [connectedMap, setConnectedMap] = useState({});

  useEffect(() => {
    async function loadPlatforms() {
      try {
        setLoading(true);
        setError(null);
        const res = await domainApi.getAll();
        // res.data contains array of domains
        const list = res.data || [];
        setPlatforms(list);
      } catch (err) {
        console.error('Failed to load platforms:', err);
        setError(err.message || 'Failed to load platforms');
      } finally {
        setLoading(false);
      }
    }

    loadPlatforms();
  }, []);

  const handleToggleConnect = (domainId) => {
    setConnectedMap((prev) => ({
      ...prev,
      [domainId]: !prev[domainId],
    }));
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
            const isConnected = !!connectedMap[domain.id];

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

                  <h2 style={styles.platformName}>{domain.name}</h2>
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
                    <button
                      type="button"
                      style={{
                        ...styles.btnConnect,
                        ...(isConnected ? styles.btnConnected : {}),
                      }}
                      onClick={() => handleToggleConnect(domain.id)}
                    >
                      {isConnected ? '✓ Connected' : 'Connect'}
                    </button>
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
    </div>
  );
}
