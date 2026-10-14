import React, { useState, useEffect } from 'react';
import { fileApi } from '../services/api';

const styles = {
  tableContainer: {
    background: '#fff',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    overflow: 'hidden',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px',
  },
  thead: {
    background: '#f8fafc',
  },
  th: {
    padding: '14px 16px',
    textAlign: 'left',
    fontWeight: '600',
    color: '#475569',
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderBottom: '1px solid #e2e8f0',
    whiteSpace: 'nowrap',
  },
  td: {
    padding: '14px 16px',
    borderBottom: '1px solid #f1f5f9',
    color: '#334155',
    verticalAlign: 'middle',
  },
  trHover: {
    transition: 'background 0.15s',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '3px 10px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: '600',
  },
  badgeSuccess: {
    background: '#dcfce7',
    color: '#166534',
  },
  badgeGray: {
    background: '#f1f5f9',
    color: '#64748b',
  },
  actionBtn: {
    padding: '6px 10px',
    borderRadius: '6px',
    border: '1px solid #e2e8f0',
    background: '#fff',
    cursor: 'pointer',
    fontSize: '13px',
    color: '#475569',
    transition: 'all 0.15s',
    marginRight: '6px',
  },
  actionBtnPrimary: {
    background: '#3b82f6',
    color: '#fff',
    border: 'none',
  },
  actionBtnDisabled: {
    opacity: 0.4,
    cursor: 'not-allowed',
  },
  switch: {
    position: 'relative',
    display: 'inline-block',
    width: '36px',
    height: '20px',
  },
  switchInput: {
    opacity: 0,
    width: 0,
    height: 0,
  },
  switchSlider: (checked) => ({
    position: 'absolute',
    cursor: 'default',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: checked ? '#3b82f6' : '#cbd5e1',
    borderRadius: '20px',
    transition: '0.3s',
  }),
  switchKnob: (checked) => ({
    position: 'absolute',
    content: '""',
    height: '14px',
    width: '14px',
    left: checked ? '18px' : '3px',
    bottom: '3px',
    backgroundColor: '#fff',
    borderRadius: '50%',
    transition: '0.3s',
  }),
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#94a3b8',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    borderTop: '1px solid #e2e8f0',
  },
  pageBtn: {
    padding: '6px 14px',
    borderRadius: '6px',
    border: '1px solid #e2e8f0',
    background: '#fff',
    cursor: 'pointer',
    fontSize: '13px',
  },
  pageBtnDisabled: {
    opacity: 0.4,
    cursor: 'not-allowed',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    zIndex: 9999,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '90%',
    height: '90%',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '16px',
    borderBottom: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc',
    alignItems: 'center'
  },
  closeBtn: {
    padding: '6px 12px',
    backgroundColor: '#ef4444',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold'
  }
};

