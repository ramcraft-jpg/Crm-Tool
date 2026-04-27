import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function Toggle({ defaultOn = false }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button className={`toggle${on ? ' on' : ''}`} onClick={() => setOn(!on)} />
  );
}

export default function Settings() {
  const { setLeads, setProjects, setTasks, setEvents, setActivities, showToast } = useAuth();

  const clearAll = () => {
    if (!window.confirm('This will permanently delete ALL data. Are you sure?')) return;
    setLeads([]); setProjects([]); setTasks([]); setEvents([]); setActivities?.([]);
    showToast('All data cleared', 'danger');
  };

  return (
    <div style={{
      padding: "30px",
      background: "#f5f8fc",
      minHeight: "100vh",
    }}>
      <div className="section-header"><div className="section-title">Settings</div></div>
      <div style={{ maxWidth: 1100 }}>

        {/* Notification box - increased height, keep required padding top/bottom */}
        <div
          className="card settings-section"
          style={{
            minHeight: 260, // Make notification block noticeably taller
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingTop: 32,
            paddingBottom: 32
          }}
        >
          <div className="settings-title">Notifications</div>
          {[
            ['Email Notifications', 'Get email alerts for new leads and tasks', true],
            ['Lead Updates', 'Notify when lead status changes', true],
            ['Task Reminders', 'Remind about upcoming deadlines', false],
            ['Event Reminders', '30 min before scheduled events', true],
          ].map(([label, desc, defaultOn]) => (
            <div className="settings-row" key={label}>
              <div>
                <div className="settings-label">{label}</div>
                <div className="settings-desc">{desc}</div>
              </div>
              <Toggle defaultOn={defaultOn} />
            </div>
          ))}
        </div>

        <div className="card settings-section" style={{ marginTop: 16 }}>
          <div className="settings-title">Display & Appearance</div>
          {[
            ['Compact View', 'Reduce spacing in tables and cards', false],
            ['Show Avatars', 'Display profile pictures in tables', true],
          ].map(([label, desc, defaultOn]) => (
            <div className="settings-row" key={label}>
              <div>
                <div className="settings-label">{label}</div>
                <div className="settings-desc">{desc}</div>
              </div>
              <Toggle defaultOn={defaultOn} />
            </div>
          ))}
        </div>

        <div className="card settings-section" style={{ marginTop: 16 }}>
          <div className="settings-title">Security</div>
          <div className="form-group" style={{ marginBottom: 12 }}>
            <label>Current Password</label>
            <input type="password" placeholder="Enter current password" />
          </div>
          <div className="form-grid">
            <div className="form-group"><label>New Password</label><input type="password" placeholder="New password" /></div>
            <div className="form-group"><label>Confirm Password</label><input type="password" placeholder="Confirm password" /></div>
          </div>
          <div style={{ marginTop: 14 }}>
            <button className="btn btn-primary btn-sm" onClick={() => showToast('Password updated!', 'success')}>Update Password</button>
          </div>
        </div>

        <div className="card" style={{ marginTop: 16, border: '1px solid #fee2e2' }}>
          <div className="settings-title" style={{ color: 'var(--danger)' }}>Danger Zone</div>
          <div className="settings-row">
            <div>
              <div className="settings-label">Export All Data</div>
              <div className="settings-desc">Download your CRM data as CSV</div>
            </div>
            <button className="btn btn-outline btn-sm" onClick={() => showToast('Data exported!', 'success')}>Export</button>
          </div>
          <div className="settings-row">
            <div>
              <div className="settings-label">Clear All Data</div>
              <div className="settings-desc">Permanently delete all records</div>
            </div>
            <button className="btn btn-danger btn-sm" onClick={clearAll}>Clear Data</button>
          </div>
        </div>

      </div>
    </div>
  );
}
