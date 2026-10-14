import React, { useState, useEffect } from 'react';
import { domainApi, mailboxApi } from '../services/api';

const styles = {
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '32px 24px',
  },
  header: {
    marginBottom: '28px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: '6px',
  },
  subtitle: {
    fontSize: '15px',
    color: '#64748b',
  },
  layout: {
    display: 'flex',
    gap: '32px',
  },
  sidebar: {
    width: '250px',
    flexShrink: 0,
    background: '#fff',
    borderRadius: '12px',
    padding: '16px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  },
  sidebarItem: {
    padding: '12px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    marginBottom: '8px',
    fontSize: '15px',
    fontWeight: '600',
    color: '#475569',
    transition: 'background 0.2s, color 0.2s',
  },
  sidebarItemActive: {
    background: '#eff6ff',
    color: '#2563eb',
  },
  content: {
    flexGrow: 1,
    background: '#fff',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    padding: '24px',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1e293b',
  },
  btnPrimary: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    background: '#3b82f6',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  btnSecondary: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    background: '#fff',
    color: '#64748b',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  btnDanger: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    background: '#ef4444',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
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
  },
  td: {
    padding: '12px 16px',
    borderBottom: '1px solid #f1f5f9',
    color: '#334155',
  },
  formGroup: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    color: '#64748b',
    marginBottom: '6px',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  modal: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalContent: {
    background: '#fff',
    padding: '24px',
    borderRadius: '12px',
    width: '100%',
    maxWidth: '500px',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '24px',
  },
  uploadBox: {
    border: '2px dashed #cbd5e1',
    borderRadius: '12px',
    padding: '40px 20px',
    textAlign: 'center',
    background: '#f8fafc',
    marginBottom: '20px',
  },
  uploadInput: {
    display: 'none',
  }
};

