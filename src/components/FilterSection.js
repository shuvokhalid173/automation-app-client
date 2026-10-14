import React, { useState, useEffect } from 'react';
import { domainApi, mailboxApi } from '../services/api';

const styles = {
  container: {
    background: '#fff',
    padding: '20px 24px',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    marginBottom: '24px',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
    alignItems: 'flex-end',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    minWidth: '180px',
    flex: '1 1 180px',
  },
  label: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  select: {
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    fontSize: '14px',
    background: '#fff',
    color: '#1e293b',
    cursor: 'pointer',
    outline: 'none',
  },
  input: {
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    fontSize: '14px',
    background: '#fff',
    color: '#1e293b',
    outline: 'none',
  },
  button: {
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    background: '#3b82f6',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  resetBtn: {
    padding: '10px 20px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    background: '#fff',
    color: '#64748b',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};

function FilterSection({ onFilter }) {
  const [domains, setDomains] = useState([]);
  const [mailboxes, setMailboxes] = useState([]);
  const [domainId, setDomainId] = useState('');
  const [mailboxId, setMailboxId] = useState('');
  const [downloadedYearMonth, setDownloadedYearMonth] = useState('');
  const [uploadedYearMonth, setUploadedYearMonth] = useState('');
  const [loadingMailboxes, setLoadingMailboxes] = useState(false);

  useEffect(() => {
    domainApi.getAll()
      .then((res) => setDomains(res.data || []))
      .catch((err) => console.error('Failed to load domains:', err));
  }, []);

  useEffect(() => {
    if (!domainId) {
      setMailboxes([]);
      setMailboxId('');
      return;
    }
    setLoadingMailboxes(true);
    mailboxApi.getByDomain(domainId)
      .then((res) => {
        setMailboxes(res.data || []);
        setMailboxId('');
      })
      .catch((err) => console.error('Failed to load mailboxes:', err))
      .finally(() => setLoadingMailboxes(false));
  }, [domainId]);

  const handleApply = () => {
    onFilter({
      domain_id: domainId || undefined,
      mailbox_id: mailboxId || undefined,
      downloaded_year_month: downloadedYearMonth || undefined,
      uploaded_year_month: uploadedYearMonth || undefined,
    });
  };

  const handleReset = () => {
    setDomainId('');
    setMailboxId('');
    setDownloadedYearMonth('');
    setUploadedYearMonth('');
    onFilter({});
  };

  return (
    <div style={styles.container}>
      <div style={styles.field}>
        <label style={styles.label}>Domain</label>
        <select
          style={styles.select}
          value={domainId}
          onChange={(e) => setDomainId(e.target.value)}
        >
          <option value="">All Domains</option>
          {domains.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Mailbox</label>
        <select
          style={{
            ...styles.select,
            opacity: loadingMailboxes ? 0.6 : 1,
          }}
          value={mailboxId}
          onChange={(e) => setMailboxId(e.target.value)}
          disabled={!domainId || loadingMailboxes}
        >
          <option value="">
            {!domainId ? 'Select a domain first' : 'All Mailboxes'}
          </option>
          {mailboxes.map((m) => (
            <option key={m.id} value={m.id}>{m.name} ({m.email})</option>
          ))}
        </select>
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Downloaded (Year-Month)</label>
        <input
          type="month"
          style={styles.input}
          value={downloadedYearMonth}
          onChange={(e) => setDownloadedYearMonth(e.target.value)}
        />
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Uploaded (Year-Month)</label>
        <input
          type="month"
          style={styles.input}
          value={uploadedYearMonth}
          onChange={(e) => setUploadedYearMonth(e.target.value)}
        />
      </div>

      <div style={{ display: 'flex', gap: '10px', marginLeft: 'auto' }}>
        <button style={styles.resetBtn} onClick={handleReset}>Reset</button>
        <button style={styles.button} onClick={handleApply}>Apply Filters</button>
      </div>
    </div>
  );
}

export default FilterSection;
