import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import FilterSection from './FilterSection';
import FileTable from './FileTable';
import FileModal from './FileModal';
import { fileApi, jobsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const styles = {
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '32px 24px',
  },
  header: {
    marginBottom: '24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px',
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
  syncBtn: {
    padding: '11px 22px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 2px 6px rgba(37, 99, 235, 0.25)',
    transition: 'all 0.15s ease',
  },
  syncBtnDisabled: {
    backgroundColor: '#94a3b8',
    cursor: 'not-allowed',
    boxShadow: 'none',
  },
  syncStrip: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    padding: '14px 18px',
    marginBottom: '22px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
  },
  syncStripTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '12px',
  },
  syncMeta: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
    fontSize: '13px',
    color: '#334155',
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    padding: '3px 10px',
    borderRadius: '999px',
    fontSize: '11px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.4px',
  },
  historyToggle: {
    background: 'none',
    border: 'none',
    color: '#2563eb',
    fontSize: '12px',
    fontWeight: '700',
    cursor: 'pointer',
    padding: '4px 8px',
  },
  historyList: {
    marginTop: '12px',
    paddingTop: '12px',
    borderTop: '1px solid #f1f5f9',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    fontSize: '12px',
    color: '#475569',
  },
  errorBanner: {
    marginTop: '10px',
    padding: '8px 12px',
    borderRadius: '8px',
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#b91c1c',
    fontSize: '12px',
  },
  statsBar: {
    display: 'flex',
    gap: '16px',
    marginBottom: '24px',
    flexWrap: 'wrap',
  },
  statCard: {
    background: '#fff',
    padding: '16px 20px',
    borderRadius: '10px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    minWidth: '140px',
  },
  statValue: {
    fontSize: '22px',
    fontWeight: '800',
    color: '#1e293b',
  },
  statLabel: {
    fontSize: '12px',
    color: '#64748b',
    marginTop: '4px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
};

const STATUS_STYLE = {
  pending: { bg: '#fef3c7', color: '#92400e' },
  running: { bg: '#dbeafe', color: '#1d4ed8' },
  completed: { bg: '#dcfce7', color: '#166534' },
  failed: { bg: '#fee2e2', color: '#b91c1c' },
};

function formatJobTime(dt) {
  if (!dt) return '—';
  return new Date(dt).toLocaleString();
}

