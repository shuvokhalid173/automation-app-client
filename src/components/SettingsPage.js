import React, { useState, useEffect } from 'react';
import { settingsApi, domainApi, mailboxApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const timezones = [
  { value: 'Europe/Berlin', label: 'Europe/Berlin (CET/CEST - UTC+1/+2)' },
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
  { value: 'Europe/London', label: 'Europe/London (GMT/BST - UTC+0/+1)' },
  { value: 'Europe/Paris', label: 'Europe/Paris (CET/CEST - UTC+1/+2)' },
  { value: 'America/New_York', label: 'America/New_York (EST/EDT - UTC-5/-4)' },
  { value: 'America/Chicago', label: 'America/Chicago (CST/CDT - UTC-6/-5)' },
  { value: 'America/Denver', label: 'America/Denver (MST/MDT - UTC-7/-6)' },
  { value: 'America/Los_Angeles', label: 'America/Los_Angeles (PST/PDT - UTC-8/-7)' },
  { value: 'Asia/Dubai', label: 'Asia/Dubai (GST - UTC+4)' },
  { value: 'Asia/Tokyo', label: 'Asia/Tokyo (JST - UTC+9)' },
  { value: 'Asia/Singapore', label: 'Asia/Singapore (SGT - UTC+8)' },
  { value: 'Australia/Sydney', label: 'Australia/Sydney (AEST/AEDT - UTC+10/+11)' },
];

const daysOfWeek = [
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
  { value: 7, label: 'Sunday' },
];

const styles = {
  container: {
    maxWidth: '1200px',
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
    letterSpacing: '-0.5px',
    marginBottom: '6px',
  },
  subtitle: {
    fontSize: '15px',
    color: '#64748b',
    lineHeight: '1.5',
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
    marginBottom: '20px',
    borderBottom: '1px solid #f1f5f9',
    paddingBottom: '16px',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '4px',
  },
  cardSubtitle: {
    fontSize: '14px',
    color: '#64748b',
  },
  toggleRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    marginBottom: '24px',
  },
  toggleInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  toggleLabel: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#1e293b',
  },
  toggleDesc: {
    fontSize: '13px',
    color: '#64748b',
  },
  switch: {
    position: 'relative',
    display: 'inline-block',
    width: '52px',
    height: '28px',
    flexShrink: 0,
  },
  switchInput: {
    opacity: 0,
    width: 0,
    height: 0,
  },
  slider: {
    position: 'absolute',
    cursor: 'pointer',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#cbd5e1',
    transition: '0.2s',
    borderRadius: '34px',
  },
  sliderActive: {
    backgroundColor: '#10b981',
  },
  sliderCircle: {
    position: 'absolute',
    content: '""',
    height: '20px',
    width: '20px',
    left: '4px',
    bottom: '4px',
    backgroundColor: 'white',
    transition: '0.2s',
    borderRadius: '50%',
    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
  },
  sliderCircleActive: {
    transform: 'translateX(24px)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
    marginBottom: '24px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#334155',
  },
  input: {
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    fontSize: '14px',
    color: '#0f172a',
    backgroundColor: '#ffffff',
    outline: 'none',
    transition: 'border-color 0.15s, box-shadow 0.15s',
  },
  helperText: {
    fontSize: '12px',
    color: '#64748b',
  },
  summaryBox: {
    padding: '16px 20px',
    borderRadius: '12px',
    backgroundColor: '#eff6ff',
    border: '1px solid #bfdbfe',
    color: '#1e40af',
    fontSize: '14px',
    lineHeight: '1.5',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  summaryIcon: {
    fontSize: '20px',
    flexShrink: 0,
  },
  btnSave: {
    padding: '12px 24px',
    borderRadius: '8px',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.15s ease',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
  },
  toast: {
    padding: '12px 18px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '14px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  toastSuccess: {
    backgroundColor: '#dcfce7',
    border: '1px solid #86efac',
    color: '#15803d',
  },
  toastError: {
    backgroundColor: '#fee2e2',
    border: '1px solid #fca5a5',
    color: '#b91c1c',
  },
  // Table styles for Admin tabs
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
  btnPrimary: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    background: '#2563eb',
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
};

export default function SettingsPage() {
  const { user } = useAuth();
  const isAdmin = Boolean(user?.isAdmin);

  const [activeTab, setActiveTab] = useState('schedule');

  // Automation Schedule Form State
  const [loadingSchedule, setLoadingSchedule] = useState(true);
  const [savingSchedule, setSavingSchedule] = useState(false);
  const [scheduleMessage, setScheduleMessage] = useState(null);

  const [isActive, setIsActive] = useState(true);
  const [timezone, setTimezone] = useState('Europe/Berlin');
  const [frequency, setFrequency] = useState('monthly');
  const [dayOfMonth, setDayOfMonth] = useState(1);
  const [dayOfWeek, setDayOfWeek] = useState(1);
  const [executionTime, setExecutionTime] = useState('02:00');

  // Admin Data State (Domains & Mailboxes)
  const [domains, setDomains] = useState([]);
  const [mailboxes, setMailboxes] = useState([]);
  const [domainModal, setDomainModal] = useState({ open: false, data: null });
  const [mailboxModal, setMailboxModal] = useState({ open: false, data: null });

  // 1. Fetch user automation settings on mount
  useEffect(() => {
    async function loadSettings() {
      try {
        setLoadingSchedule(true);
        const res = await settingsApi.get();
        if (res.data) {
          const s = res.data;
          setIsActive(s.isActive !== undefined ? s.isActive : true);
          setTimezone(s.timezone || 'Europe/Berlin');
          setFrequency((s.frequency || 'monthly').toLowerCase());
          setDayOfMonth(s.dayOfMonth !== undefined ? Number(s.dayOfMonth) : 1);
          setDayOfWeek(s.dayOfWeek !== undefined ? Number(s.dayOfWeek) : 1);
          // Normalize time string e.g. "02:00:00" -> "02:00"
          const rawTime = s.executionTime || '02:00';
          setExecutionTime(rawTime.slice(0, 5));
        }
      } catch (err) {
        console.error('Failed to load user settings:', err);
        setScheduleMessage({ type: 'error', text: 'Failed to load scheduling preferences: ' + err.message });
      } finally {
        setLoadingSchedule(false);
      }
    }

    loadSettings();
  }, []);

  // 2. Fetch admin data if admin
  useEffect(() => {
    if (isAdmin) {
      fetchAdminData();
    }
  }, [isAdmin]);

  const fetchAdminData = async () => {
    try {
      const [dRes, mRes] = await Promise.all([
        domainApi.getAll(),
        mailboxApi.getAll(),
      ]);
      setDomains(dRes.data || []);
      setMailboxes(mRes.data || []);
    } catch (err) {
      console.error('Failed to load admin settings data:', err);
    }
  };

  // Handle Save Automation Schedule
  const handleSaveSchedule = async (e) => {
    e.preventDefault();
    setSavingSchedule(true);
    setScheduleMessage(null);

    const payload = {
      isActive,
      timezone,
      frequency,
      dayOfMonth: frequency === 'monthly' ? Number(dayOfMonth) : undefined,
      dayOfWeek: frequency === 'weekly' ? Number(dayOfWeek) : undefined,
      executionTime,
    };

    try {
      const res = await settingsApi.update(payload);
      if (res.data) {
        const s = res.data;
        setIsActive(s.isActive !== undefined ? s.isActive : true);
        setTimezone(s.timezone || 'Europe/Berlin');
        setFrequency((s.frequency || 'monthly').toLowerCase());
        setDayOfMonth(s.dayOfMonth !== undefined ? Number(s.dayOfMonth) : 1);
        setDayOfWeek(s.dayOfWeek !== undefined ? Number(s.dayOfWeek) : 1);
        setExecutionTime((s.executionTime || '02:00').slice(0, 5));
      }
      setScheduleMessage({ type: 'success', text: 'Automation schedule saved successfully!' });
      setTimeout(() => setScheduleMessage(null), 5000);
    } catch (err) {
      console.error('Failed to save settings:', err);
      setScheduleMessage({ type: 'error', text: err.message || 'Failed to save automation schedule.' });
    } finally {
      setSavingSchedule(false);
    }
  };

  // Helper text summary
  const getSummaryText = () => {
    if (!isActive) {
      return 'Automated sync is currently disabled. Background worker jobs will not execute.';
    }
    const tzLabel = timezones.find((t) => t.value === timezone)?.label.split(' ')[0] || timezone;
    if (frequency === 'daily') {
      return `Automation workers will execute Daily at ${executionTime} (${tzLabel}).`;
    }
    if (frequency === 'weekly') {
      const dayLabel = daysOfWeek.find((d) => d.value === Number(dayOfWeek))?.label || 'Monday';
      return `Automation workers will execute Weekly on ${dayLabel}s at ${executionTime} (${tzLabel}).`;
    }
    // Monthly
    const suffix = dayOfMonth === 1 ? 'st' : dayOfMonth === 2 ? 'nd' : dayOfMonth === 3 ? 'rd' : 'th';
    return `Automation workers will execute Monthly on the ${dayOfMonth}${suffix} of every month at ${executionTime} (${tzLabel}).`;
  };

  // Admin Domain Handlers
  const handleSaveDomain = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = { name: fd.get('name'), url: fd.get('url') };
    try {
      if (domainModal.data) {
        await domainApi.update(domainModal.data.id, data);
      } else {
        await domainApi.create(data);
      }
      setDomainModal({ open: false, data: null });
      fetchAdminData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteDomain = async (id) => {
    if (!window.confirm('Are you sure you want to delete this domain?')) return;
    try {
      await domainApi.delete(id);
      fetchAdminData();
    } catch (err) {
      alert(err.message);
    }
  };

  // Admin Mailbox Handlers
  const handleSaveMailbox = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = {
      name: fd.get('name'),
      email: fd.get('email'),
      domain_id: fd.get('domain_id'),
      is_active: fd.get('is_active') === 'on',
    };
    try {
      if (mailboxModal.data) {
        await mailboxApi.update(mailboxModal.data.id, data);
      } else {
        await mailboxApi.create(data);
      }
      setMailboxModal({ open: false, data: null });
      fetchAdminData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteMailbox = async (id) => {
    if (!window.confirm('Are you sure you want to delete this mailbox?')) return;
    try {
      await mailboxApi.delete(id);
      fetchAdminData();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Settings</h1>
        <p style={styles.subtitle}>
          Configure your automation worker schedules, sync intervals, and integration preferences.
        </p>
      </header>

      {/* Tab Navigation (Shown for Admins to switch between Schedule, Domains, and Mailboxes) */}
      {isAdmin && (
        <div style={styles.tabBar}>
          <button
            type="button"
            style={{ ...styles.tabBtn, ...(activeTab === 'schedule' ? styles.tabBtnActive : {}) }}
            onClick={() => setActiveTab('schedule')}
          >
            <span>⏱️</span>
            <span>Automation Schedule</span>
          </button>
          <button
            type="button"
            style={{ ...styles.tabBtn, ...(activeTab === 'domains' ? styles.tabBtnActive : {}) }}
            onClick={() => setActiveTab('domains')}
          >
            <span>🌐</span>
            <span>Domains</span>
          </button>
          <button
            type="button"
            style={{ ...styles.tabBtn, ...(activeTab === 'mailboxes' ? styles.tabBtnActive : {}) }}
            onClick={() => setActiveTab('mailboxes')}
          >
            <span>📬</span>
            <span>Mailboxes</span>
          </button>
        </div>
      )}

      {/* Tab 1: Automation Scheduling System (Available to all users) */}
      {activeTab === 'schedule' && (
        <div>
          {scheduleMessage && (
            <div
              style={{
                ...styles.toast,
                ...(scheduleMessage.type === 'success' ? styles.toastSuccess : styles.toastError),
              }}
            >
              <span>{scheduleMessage.type === 'success' ? '✓' : '⚠️'}</span>
              <span>{scheduleMessage.text}</span>
            </div>
          )}

          {loadingSchedule ? (
            <div style={{ ...styles.card, textAlign: 'center', padding: '48px', color: '#64748b' }}>
              Loading automation schedule preferences...
            </div>
          ) : (
            <form onSubmit={handleSaveSchedule}>
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <h2 style={styles.cardTitle}>Worker Automation Rules</h2>
                  <p style={styles.cardSubtitle}>
                    Define the exact schedule and time intervals for automatic document sync and invoice reconciliation.
                  </p>
                </div>

                {/* Section 1: Master Switch */}
                <div style={styles.toggleRow}>
                  <div style={styles.toggleInfo}>
                    <span style={styles.toggleLabel}>Enable Automated Sync</span>
                    <span style={styles.toggleDesc}>
                      Master switch to activate or pause all background worker runs.
                    </span>
                  </div>
                  <label style={styles.switch}>
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      style={styles.switchInput}
                    />
                    <span
                      style={{
                        ...styles.slider,
                        ...(isActive ? styles.sliderActive : {}),
                      }}
                    >
                      <span
                        style={{
                          ...styles.sliderCircle,
                          ...(isActive ? styles.sliderCircleActive : {}),
                        }}
                      />
                    </span>
                  </label>
                </div>

                {/* Section 2: Scheduling Parameters */}
                <div style={styles.grid}>
                  {/* Timezone */}
                  <div style={styles.formGroup}>
                    <label htmlFor="setting-timezone" style={styles.label}>
                      Timezone
                    </label>
                    <select
                      id="setting-timezone"
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      style={styles.input}
                    >
                      {timezones.map((tz) => (
                        <option key={tz.value} value={tz.value}>
                          {tz.label}
                        </option>
                      ))}
                    </select>
                    <span style={styles.helperText}>Used to interpret your worker execution time.</span>
                  </div>

                  {/* Frequency */}
                  <div style={styles.formGroup}>
                    <label htmlFor="setting-frequency" style={styles.label}>
                      Frequency
                    </label>
                    <select
                      id="setting-frequency"
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value)}
                      style={styles.input}
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                    <span style={styles.helperText}>How often automation tasks run.</span>
                  </div>

                  {/* Dynamic Input 1: Day of Month (Monthly only) */}
                  {frequency === 'monthly' && (
                    <div style={styles.formGroup}>
                      <label htmlFor="setting-day-of-month" style={styles.label}>
                        Day of the Month (1-31)
                      </label>
                      <input
                        id="setting-day-of-month"
                        type="number"
                        min="1"
                        max="31"
                        value={dayOfMonth}
                        onChange={(e) => setDayOfMonth(Math.max(1, Math.min(31, Number(e.target.value))))}
                        style={styles.input}
                        required
                      />
                      <span style={styles.helperText}>Calendar day for the monthly automation cycle.</span>
                    </div>
                  )}

                  {/* Dynamic Input 2: Day of Week (Weekly only) */}
                  {frequency === 'weekly' && (
                    <div style={styles.formGroup}>
                      <label htmlFor="setting-day-of-week" style={styles.label}>
                        Day of the Week
                      </label>
                      <select
                        id="setting-day-of-week"
                        value={dayOfWeek}
                        onChange={(e) => setDayOfWeek(Number(e.target.value))}
                        style={styles.input}
                      >
                        {daysOfWeek.map((day) => (
                          <option key={day.value} value={day.value}>
                            {day.label}
                          </option>
                        ))}
                      </select>
                      <span style={styles.helperText}>Day of each week to trigger sync.</span>
                    </div>
                  )}

                  {/* Execution Time */}
                  <div style={styles.formGroup}>
                    <label htmlFor="setting-execution-time" style={styles.label}>
                      Execution Time
                    </label>
                    <input
                      id="setting-execution-time"
                      type="time"
                      value={executionTime}
                      onChange={(e) => setExecutionTime(e.target.value)}
                      style={styles.input}
                      required
                    />
                    <span style={styles.helperText}>24-hour time format (HH:MM).</span>
                  </div>
                </div>

                {/* Summary Box */}
                <div style={styles.summaryBox}>
                  <span style={styles.summaryIcon}>{isActive ? '📅' : '⏸️'}</span>
                  <span>{getSummaryText()}</span>
                </div>

                {/* Save Button */}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="submit"
                    style={{
                      ...styles.btnSave,
                      opacity: savingSchedule ? 0.7 : 1,
                      cursor: savingSchedule ? 'not-allowed' : 'pointer',
                    }}
                    disabled={savingSchedule}
                  >
                    {savingSchedule ? 'Saving Preferences...' : 'Save Preferences'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Tab 2: Domains (Admin Only) */}
      {isAdmin && activeTab === 'domains' && (
        <div style={styles.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={styles.cardTitle}>Managed Domains</h2>
            <button
              type="button"
              style={styles.btnPrimary}
              onClick={() => setDomainModal({ open: true, data: null })}
            >
              + Add Domain
            </button>
          </div>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>URL</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {domains.map((d) => (
                <tr key={d.id}>
                  <td style={styles.td}>#{d.id}</td>
                  <td style={{ ...styles.td, fontWeight: '600' }}>{d.name}</td>
                  <td style={styles.td}>{d.url}</td>
                  <td style={{ ...styles.td, textAlign: 'right' }}>
                    <button
                      type="button"
                      style={{ ...styles.btnSecondary, marginRight: '8px', padding: '6px 12px' }}
                      onClick={() => setDomainModal({ open: true, data: d })}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      style={{ ...styles.btnDanger, padding: '6px 12px' }}
                      onClick={() => handleDeleteDomain(d.id)}
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

      {/* Tab 3: Mailboxes (Admin Only) */}
      {isAdmin && activeTab === 'mailboxes' && (
        <div style={styles.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={styles.cardTitle}>Configured Mailboxes</h2>
            <button
              type="button"
              style={styles.btnPrimary}
              onClick={() => setMailboxModal({ open: true, data: null })}
            >
              + Add Mailbox
            </button>
          </div>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Domain</th>
                <th style={styles.th}>Status</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mailboxes.map((m) => {
                const dom = domains.find((d) => d.id === m.domain_id);
                return (
                  <tr key={m.id}>
                    <td style={styles.td}>#{m.id}</td>
                    <td style={{ ...styles.td, fontWeight: '600' }}>{m.name}</td>
                    <td style={styles.td}>{m.email}</td>
                    <td style={styles.td}>{dom ? dom.name : m.domain_id}</td>
                    <td style={styles.td}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '3px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '600',
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
                        style={{ ...styles.btnSecondary, marginRight: '8px', padding: '6px 12px' }}
                        onClick={() => setMailboxModal({ open: true, data: m })}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        style={{ ...styles.btnDanger, padding: '6px 12px' }}
                        onClick={() => handleDeleteMailbox(m.id)}
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

      {/* Modal: Add/Edit Domain */}
      {domainModal.open && (
        <div style={styles.modal} onClick={() => setDomainModal({ open: false, data: null })}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '700' }}>
              {domainModal.data ? 'Edit Domain' : 'Add Domain'}
            </h3>
            <form onSubmit={handleSaveDomain}>
              <div style={{ marginBottom: '16px' }}>
                <label style={styles.label}>Name</label>
                <input
                  name="name"
                  defaultValue={domainModal.data?.name || ''}
                  style={styles.input}
                  required
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={styles.label}>URL</label>
                <input
                  name="url"
                  defaultValue={domainModal.data?.url || ''}
                  style={styles.input}
                  required
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
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add/Edit Mailbox */}
      {mailboxModal.open && (
        <div style={styles.modal} onClick={() => setMailboxModal({ open: false, data: null })}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '700' }}>
              {mailboxModal.data ? 'Edit Mailbox' : 'Add Mailbox'}
            </h3>
            <form onSubmit={handleSaveMailbox}>
              <div style={{ marginBottom: '16px' }}>
                <label style={styles.label}>Name</label>
                <input
                  name="name"
                  defaultValue={mailboxModal.data?.name || ''}
                  style={styles.input}
                  required
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={styles.label}>Email</label>
                <input
                  name="email"
                  type="email"
                  defaultValue={mailboxModal.data?.email || ''}
                  style={styles.input}
                  required
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={styles.label}>Domain</label>
                <select
                  name="domain_id"
                  defaultValue={mailboxModal.data?.domain_id || ''}
                  style={styles.input}
                  required
                >
                  <option value="" disabled>
                    Select Domain
                  </option>
                  {domains.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="mb_is_active"
                  name="is_active"
                  defaultChecked={mailboxModal.data ? mailboxModal.data.is_active : true}
                />
                <label htmlFor="mb_is_active" style={{ fontSize: '14px', color: '#334155' }}>
                  Is Active
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
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
