import React from 'react';

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  modal: {
    background: '#fff',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '560px',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
  },
  header: {
    padding: '20px 24px',
    borderBottom: '1px solid #f1f5f9',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1e293b',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '22px',
    cursor: 'pointer',
    color: '#94a3b8',
    lineHeight: 1,
  },
  body: {
    padding: '20px 24px',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 0',
    borderBottom: '1px solid #f8fafc',
  },
  label: {
    fontSize: '13px',
    color: '#64748b',
    fontWeight: '500',
  },
  value: {
    fontSize: '13px',
    color: '#1e293b',
    fontWeight: '600',
    maxWidth: '60%',
    textAlign: 'right',
    wordBreak: 'break-word',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '2px 10px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: '600',
  },
  badgeGreen: { background: '#dcfce7', color: '#166534' },
  badgeRed: { background: '#fee2e2', color: '#991b1b' },
  badgeGray: { background: '#f1f5f9', color: '#64748b' },
};

function formatValue(value) {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (value instanceof Date || (typeof value === 'string' && !isNaN(Date.parse(value)))) {
    return new Date(value).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }
  return String(value);
}

function FileModal({ file, onClose }) {
  if (!file) return null;

  const fields = [
    { label: 'ID', key: 'id' },
    { label: 'Original Name', key: 'original_name' },
    { label: 'Displayed Name (Local)', key: 'displayed_name_local' },
    { label: 'Downloaded', key: 'is_downloaded', isBool: true },
    { label: 'Downloaded At', key: 'downloaded_date_time' },
    { label: 'Uploaded to Destination', key: 'is_uploaded_to_destination', isBool: true },
    { label: 'Upload Destination', key: 'upload_destination' },
    { label: 'Uploaded At', key: 'uploaded_date_time' },
    { label: 'Manually Uploaded', key: 'is_manually_uploaded', isBool: true },
    { label: 'Mailbox Name', key: 'mailbox_name' },
    { label: 'Mailbox Email', key: 'mailbox_email' },
    { label: 'Domain', key: 'domain_name' },
    { label: 'Local File Location', key: 'local_file_location' },
    { label: 'Soft Deleted', key: 'is_soft_deleted', isBool: true },
    { label: 'Created At', key: 'created_at' },
    { label: 'Updated At', key: 'updated_at' },
  ];

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <div style={styles.title}>File Metadata</div>
          <button style={styles.closeBtn} onClick={onClose}>×</button>
        </div>
        <div style={styles.body}>
          {fields.map((field) => {
            const value = file[field.key];
            let displayValue = formatValue(value);

            if (field.isBool) {
              const isTrue = Boolean(value);
              displayValue = (
                <span style={{ ...styles.badge, ...(isTrue ? styles.badgeGreen : styles.badgeRed) }}>
                  {isTrue ? 'Yes' : 'No'}
                </span>
              );
            }

            return (
              <div key={field.key} style={styles.row}>
                <span style={styles.label}>{field.label}</span>
                <span style={styles.value}>{displayValue}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default FileModal;
