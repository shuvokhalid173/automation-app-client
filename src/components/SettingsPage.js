import React, { useState, useEffect } from 'react';
import { settingsApi } from '../services/api';

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
    color: '#0f172a',
  },
  toggleDesc: {
    fontSize: '13px',
    color: '#64748b',
  },
  switch: {
    position: 'relative',
    display: 'inline-block',
    width: '48px',
    height: '26px',
    flexShrink: 0,
    cursor: 'pointer',
  },
  switchInput: {
    opacity: 0,
    width: 0,
    height: 0,
    position: 'absolute',
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
    backgroundColor: '#2563eb',
  },
  sliderCircle: {
    position: 'absolute',
    content: '""',
    height: '20px',
    width: '20px',
    left: '3px',
    bottom: '3px',
    backgroundColor: 'white',
    transition: '0.2s',
    borderRadius: '50%',
    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
  },
  sliderCircleActive: {
    transform: 'translateX(22px)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
    marginBottom: '24px',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#334155',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  input: {
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    fontSize: '14px',
    backgroundColor: '#ffffff',
    color: '#0f172a',
    outline: 'none',
    transition: 'border-color 0.15s ease',
  },
  helperText: {
    fontSize: '12px',
    color: '#64748b',
    marginTop: '2px',
  },
  btnSave: {
    padding: '12px 28px',
    borderRadius: '8px',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '700',
    border: 'none',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 2px 4px rgba(37, 99, 235, 0.25)',
    transition: 'all 0.15s ease',
  },
  btnSaveDisabled: {
    backgroundColor: '#94a3b8',
    cursor: 'not-allowed',
    boxShadow: 'none',
  },
  toast: {
    padding: '14px 20px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
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
  summaryCard: {
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    padding: '18px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    marginTop: '20px',
  },
  summaryIcon: {
    fontSize: '22px',
  },
  summaryText: {
    fontSize: '14px',
    color: '#334155',
    lineHeight: '1.5',
    margin: 0,
  },
};

export default function SettingsPage() {
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

  // Fetch user automation settings on mount
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
      return `Automation workers will execute Weekly on ${dayLabel} at ${executionTime} (${tzLabel}).`;
    }
    return `Automation workers will execute Monthly on day ${dayOfMonth} at ${executionTime} (${tzLabel}).`;
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Settings</h1>
        <p style={styles.subtitle}>
          Configure your automation worker schedules, sync intervals, and integration preferences.
        </p>
      </header>

      {/* Tab Navigation: Automation Schedule & Source & Destination Settings */}
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
          style={{ ...styles.tabBtn, ...(activeTab === 'source-destination' ? styles.tabBtnActive : {}) }}
          onClick={() => setActiveTab('source-destination')}
        >
          <span>🔀</span>
          <span>Source & Destination Settings</span>
        </button>
      </div>

      {/* Tab 1: Automation Scheduling System */}
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
                      Main switch to activate or pause all background worker runs.
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
                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>Timezone</label>
                    <select
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
                    <span style={styles.helperText}>Used to calculate scheduled cron runtime.</span>
                  </div>

                  {/* Frequency */}
                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>Frequency</label>
                    <select
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value)}
                      style={styles.input}
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                    <span style={styles.helperText}>How often background automation runs.</span>
                  </div>

                  {/* Day of Month (Monthly only) */}
                  {frequency === 'monthly' && (
                    <div style={styles.fieldGroup}>
                      <label style={styles.label}>Day of the Month</label>
                      <input
                        type="number"
                        min="1"
                        max="31"
                        value={dayOfMonth}
                        onChange={(e) => setDayOfMonth(Math.max(1, Math.min(31, parseInt(e.target.value, 10) || 1)))}
                        style={styles.input}
                        required
                      />
                      <span style={styles.helperText}>Executes on this calendar day each month (1-31).</span>
                    </div>
                  )}

                  {/* Day of Week (Weekly only) */}
                  {frequency === 'weekly' && (
                    <div style={styles.fieldGroup}>
                      <label style={styles.label}>Day of the Week</label>
                      <select
                        value={dayOfWeek}
                        onChange={(e) => setDayOfWeek(Number(e.target.value))}
                        style={styles.input}
                      >
                        {daysOfWeek.map((d) => (
                          <option key={d.value} value={d.value}>
                            {d.label}
                          </option>
                        ))}
                      </select>
                      <span style={styles.helperText}>Executes once every week on this day.</span>
                    </div>
                  )}

                  {/* Execution Time */}
                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>Execution Time</label>
                    <input
                      type="time"
                      value={executionTime}
                      onChange={(e) => setExecutionTime(e.target.value)}
                      style={styles.input}
                      required
                    />
                    <span style={styles.helperText}>Scheduled start time in 24-hour format (HH:MM).</span>
                  </div>
                </div>

                {/* Summary Box */}
                <div style={styles.summaryCard}>
                  <span style={styles.summaryIcon}>{isActive ? '🚀' : '⏸️'}</span>
                  <p style={styles.summaryText}>{getSummaryText()}</p>
                </div>

                {/* Submit Action */}
                <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="submit"
                    disabled={savingSchedule}
                    style={{
                      ...styles.btnSave,
                      ...(savingSchedule ? styles.btnSaveDisabled : {}),
                    }}
                  >
                    <span>💾</span>
                    <span>{savingSchedule ? 'Saving Preferences...' : 'Save Automation Schedule'}</span>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Tab 2: Source & Destination Settings (Placeholder / Coming Soon) */}
      {activeTab === 'source-destination' && (
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>Source & Destination Settings</h2>
            <p style={styles.cardSubtitle}>
              Configure storage source pathways, destination cloud endpoints, and pipeline sync rules.
            </p>
          </div>

          <div
            style={{
              padding: '64px 24px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f8fafc',
              borderRadius: '12px',
              border: '2px dashed #cbd5e1',
              marginTop: '12px',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#eff6ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                marginBottom: '16px',
                boxShadow: '0 2px 6px rgba(37, 99, 235, 0.15)',
              }}
            >
              🔀
            </div>

            <span
              style={{
                display: 'inline-block',
                padding: '4px 12px',
                borderRadius: '9999px',
                backgroundColor: '#dbeafe',
                color: '#1d4ed8',
                fontSize: '12px',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '14px',
              }}
            >
              Coming Soon...
            </span>

            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: '0 0 8px 0' }}>
              Source & Destination Pipelines Under Construction
            </h3>

            <p style={{ maxWidth: '480px', color: '#64748b', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
              Automated source-to-destination routing rules and storage mappings are coming in an upcoming release. Your schedule settings configured in the Automation Schedule tab will apply to all connected destinations once active.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
