import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { adminApi, domainApi, mailboxApi } from '../services/api';

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '32px 24px',
  },
  header: {
    marginBottom: '28px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '16px',
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '6px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: '-0.5px',
    margin: 0,
  },
  adminBadge: {
    padding: '4px 10px',
    borderRadius: '6px',
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    fontSize: '11px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    border: '1px solid #fecaca',
  },
  subtitle: {
    fontSize: '15px',
    color: '#64748b',
    lineHeight: '1.5',
    margin: 0,
  },
  tabBar: {
    display: 'flex',
    gap: '8px',
    borderBottom: '1px solid #e2e8f0',
    marginBottom: '28px',
  },
  tabBtn: {
    padding: '10px 18px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#64748b',
    background: 'transparent',
    border: 'none',
    borderBottom: '2px solid transparent',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  tabBtnActive: {
    color: '#2563eb',
    borderBottom: '2px solid #2563eb',
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
    padding: '28px',
    marginBottom: '24px',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    flexWrap: 'wrap',
    gap: '12px',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#0f172a',
    margin: 0,
  },
  cardSubtitle: {
    fontSize: '13px',
    color: '#64748b',
    marginTop: '4px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px',
  },
  th: {
    padding: '12px 16px',
    textAlign: 'left',
    fontWeight: '600',
    color: '#475569',
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderBottom: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc',
  },
  td: {
    padding: '14px 16px',
    borderBottom: '1px solid #f1f5f9',
    color: '#334155',
  },
  btnPrimary: {
    padding: '9px 18px',
    borderRadius: '8px',
    border: 'none',
    background: '#2563eb',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    boxShadow: '0 1px 2px rgba(37, 99, 235, 0.2)',
  },
  btnSecondary: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    background: '#fff',
    color: '#475569',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  btnDanger: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    background: '#ef4444',
    color: '#fff',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  toast: {
    padding: '12px 18px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  toastSuccess: {
    backgroundColor: '#ecfdf5',
    border: '1px solid #a7f3d0',
    color: '#065f46',
  },
  toastError: {
    backgroundColor: '#fee2e2',
    border: '1px solid #fca5a5',
    color: '#b91c1c',
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(15,23,42,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '16px',
  },
  modalContent: {
    background: '#fff',
    padding: '28px',
    borderRadius: '14px',
    width: '100%',
    maxWidth: '520px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '24px',
  },
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    color: '#334155',
    marginBottom: '6px',
  },
  input: {
    width: '100%',
    padding: '9px 12px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    fontSize: '14px',
    boxSizing: 'border-box',
    outline: 'none',
  },
};

