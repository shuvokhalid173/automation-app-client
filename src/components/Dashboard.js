import React, { useState, useEffect, useCallback } from 'react';
import FilterSection from './FilterSection';
import FileTable from './FileTable';
import FileModal from './FileModal';
import { fileApi } from '../services/api';

const styles = {
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '32px 24px',
  },
  header: {
    marginBottom: '28px',
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

function Dashboard({ onOpenSettings }) {
  const [files, setFiles] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [stats, setStats] = useState({ total: 0, downloaded: 0, uploaded: 0, pending: 0 });

  const fetchFiles = useCallback(async (page = 1, currentFilters = filters) => {
    setLoading(true);
    try {
      const res = await fileApi.getAll({ ...currentFilters, page, limit: 20 });
      setFiles(res.data.data || []);
      setPagination(res.data.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 });

      // Global stats from the backend for the active filters
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

  useEffect(() => {
    fetchFiles(1, {});
  }, []);

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

  return (
    <div style={styles.container}>
      <div style={{ ...styles.header, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={styles.title}>Rene's Invoices File System Dashboard</h1>
          <p style={styles.subtitle}>Manage and track your local files</p>
        </div>
        <button
          onClick={onOpenSettings}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            background: '#fff',
            color: '#475569',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          ⚙️ Settings
        </button>
      </div>

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