function formatDateTime(dt) {
  if (!dt) return '—';
  const d = new Date(dt);
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function FileTable({ files, pagination, onPageChange, onViewDetails, onUpload, loading }) {
  const { page, limit, total, totalPages } = pagination;
  const [viewingFileId, setViewingFileId] = useState(null);
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  useEffect(() => {
    if (viewingFileId) {
      setPdfLoading(true);
      fetch(fileApi.viewFile(viewingFileId))
        .then(res => {
          if (!res.ok) throw new Error('Failed to load PDF');
          return res.blob();
        })
        .then(blob => {
          const url = URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
          setPdfBlobUrl(url);
          setPdfLoading(false);
        })
        .catch(err => {
          console.error(err);
          setPdfLoading(false);
          alert('Failed to load PDF');
        });
    } else {
      if (pdfBlobUrl) {
        URL.revokeObjectURL(pdfBlobUrl);
        setPdfBlobUrl(null);
      }
    }
  }, [viewingFileId]);

  const handleUpload = async (file) => {
    if (file.is_uploaded_to_destination) return;
    try {
      await fileApi.upload(file.id);
      onUpload();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div style={styles.tableContainer}>
        <div style={styles.emptyState}>Loading files...</div>
      </div>
    );
  }

  if (!files || files.length === 0) {
    return (
      <div style={styles.tableContainer}>
        <div style={styles.emptyState}>
          <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#64748b' }}>
            No files found
          </div>
          <div style={{ fontSize: '14px' }}>Try adjusting your filters.</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.tableContainer}>
      <div style={{ overflowX: 'auto' }}>
        <table style={styles.table}>
          <thead style={styles.thead}>
            <tr>
              <th style={styles.th}>SL</th>
              <th style={styles.th}>File Name</th>
              <th style={styles.th}>Downloaded At</th>
              <th style={styles.th}>Uploaded In</th>
              <th style={styles.th}>Mailbox</th>
              <th style={styles.th}>Is Uploaded</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file, idx) => {
              const sl = (page - 1) * limit + idx + 1;
              // const autoUpload = !file.is_manually_uploaded;
              const isUploaded = file.is_uploaded_to_destination || file.is_manually_uploaded;

              return (
                <tr
                  key={file.id}
                  style={styles.trHover}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#f8fafc'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <td style={styles.td}>{sl}</td>
                  <td style={{ ...styles.td, fontWeight: '500', color: '#1e293b', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {file.original_name}
                  </td>
                  <td style={styles.td}>{formatDateTime(file.downloaded_date_time)}</td>
                  <td style={styles.td}>{file.upload_destination || '—'}</td>
                  <td style={{ ...styles.td, fontWeight: '500' }}>{file.mailbox_name}</td>
                  <td style={styles.td}>
                    <label style={styles.switch}>
                      <input
                        type="checkbox"
                        checked={isUploaded}
                        readOnly
                        style={styles.switchInput}
                      />
                      <span style={styles.switchSlider(isUploaded)}>
                        <span style={styles.switchKnob(isUploaded)} />
                      </span>
                    </label>
                  </td>
                  <td style={styles.td}>
                    <button
                      style={styles.actionBtn}
                      onClick={() => onViewDetails(file)}
                      title="View Metadata"
                    >
                      ℹ️
                    </button>
                    <button
                      style={styles.actionBtn}
                      onClick={() => setViewingFileId(file.id)}
                      title="View File"
                    >
                      👁️
                    </button>
                    <button
                      style={{
                        ...styles.actionBtn,
                        ...styles.actionBtnPrimary,
                        ...(file.is_uploaded_to_destination ? styles.actionBtnDisabled : {}),
                      }}
                      onClick={() => handleUpload(file)}
                      disabled={file.is_uploaded_to_destination}
                      title={file.is_uploaded_to_destination ? 'Already uploaded' : 'Upload to destination'}
                    >
                      ⬆️
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div style={styles.pagination}>
          <div style={{ fontSize: '13px', color: '#64748b' }}>
            Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total} files
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              style={{ ...styles.pageBtn, ...(page <= 1 ? styles.pageBtnDisabled : {}) }}
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
            >
              Previous
            </button>
            <span style={{ padding: '6px 12px', fontSize: '13px', color: '#475569', fontWeight: '500' }}>
              Page {page} of {totalPages}
            </span>
            <button
              style={{ ...styles.pageBtn, ...(page >= totalPages ? styles.pageBtnDisabled : {}) }}
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {viewingFileId && (
        <div style={styles.modalOverlay} onClick={() => setViewingFileId(null)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>PDF Viewer</h3>
              <button style={styles.closeBtn} onClick={() => setViewingFileId(null)}>Close</button>
            </div>
            <div style={{ flex: 1, position: 'relative' }}>
              {pdfLoading ? (
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#64748b' }}>
                  Loading PDF...
                </div>
              ) : pdfBlobUrl ? (
                <iframe
                  src={pdfBlobUrl}
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  title="PDF Viewer"
                />
              ) : (
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#ef4444' }}>
                  Could not load the PDF.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FileTable;