function Dashboard({ onOpenSettings }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [stats, setStats] = useState({ total: 0, downloaded: 0, uploaded: 0, pending: 0 });

  // Sync Jobs state
  const [jobs, setJobs] = useState([]);
  const [triggering, setTriggering] = useState(false);
  const [syncError, setSyncError] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const prevActiveJobIdRef = useRef(null);

  const fetchFiles = useCallback(async (page = 1, currentFilters = filters) => {
    setLoading(true);
    try {
      const res = await fileApi.getAll({ ...currentFilters, page, limit: 20 });
      setFiles(res.data.data || []);
      setPagination(res.data.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 });

      const globalStats = res.data.stats || { total: 0, downloaded: 0, uploaded: 0, pending: 0 };
      setStats({
        total: globalStats.total,
        downloaded: globalStats.downloaded,
        uploaded: globalStats.uploaded,
        pending: globalStats.pending,
      });
    } catch (err) {
      console.error('Failed to fetch files:', err);
      alert('Failed to load files: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchJobs = useCallback(async () => {
    try {
      const res = await jobsApi.getJobs();
      const list = Array.isArray(res.data) ? res.data : [];
      setJobs(list);

      const latest = list[0];
      const active = list.find((j) => j.status === 'pending' || j.status === 'running');
      if (active) {
        prevActiveJobIdRef.current = active.id;
      } else if (prevActiveJobIdRef.current && latest && latest.id === prevActiveJobIdRef.current) {
        prevActiveJobIdRef.current = null;
        if (latest.status === 'completed') {
          fetchFiles(1, filters);
        }
      }
    } catch (err) {
      console.error('Failed to load sync jobs:', err);
    }
  }, [fetchFiles, filters]);

  useEffect(() => {
    fetchFiles(1, {});
    fetchJobs();
  }, []);

  const activeJob = jobs.find((j) => j.status === 'pending' || j.status === 'running');
  const latestJob = jobs[0] || null;

  // Poll every 5 seconds while a job is pending or running
  useEffect(() => {
    if (!activeJob) return undefined;
    const timer = setInterval(() => {
      fetchJobs();
    }, 5000);
    return () => clearInterval(timer);
  }, [activeJob, fetchJobs]);

  const handleTriggerSync = async () => {
    setSyncError(null);
    setTriggering(true);
    try {
      await jobsApi.triggerSync('all');
      await fetchJobs();
    } catch (err) {
      setSyncError(err.message || 'Failed to trigger sync');
    } finally {
      setTriggering(false);
    }
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    fetchFiles(1, newFilters);
  };

  const handlePageChange = (newPage) => {
    fetchFiles(newPage, filters);
  };

  const handleViewDetails = (file) => {
    setSelectedFile(file);
  };

  const handleUpload = () => {
    fetchFiles(pagination.page, filters);
  };

  const userTitle = user?.username ? `${user.username}'s` : "User's";
  const isBusy = triggering || Boolean(activeJob);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>{userTitle} Invoices File System Dashboard</h1>
          <p style={styles.subtitle}>Manage and track your synchronized financial documents</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => navigate('/settings?tab=devices')}
            style={{
              padding: '11px 18px',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              color: '#334155',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>💻</span>
            <span>Windows Driver</span>
          </button>

          <button
            type="button"
            onClick={handleTriggerSync}
            disabled={isBusy}
            style={{
              ...styles.syncBtn,
              ...(isBusy ? styles.syncBtnDisabled : {}),
            }}
          >
            <span>{activeJob ? '⏳' : '🔄'}</span>
            <span>
              {triggering
                ? 'Queuing Sync...'
                : activeJob
                ? `Sync ${activeJob.status === 'running' ? 'Running' : 'Pending'}...`
                : 'Run Sync Now'}
            </span>
          </button>
        </div>
      </div>

      {/* Recent Sync Activity Strip */}
      {(latestJob || syncError) && (
        <div style={styles.syncStrip}>
          <div style={styles.syncStripTop}>
            <div style={styles.syncMeta}>
              <strong style={{ color: '#0f172a' }}>Recent Sync Activity:</strong>
              {latestJob && (
                <>
                  <span
                    style={{
                      ...styles.statusBadge,
                      backgroundColor: (STATUS_STYLE[latestJob.status] || STATUS_STYLE.pending).bg,
                      color: (STATUS_STYLE[latestJob.status] || STATUS_STYLE.pending).color,
                    }}
                  >
                    {latestJob.status}
                  </span>
                  <span>
                    Job #{latestJob.id} ({latestJob.trigger_type} · {latestJob.platform})
                  </span>
                  <span>•</span>
                  <span>{latestJob.files_processed ?? 0} file(s) processed</span>
                  <span>•</span>
                  <span style={{ color: '#64748b' }}>
                    {formatJobTime(latestJob.completed_at || latestJob.started_at || latestJob.created_at)}
                  </span>
                </>
              )}
            </div>

            {jobs.length > 1 && (
              <button
                type="button"
                style={styles.historyToggle}
                onClick={() => setShowHistory((v) => !v)}
              >
                {showHistory ? 'Hide History ▲' : `Show Recent (${jobs.length}) ▼`}
              </button>
            )}
          </div>

          {(syncError || latestJob?.error_message) && (
            <div style={styles.errorBanner}>
              <strong>Note:</strong> {syncError || latestJob.error_message}
            </div>
          )}

          {showHistory && jobs.length > 1 && (
            <div style={styles.historyList}>
              {jobs.slice(1, 6).map((j) => (
                <div key={j.id} style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                  <span>
                    #{j.id} · {j.trigger_type} ({j.platform}) — <strong>{j.status}</strong> · {j.files_processed ?? 0} file(s)
                  </span>
                  <span style={{ color: '#94a3b8' }}>{formatJobTime(j.created_at)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div style={styles.statsBar}>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{stats.total}</div>
          <div style={styles.statLabel}>Total Files</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statValue, color: '#3b82f6' }}>{stats.downloaded}</div>
          <div style={styles.statLabel}>Downloaded</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statValue, color: '#22c55e' }}>{stats.uploaded}</div>
          <div style={styles.statLabel}>Uploaded</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statValue, color: '#f59e0b' }}>{stats.pending}</div>
          <div style={styles.statLabel}>Pending Upload</div>
        </div>
      </div>

      <FilterSection onFilter={handleFilter} />

      <FileTable
        files={files}
        pagination={pagination}
        onPageChange={handlePageChange}
        onViewDetails={handleViewDetails}
        onUpload={handleUpload}
        loading={loading}
      />

      {selectedFile && (
        <FileModal file={selectedFile} onClose={() => setSelectedFile(null)} />
      )}
    </div>
  );
}

export default Dashboard;
