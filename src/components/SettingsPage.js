import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  // Source & Destination Specific Styles
  domainGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
    gap: '14px',
    marginBottom: '24px',
  },
  domainCard: {
    padding: '16px 18px',
    borderRadius: '12px',
    border: '2px solid #e2e8f0',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.18s ease',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  domainCardSelected: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.12)',
  },
  typeOptionCard: {
    flex: 1,
    padding: '16px',
    borderRadius: '10px',
    border: '2px solid #e2e8f0',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
  },
  typeOptionCardSelected: {
    borderColor: '#2563eb',
    backgroundColor: '#f0f7ff',
  },
};

export default function SettingsPage() {
  const navigate = useNavigate();
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

  // Source & Destination Routing State
  const [routingList, setRoutingList] = useState([]);
  const [selectedDomainId, setSelectedDomainId] = useState(null);
  const [loadingRouting, setLoadingRouting] = useState(true);
  const [savingRouting, setSavingRouting] = useState(false);
  const [routingMessage, setRoutingMessage] = useState(null);

  // Fetch settings on mount
  useEffect(() => {
    async function loadAllSettings() {
      // 1. Load Automation Schedule
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

      // 2. Load Domain Routing
      try {
        setLoadingRouting(true);
        const rRes = await settingsApi.getRouting();
        if (rRes.data) {
          setRoutingList(rRes.data);
          if (rRes.data.length > 0) {
            setSelectedDomainId(rRes.data[0].domainId);
          }
        }
      } catch (err) {
        console.error('Failed to load domain routing settings:', err);
        setRoutingMessage({ type: 'error', text: 'Failed to load domain routing: ' + err.message });
      } finally {
        setLoadingRouting(false);
      }
    }

    loadAllSettings();
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

  // Helper text summary for schedule
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

  // Currently selected domain routing object
  const selectedDomain = routingList.find((d) => d.domainId === selectedDomainId) || routingList[0] || null;

  // Handle routing field update in local state
  const handleRoutingFieldChange = (field, value) => {
    if (!selectedDomain) return;
    setRoutingList((prev) =>
      prev.map((item) =>
        item.domainId === selectedDomain.domainId ? { ...item, [field]: value } : item
      )
    );
  };

  // Handle Save Domain Routing
  const handleSaveRouting = async (e) => {
    e.preventDefault();
    if (!selectedDomain) return;

    setSavingRouting(true);
    setRoutingMessage(null);

    // Validate email format if type === 'email'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (selectedDomain.type === 'email') {
      if (selectedDomain.ccEmail && !emailRegex.test(selectedDomain.ccEmail)) {
        setRoutingMessage({ type: 'error', text: 'From / CC Reference Email must be a valid email address.' });
        setSavingRouting(false);
        return;
      }
      if (selectedDomain.destinationEmail && !emailRegex.test(selectedDomain.destinationEmail)) {
        setRoutingMessage({ type: 'error', text: 'Destination Email must be a valid email address.' });
        setSavingRouting(false);
        return;
      }
    }

    try {
      const res = await settingsApi.updateRouting({
        domainId: selectedDomain.domainId,
        type: selectedDomain.type,
        ccEmail: selectedDomain.ccEmail,
        destinationEmail: selectedDomain.destinationEmail,
        destinationApiUrl: selectedDomain.destinationApiUrl,
      });

      if (res.data) {
        setRoutingList((prev) =>
          prev.map((item) => (item.domainId === selectedDomain.domainId ? res.data : item))
        );
      }

      setRoutingMessage({
        type: 'success',
        text: `Routing settings for ${selectedDomain.domainName} saved successfully!`,
      });
      setTimeout(() => setRoutingMessage(null), 5000);
    } catch (err) {
      console.error('Failed to save routing settings:', err);
      setRoutingMessage({ type: 'error', text: err.message || 'Failed to save routing settings.' });
    } finally {
      setSavingRouting(false);
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

      {/* Tab 2: Source & Destination Settings */}
      {activeTab === 'source-destination' && (
        <div>
          {routingMessage && (
            <div
              style={{
                ...styles.toast,
                ...(routingMessage.type === 'success' ? styles.toastSuccess : styles.toastError),
              }}
            >
              <span>{routingMessage.type === 'success' ? '✓' : '⚠️'}</span>
              <span>{routingMessage.text}</span>
            </div>
          )}

          {loadingRouting ? (
            <div style={{ ...styles.card, textAlign: 'center', padding: '48px', color: '#64748b' }}>
              Loading platform domains and routing settings...
            </div>
          ) : routingList.length === 0 ? (
            <div style={{ ...styles.card, textAlign: 'center', padding: '56px 24px' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: '#eff6ff',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  marginBottom: '16px',
                  color: '#2563eb',
                }}
              >
                ⚡
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
                No Connected Platforms Found
              </h3>
              <p style={{ maxWidth: '480px', margin: '0 auto 20px auto', color: '#64748b', fontSize: '14px', lineHeight: 1.5 }}>
                You have not connected any platform integrations yet. Connect your accounts on the Platforms page to configure their invoice delivery destinations.
              </p>
              <button
                type="button"
                style={styles.btnSave}
                onClick={() => navigate('/platforms')}
              >
                <span>⚡</span>
                <span>Go to Platforms</span>
              </button>
            </div>
          ) : (
            <>
              {/* Section 1: Connected Platform Domains */}
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <h2 style={styles.cardTitle}>1. Connected Platform Domains</h2>
                  <p style={styles.cardSubtitle}>
                    Select any of your connected platforms below to configure where its downloaded documents and invoices will be delivered.
                  </p>
                </div>

                <div style={styles.domainGrid}>
                  {routingList.map((domain) => {
                    const isSelected = selectedDomain && selectedDomain.domainId === domain.domainId;
                    const hasDestination =
                      domain.type === 'email' ? Boolean(domain.destinationEmail) : Boolean(domain.destinationApiUrl);

                    return (
                      <div
                        key={domain.domainId}
                        onClick={() => {
                          setSelectedDomainId(domain.domainId);
                          setRoutingMessage(null);
                        }}
                        style={{
                          ...styles.domainCard,
                          ...(isSelected ? styles.domainCardSelected : {}),
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>
                            {domain.domainName}
                          </span>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '2px 8px',
                              borderRadius: '12px',
                              fontSize: '11px',
                              fontWeight: '700',
                              backgroundColor: '#dcfce7',
                              color: '#15803d',
                            }}
                          >
                            <span
                              style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                backgroundColor: '#22c55e',
                              }}
                            />
                            Connected
                          </span>
                        </div>

                        <span style={{ fontSize: '12px', color: '#64748b', fontFamily: 'monospace' }}>
                          {domain.domainUrl || 'host unavailable'}
                        </span>

                        <div style={{ marginTop: 'auto', paddingTop: '8px', borderTop: '1px solid #f1f5f9' }}>
                          {hasDestination ? (
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontSize: '11px',
                                fontWeight: '600',
                                color: '#2563eb',
                              }}
                            >
                              <span>{domain.type === 'email' ? '📧' : '🌐'}</span>
                              <span>{domain.type === 'email' ? 'Email Configured' : 'API Configured'}</span>
                            </span>
                          ) : (
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '11px',
                                fontWeight: '500',
                                color: '#94a3b8',
                              }}
                            >
                              <span>⚠️</span>
                              <span>No Destination</span>
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Section 2: Destination Configuration for Selected Domain */}
              {selectedDomain && (
                <form onSubmit={handleSaveRouting}>
                  <div style={styles.card}>
                    <div style={styles.cardHeader}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                        <div>
                          <h2 style={styles.cardTitle}>
                            2. Destination Configuration for{' '}
                            <span style={{ color: '#2563eb' }}>{selectedDomain.domainName}</span>
                          </h2>
                          <p style={styles.cardSubtitle}>
                            Configure delivery method, recipient email addresses, and CC audit copies for documents fetched from this source.
                          </p>
                        </div>
                        <span
                          style={{
                            padding: '4px 10px',
                            borderRadius: '6px',
                            backgroundColor: selectedDomain.isConnected ? '#ecfdf5' : '#f8fafc',
                            color: selectedDomain.isConnected ? '#065f46' : '#64748b',
                            border: `1px solid ${selectedDomain.isConnected ? '#a7f3d0' : '#e2e8f0'}`,
                            fontSize: '12px',
                            fontWeight: '600',
                          }}
                        >
                          Source Status: {selectedDomain.isConnected ? 'Connected & Active' : 'Not Connected'}
                        </span>
                      </div>
                    </div>

                    {/* Destination Type Selector */}
                    <div style={{ marginBottom: '24px' }}>
                      <label style={{ ...styles.label, marginBottom: '10px', display: 'block' }}>
                        Destination Delivery Type
                      </label>
                      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                        {/* Option 1: Email Delivery */}
                        <div
                          onClick={() => handleRoutingFieldChange('type', 'email')}
                          style={{
                            ...styles.typeOptionCard,
                            ...(selectedDomain.type === 'email' ? styles.typeOptionCardSelected : {}),
                          }}
                        >
                          <input
                            type="radio"
                            name="destination_type"
                            checked={selectedDomain.type === 'email'}
                            onChange={() => handleRoutingFieldChange('type', 'email')}
                            style={{ marginTop: '2px', accentColor: '#2563eb' }}
                          />
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>
                                📧 Email Delivery
                              </span>
                            </div>
                            <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0 0', lineHeight: 1.4 }}>
                              Forward fetched invoices directly as PDF attachments to an accounting or inbox address.
                            </p>
                          </div>
                        </div>

                        {/* Option 2: API Upload */}
                        <div
                          onClick={() => handleRoutingFieldChange('type', 'api')}
                          style={{
                            ...styles.typeOptionCard,
                            ...(selectedDomain.type === 'api' ? styles.typeOptionCardSelected : {}),
                          }}
                        >
                          <input
                            type="radio"
                            name="destination_type"
                            checked={selectedDomain.type === 'api'}
                            onChange={() => handleRoutingFieldChange('type', 'api')}
                            style={{ marginTop: '2px', accentColor: '#2563eb' }}
                          />
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>
                                🌐 API Upload
                              </span>
                              <span
                                style={{
                                  padding: '2px 8px',
                                  borderRadius: '4px',
                                  backgroundColor: '#dbeafe',
                                  color: '#1d4ed8',
                                  fontSize: '11px',
                                  fontWeight: '700',
                                }}
                              >
                                Preview
                              </span>
                            </div>
                            <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0 0', lineHeight: 1.4 }}>
                              Post document metadata and binary payloads to an external cloud or document REST endpoint.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Conditional Fields based on Type */}
                    {selectedDomain.type === 'email' ? (
                      <div style={styles.grid}>
                        {/* Destination Email */}
                        <div style={styles.fieldGroup}>
                          <label style={styles.label}>Destination Email</label>
                          <input
                            type="email"
                            value={selectedDomain.destinationEmail || ''}
                            onChange={(e) => handleRoutingFieldChange('destinationEmail', e.target.value)}
                            placeholder="e.g. f9qrq+ausgangsrechnungen@portal-bereich.de"
                            style={styles.input}
                          />
                          <span style={styles.helperText}>
                            Recipient address where documents from this source will be sent.
                          </span>
                        </div>

                        {/* CC Reference Email */}
                        <div style={styles.fieldGroup}>
                          <label style={styles.label}>From / CC Reference Email</label>
                          <input
                            type="email"
                            value={selectedDomain.ccEmail || ''}
                            onChange={(e) => handleRoutingFieldChange('ccEmail', e.target.value)}
                            placeholder="e.g. client@company.de"
                            style={styles.input}
                          />
                          <span style={styles.helperText}>
                            Placed in CC so you receive a copy of every uploaded invoice.
                          </span>
                        </div>
                      </div>
                    ) : (
                      /* API Upload Type */
                      <div style={{ marginBottom: '24px' }}>
                        <div style={styles.fieldGroup}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                            <label style={styles.label}>Destination API URL</label>
                            <span
                              style={{
                                padding: '2px 8px',
                                borderRadius: '4px',
                                backgroundColor: '#fef3c7',
                                color: '#92400e',
                                fontSize: '10px',
                                fontWeight: '700',
                                textTransform: 'uppercase',
                              }}
                            >
                              Future Release
                            </span>
                          </div>
                          <input
                            type="url"
                            value={selectedDomain.destinationApiUrl || ''}
                            onChange={(e) => handleRoutingFieldChange('destinationApiUrl', e.target.value)}
                            placeholder="https://api.example.com/v1/upload"
                            style={styles.input}
                          />
                          <span style={styles.helperText}>
                            Automated REST webhook or ingest endpoint. Currently in development preview.
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Submit Button */}
                    <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
                      <button
                        type="submit"
                        disabled={savingRouting}
                        style={{
                          ...styles.btnSave,
                          ...(savingRouting ? styles.btnSaveDisabled : {}),
                        }}
                      >
                        <span>💾</span>
                        <span>
                          {savingRouting
                            ? `Saving ${selectedDomain.domainName}...`
                            : `Save Routing Settings for ${selectedDomain.domainName}`}
                        </span>
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