export default function AdminPage({ activeTab: propActiveTab }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active view: prop > URL path > default to domains
  const activeView = useMemo(() => {
    if (propActiveTab) return propActiveTab;
    if (location.pathname.includes('/mailboxes')) return 'mailboxes';
    if (location.pathname.includes('/domains')) return 'domains';
    const params = new URLSearchParams(location.search);
    if (params.get('tab') === 'mailboxes') return 'mailboxes';
    return 'domains';
  }, [propActiveTab, location.pathname, location.search]);

  const [domains, setDomains] = useState([]);
  const [mailboxes, setMailboxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDomainId, setFilterDomainId] = useState('');
  const [message, setMessage] = useState(null);

  const [domainModal, setDomainModal] = useState({ open: false, data: null });
  const [mailboxModal, setMailboxModal] = useState({ open: false, data: null });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [dRes, mRes] = await Promise.all([
        adminApi.getDomains().catch(() => domainApi.getAll()),
        adminApi.getMailboxes().catch(() => mailboxApi.getAll()),
      ]);
      setDomains(dRes.data || []);
      setMailboxes(mRes.data || []);
    } catch (err) {
      console.error('Failed to load admin data:', err);
      setMessage({ type: 'error', text: 'Failed to load domains and mailboxes: ' + err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTabClick = (tab) => {
    navigate(`/admin/${tab}`);
  };

  // Domain Handlers
  const handleSaveDomain = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = {
      name: fd.get('name'),
      url: fd.get('url'),
      description: fd.get('description') || null,
    };

    try {
      if (domainModal.data) {
        await adminApi.updateDomain(domainModal.data.id, data).catch(() => domainApi.update(domainModal.data.id, data));
        setMessage({ type: 'success', text: `Domain "${data.name}" updated successfully.` });
      } else {
        await adminApi.createDomain(data).catch(() => domainApi.create(data));
        setMessage({ type: 'success', text: `Domain "${data.name}" created successfully.` });
      }
      setDomainModal({ open: false, data: null });
      fetchData();
      setTimeout(() => setMessage(null), 4000);
    } catch (err) {
      alert(err.message || 'Failed to save domain');
    }
  };

  const handleDeleteDomain = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete domain "${name || id}"?`)) return;
    try {
      await adminApi.deleteDomain(id).catch(() => domainApi.delete(id));
      setMessage({ type: 'success', text: 'Domain deleted successfully.' });
      fetchData();
      setTimeout(() => setMessage(null), 4000);
    } catch (err) {
      alert(err.message || 'Failed to delete domain');
    }
  };

  // Mailbox Handlers
  const handleSaveMailbox = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = {
      name: fd.get('name'),
      email: fd.get('email'),
      domain_id: parseInt(fd.get('domain_id'), 10),
      is_active: fd.get('is_active') ? 1 : 0,
    };

    try {
      if (mailboxModal.data) {
        await adminApi.updateMailbox(mailboxModal.data.id, data).catch(() => mailboxApi.update(mailboxModal.data.id, data));
        setMessage({ type: 'success', text: `Mailbox "${data.email}" updated successfully.` });
      } else {
        await adminApi.createMailbox(data).catch(() => mailboxApi.create(data));
        setMessage({ type: 'success', text: `Mailbox "${data.email}" created successfully.` });
      }
      setMailboxModal({ open: false, data: null });
      fetchData();
      setTimeout(() => setMessage(null), 4000);
    } catch (err) {
      alert(err.message || 'Failed to save mailbox');
    }
  };

  const handleDeleteMailbox = async (id, email) => {
    if (!window.confirm(`Are you sure you want to delete mailbox "${email || id}"?`)) return;
    try {
      await adminApi.deleteMailbox(id).catch(() => mailboxApi.delete(id));
      setMessage({ type: 'success', text: 'Mailbox deleted successfully.' });
      fetchData();
      setTimeout(() => setMessage(null), 4000);
    } catch (err) {
      alert(err.message || 'Failed to delete mailbox');
    }
  };

  const filteredMailboxes = useMemo(() => {
    if (!filterDomainId) return mailboxes;
    return mailboxes.filter((m) => String(m.domain_id) === String(filterDomainId));
  }, [mailboxes, filterDomainId]);

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div>
          <div style={styles.titleRow}>
            <h1 style={styles.title}>System Admin Panel</h1>
            <span style={styles.adminBadge}>System Owner Only</span>
          </div>
          <p style={styles.subtitle}>
            Manage system-wide domains, URLs, and configured IMAP mailboxes for background automation.
          </p>
        </div>
      </header>

      {/* Tabs */}
      <div style={styles.tabBar}>
        <button
          type="button"
          style={{ ...styles.tabBtn, ...(activeView === 'domains' ? styles.tabBtnActive : {}) }}
          onClick={() => handleTabClick('domains')}
        >
          <span>🌐</span>
          <span>Domains</span>
        </button>
        <button
          type="button"
          style={{ ...styles.tabBtn, ...(activeView === 'mailboxes' ? styles.tabBtnActive : {}) }}
          onClick={() => handleTabClick('mailboxes')}
        >
          <span>📬</span>
          <span>Mailboxes</span>
        </button>
      </div>

      {/* Toast Alert */}
      {message && (
        <div
          style={{
            ...styles.toast,
            ...(message.type === 'success' ? styles.toastSuccess : styles.toastError),
          }}
        >
          <span>{message.type === 'success' ? '✓' : '⚠️'}</span>
          <span>{message.text}</span>
        </div>
      )}

      {loading ? (
        <div style={{ ...styles.card, textAlign: 'center', padding: '48px', color: '#64748b' }}>
          Loading admin configuration data...
        </div>
      ) : (
        <>
          {/* View 1: Managed Domains */}
          {activeView === 'domains' && (
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <div>
                  <h2 style={styles.cardTitle}>Managed Domains</h2>
                  <div style={styles.cardSubtitle}>
                    Domains represent the external service hosts and integrations supported by the system.
                  </div>
                </div>
                <button
                  type="button"
                  style={styles.btnPrimary}
                  onClick={() => setDomainModal({ open: true, data: null })}
                >
                  <span>+</span>
                  <span>Add Domain</span>
                </button>
              </div>

              {domains.length === 0 ? (
                <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
                  No domains configured yet. Click "Add Domain" to create one.
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={{ ...styles.th, width: '80px' }}>ID</th>
                        <th style={styles.th}>Name</th>
                        <th style={styles.th}>URL</th>
                        <th style={{ ...styles.th, textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {domains.map((d) => (
                        <tr key={d.id}>
                          <td style={{ ...styles.td, color: '#64748b', fontWeight: '500' }}>#{d.id}</td>
                          <td style={{ ...styles.td, fontWeight: '700', color: '#0f172a' }}>{d.name}</td>
                          <td style={{ ...styles.td, fontFamily: 'monospace', color: '#475569' }}>{d.url}</td>
                          <td style={{ ...styles.td, textAlign: 'right' }}>
                            <button
                              type="button"
                              style={{ ...styles.btnSecondary, marginRight: '8px', padding: '6px 14px' }}
                              onClick={() => setDomainModal({ open: true, data: d })}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              style={{ ...styles.btnDanger, padding: '6px 14px' }}
                              onClick={() => handleDeleteDomain(d.id, d.name)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* View 2: Configured Mailboxes */}
          {activeView === 'mailboxes' && (
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <div>
                  <h2 style={styles.cardTitle}>Configured Mailboxes</h2>
                  <div style={styles.cardSubtitle}>
                    IMAP credentials and active status of mailboxes monitored for automatic invoices.
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <select
                    value={filterDomainId}
                    onChange={(e) => setFilterDomainId(e.target.value)}
                    style={{ ...styles.input, width: 'auto', padding: '8px 12px' }}
                  >
                    <option value="">All Domains</option>
                    {domains.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    style={styles.btnPrimary}
                    onClick={() => setMailboxModal({ open: true, data: null })}
                  >
                    <span>+</span>
                    <span>Add Mailbox</span>
                  </button>
                </div>
              </div>

              {filteredMailboxes.length === 0 ? (
                <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
                  No mailboxes found for the selected filter.
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={{ ...styles.th, width: '80px' }}>ID</th>
                        <th style={styles.th}>Name</th>
                        <th style={styles.th}>Email</th>
                        <th style={styles.th}>Domain</th>
                        <th style={styles.th}>Status</th>
                        <th style={{ ...styles.th, textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMailboxes.map((m) => {
                        const dom = domains.find((d) => d.id === m.domain_id);
                        return (
                          <tr key={m.id}>
                            <td style={{ ...styles.td, color: '#64748b' }}>#{m.id}</td>
                            <td style={{ ...styles.td, fontWeight: '700', color: '#0f172a' }}>{m.name}</td>
                            <td style={{ ...styles.td, fontFamily: 'monospace' }}>{m.email}</td>
                            <td style={styles.td}>
                              <span style={{
                                padding: '3px 8px',
                                borderRadius: '6px',
                                backgroundColor: '#f1f5f9',
                                fontSize: '12px',
                                fontWeight: '600',
                                color: '#475569',
                              }}>
                                {dom ? dom.name : `Domain #${m.domain_id}`}
                              </span>
                            </td>
                            <td style={styles.td}>
                              <span
                                style={{
                                  display: 'inline-block',
                                  padding: '3px 10px',
                                  borderRadius: '12px',
                                  fontSize: '12px',
                                  fontWeight: '700',
                                  backgroundColor: m.is_active ? '#dcfce7' : '#fee2e2',
                                  color: m.is_active ? '#15803d' : '#b91c1c',
                                }}
                              >
                                {m.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td style={{ ...styles.td, textAlign: 'right' }}>
                              <button
                                type="button"
                                style={{ ...styles.btnSecondary, marginRight: '8px', padding: '6px 14px' }}
                                onClick={() => setMailboxModal({ open: true, data: m })}
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                style={{ ...styles.btnDanger, padding: '6px 14px' }}
                                onClick={() => handleDeleteMailbox(m.id, m.email)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Modal: Add / Edit Domain */}
      {domainModal.open && (
        <div style={styles.modal} onClick={() => setDomainModal({ open: false, data: null })}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 18px 0', fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
              {domainModal.data ? 'Edit Managed Domain' : 'Add New Domain'}
            </h3>
            <form onSubmit={handleSaveDomain}>
              <div style={{ marginBottom: '16px' }}>
                <label style={styles.label}>Domain Name</label>
                <input
                  name="name"
                  defaultValue={domainModal.data?.name || ''}
                  placeholder="e.g. eBay, Etsy, Lexware"
                  style={styles.input}
                  required
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={styles.label}>Domain URL / Host</label>
                <input
                  name="url"
                  defaultValue={domainModal.data?.url || ''}
                  placeholder="e.g. www.ebay.com or imap.gmx.net"
                  style={styles.input}
                  required
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={styles.label}>Description (Optional)</label>
                <input
                  name="description"
                  defaultValue={domainModal.data?.description || ''}
                  placeholder="Short note or platform type"
                  style={styles.input}
                />
              </div>
              <div style={styles.modalActions}>
                <button
                  type="button"
                  style={styles.btnSecondary}
                  onClick={() => setDomainModal({ open: false, data: null })}
                >
                  Cancel
                </button>
                <button type="submit" style={styles.btnPrimary}>
                  {domainModal.data ? 'Save Changes' : 'Create Domain'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add / Edit Mailbox */}
      {mailboxModal.open && (
        <div style={styles.modal} onClick={() => setMailboxModal({ open: false, data: null })}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 18px 0', fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
              {mailboxModal.data ? 'Edit Configured Mailbox' : 'Add New Mailbox'}
            </h3>
            <form onSubmit={handleSaveMailbox}>
              <div style={{ marginBottom: '16px' }}>
                <label style={styles.label}>Mailbox Name</label>
                <input
                  name="name"
                  defaultValue={mailboxModal.data?.name || ''}
                  placeholder="e.g. Primary Invoices"
                  style={styles.input}
                  required
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={styles.label}>Email Address</label>
                <input
                  name="email"
                  type="email"
                  defaultValue={mailboxModal.data?.email || ''}
                  placeholder="user@example.com"
                  style={styles.input}
                  required
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={styles.label}>Associated Domain</label>
                <select
                  name="domain_id"
                  defaultValue={mailboxModal.data?.domain_id || (domains[0]?.id || '')}
                  style={styles.input}
                  required
                >
                  <option value="" disabled>
                    Select Domain
                  </option>
                  {domains.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.url})
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="admin_mb_is_active"
                  name="is_active"
                  defaultChecked={mailboxModal.data ? mailboxModal.data.is_active : true}
                  style={{ width: '16px', height: '16px', accentColor: '#2563eb' }}
                />
                <label htmlFor="admin_mb_is_active" style={{ fontSize: '14px', color: '#334155', fontWeight: '500' }}>
                  Enable automatic monitoring for this mailbox
                </label>
              </div>
              <div style={styles.modalActions}>
                <button
                  type="button"
                  style={styles.btnSecondary}
                  onClick={() => setMailboxModal({ open: false, data: null })}
                >
                  Cancel
                </button>
                <button type="submit" style={styles.btnPrimary}>
                  {mailboxModal.data ? 'Save Changes' : 'Create Mailbox'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