function ManualUploadSection({ title, destination }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = React.useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setStatus('');
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setStatus('');
    try {
      // Use dynamic import or pass manualUploadApi to avoid circular dependency if not at top level
      // We will import manualUploadApi at the top of Settings.js
      const { manualUploadApi } = require('../services/api');
      await manualUploadApi.uploadFile(destination, file);
      setStatus('File uploaded successfully!');
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      setStatus('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>{title}</h2>
      </div>
      <div style={styles.uploadBox}>
        <input
          type="file"
          accept=".pdf"
          ref={fileInputRef}
          style={styles.uploadInput}
          onChange={handleFileChange}
          id={`upload-${destination}`}
        />
        <label htmlFor={`upload-${destination}`} style={{ ...styles.btnSecondary, display: 'inline-block', marginBottom: '16px' }}>
          Select PDF File
        </label>
        {file && (
          <div style={{ marginBottom: '16px', color: '#1e293b', fontWeight: '500' }}>
            Selected: {file.name}
          </div>
        )}
        <div>
          <button
            style={{ ...styles.btnPrimary, opacity: (!file || loading) ? 0.5 : 1, cursor: (!file || loading) ? 'not-allowed' : 'pointer' }}
            disabled={!file || loading}
            onClick={handleUpload}
          >
            {loading ? 'Uploading...' : 'Upload File'}
          </button>
        </div>
        {status && (
          <div style={{ marginTop: '16px', color: status.startsWith('Error') ? '#ef4444' : '#166534', fontWeight: '500' }}>
            {status}
          </div>
        )}
      </div>
    </div>
  );
}


function Settings({ onBack }) {
  const [activeTab, setActiveTab] = useState('domains');
  const [domains, setDomains] = useState([]);
  const [mailboxes, setMailboxes] = useState([]);

  const [domainModal, setDomainModal] = useState({ open: false, data: null });
  const [mailboxModal, setMailboxModal] = useState({ open: false, data: null });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [dRes, mRes] = await Promise.all([
        domainApi.getAll(),
        mailboxApi.getAll()
      ]);
      setDomains(dRes.data || []);
      setMailboxes(mRes.data || []);
    } catch (err) {
      alert('Failed to load data: ' + err.message);
    }
  };

  const handleSaveDomain = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = {
      name: fd.get('name'),
      url: fd.get('url'),
    };
    try {
      if (domainModal.data) {
        await domainApi.update(domainModal.data.id, data);
      } else {
        await domainApi.create(data);
      }
      setDomainModal({ open: false, data: null });
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteDomain = async (id) => {
    if (!window.confirm('Are you sure you want to delete this domain?')) return;
    try {
      await domainApi.delete(id);
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSaveMailbox = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = {
      name: fd.get('name'),
      email: fd.get('email'),
      domain_id: fd.get('domain_id'),
      is_active: fd.get('is_active') === 'on'
    };
    try {
      if (mailboxModal.data) {
        await mailboxApi.update(mailboxModal.data.id, data);
      } else {
        await mailboxApi.create(data);
      }
      setMailboxModal({ open: false, data: null });
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteMailbox = async (id) => {
    if (!window.confirm('Are you sure you want to delete this mailbox?')) return;
    try {
      await mailboxApi.delete(id);
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Settings</h1>
          <p style={styles.subtitle}>Configure domains and mailboxes</p>
        </div>
        <button style={styles.btnSecondary} onClick={onBack}>← Back to Dashboard</button>
      </div>

      <div style={styles.layout}>
        <div style={styles.sidebar}>
          <div
            style={{ ...styles.sidebarItem, ...(activeTab === 'domains' ? styles.sidebarItemActive : {}) }}
            onClick={() => setActiveTab('domains')}
          >
            Domains
          </div>
          <div
            style={{ ...styles.sidebarItem, ...(activeTab === 'mailboxes' ? styles.sidebarItemActive : {}) }}
            onClick={() => setActiveTab('mailboxes')}
          >
            Mailboxes
          </div>
          {/* <div 
            style={{...styles.sidebarItem, ...(activeTab === 'upload-ebay' ? styles.sidebarItemActive : {})}}
            onClick={() => setActiveTab('upload-ebay')}
          >
            Manual upload (eBay)
          </div>
          <div 
            style={{...styles.sidebarItem, ...(activeTab === 'upload-googleads' ? styles.sidebarItemActive : {})}}
            onClick={() => setActiveTab('upload-googleads')}
          >
            Manual upload (GoogleAds)
          </div> */}
        </div>

        <div style={styles.content}>
          {activeTab === 'domains' && (
            <div>
              <div style={styles.sectionHeader}>
                <h2 style={styles.sectionTitle}>Domains</h2>
                <button style={styles.btnPrimary} onClick={() => setDomainModal({ open: true, data: null })}>+ Add Domain</button>
              </div>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>URL</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {domains.map(d => (
                    <tr key={d.id}>
                      <td style={styles.td}>{d.name}</td>
                      <td style={styles.td}>{d.url}</td>
                      <td style={styles.td}>
                        <button style={{ ...styles.btnSecondary, marginRight: '8px' }} onClick={() => setDomainModal({ open: true, data: d })}>Edit</button>
                        <button style={styles.btnDanger} onClick={() => handleDeleteDomain(d.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                  {domains.length === 0 && (
                    <tr><td colSpan="3" style={{ ...styles.td, textAlign: 'center' }}>No domains found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'mailboxes' && (
            <div>
              <div style={styles.sectionHeader}>
                <h2 style={styles.sectionTitle}>Mailboxes</h2>
                <button style={styles.btnPrimary} onClick={() => setMailboxModal({ open: true, data: null })}>+ Add Mailbox</button>
              </div>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>Domain</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mailboxes.map(m => (
                    <tr key={m.id}>
                      <td style={styles.td}>{m.name}</td>
                      <td style={styles.td}>{m.email}</td>
                      <td style={styles.td}>{m.domain_name}</td>
                      <td style={styles.td}>{m.is_active ? 'Active' : 'Inactive'}</td>
                      <td style={styles.td}>
                        <button style={{ ...styles.btnSecondary, marginRight: '8px' }} onClick={() => setMailboxModal({ open: true, data: m })}>Edit</button>
                        <button style={styles.btnDanger} onClick={() => handleDeleteMailbox(m.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                  {mailboxes.length === 0 && (
                    <tr><td colSpan="5" style={{ ...styles.td, textAlign: 'center' }}>No mailboxes found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'upload-ebay' && (
            <ManualUploadSection title="Manual upload (eBay)" destination="ebay" />
          )}

          {activeTab === 'upload-googleads' && (
            <ManualUploadSection title="Manual upload (GoogleAds)" destination="google-ads" />
          )}
        </div>
      </div>

      {domainModal.open && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h2 style={styles.sectionTitle}>{domainModal.data ? 'Edit Domain' : 'Add Domain'}</h2>
            <form onSubmit={handleSaveDomain}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Name</label>
                <input required style={styles.input} name="name" defaultValue={domainModal.data?.name || ''} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>URL</label>
                <input required style={styles.input} name="url" defaultValue={domainModal.data?.url || ''} />
              </div>
              <div style={styles.modalActions}>
                <button type="button" style={styles.btnSecondary} onClick={() => setDomainModal({ open: false, data: null })}>Cancel</button>
                <button type="submit" style={styles.btnPrimary}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {mailboxModal.open && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h2 style={styles.sectionTitle}>{mailboxModal.data ? 'Edit Mailbox' : 'Add Mailbox'}</h2>
            <form onSubmit={handleSaveMailbox}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Name</label>
                <input required style={styles.input} name="name" defaultValue={mailboxModal.data?.name || ''} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Email</label>
                <input required type="email" style={styles.input} name="email" defaultValue={mailboxModal.data?.email || ''} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Domain</label>
                <select required style={styles.input} name="domain_id" defaultValue={mailboxModal.data?.domain_id || ''}>
                  <option value="">Select Domain...</option>
                  {domains.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" name="is_active" defaultChecked={mailboxModal.data ? mailboxModal.data.is_active : true} />
                  <span style={styles.label}>Active</span>
                </label>
              </div>
              <div style={styles.modalActions}>
                <button type="button" style={styles.btnSecondary} onClick={() => setMailboxModal({ open: false, data: null })}>Cancel</button>
                <button type="submit" style={styles.btnPrimary}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Settings;
