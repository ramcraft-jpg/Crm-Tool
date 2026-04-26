import { useAuth } from '../context/AuthContext';
import { useState } from "react";

export default function Profile() {
  const { leads, projects, tasks, showToast } = useAuth();

  // Profile state (simulate fetching from user or backend here)
  const [profile, setProfile] = useState({
    firstName: "Arjun",
    lastName: "Kumar",
    email: "admin@nexus.com",
    phone: "+91 98765 43210",
    department: "Sales & Operations",
    jobTitle: "CRM Administrator",
    bio: "Managing customer relationships and driving business growth through Nexus CRM platform.",
    memberSince: "Jan 2024",
    lastLogin: "Today",
    role: "Admin",
  });

  // For controlled inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Simulate save handler (could be replaced with API call)
  const handleSave = (e) => {
    e.preventDefault();
    // Save logic (call API and setProfile with response)
    showToast('Profile saved!', 'success');
    // Here, profile state is already updated with current form values
  };

  return (
    <div style={{
      padding: "30px",
      background: "#f5f8fc",
      minHeight: "100vh",
    }}>
      <div className="section-header">
        <div className="section-title">My Profile</div>
        <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
      </div>

      <div className="profile-grid">
        {/* Left card */}
        <div className="profile-card">
          <div className="profile-avatar">👤</div>
          <div className="profile-name">{profile.firstName} {profile.lastName}</div>
          <div className="profile-role">{profile.jobTitle}</div>
          <div className="profile-stats">
            <div className="profile-stat">
              <div className="profile-stat-num">{leads.length}</div>
              <div className="profile-stat-label">Leads</div>
            </div>
            <div className="profile-stat">
              <div className="profile-stat-num">{projects.length}</div>
              <div className="profile-stat-label">Projects</div>
            </div>
            <div className="profile-stat">
              <div className="profile-stat-num">{tasks.length}</div>
              <div className="profile-stat-label">Tasks</div>
            </div>
          </div>
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              ['Member since', profile.memberSince],
              ['Last login', profile.lastLogin],
              ['Role', profile.role],
            ].map(([k, v]) => (
              <div key={k} style={{ fontSize: 12, color: 'var(--text-3)', display: 'flex', justifyContent: 'space-between' }}>
                <span>{k}</span>
                <span style={k === 'Role' ? { color: 'var(--blue)' } : {}}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right edit card */}
        <div className="card">
          <div className="card-title" style={{ marginBottom: 16 }}>Edit Profile Information</div>
          <form className="form-grid" onSubmit={handleSave}>
            <div className="form-group">
              <label>First Name</label>
              <input
                name="firstName"
                value={profile.firstName}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                name="lastName"
                value={profile.lastName}
                onChange={handleChange}
              />
            </div>
            <div className="form-group full">
              <label>Email Address</label>
              <input
                name="email"
                value={profile.email}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                name="phone"
                value={profile.phone}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Department</label>
              <input
                name="department"
                value={profile.department}
                onChange={handleChange}
              />
            </div>
            <div className="form-group full">
              <label>Job Title</label>
              <input
                name="jobTitle"
                value={profile.jobTitle}
                onChange={handleChange}
              />
            </div>
            <div className="form-group full">
              <label>Bio</label>
              <textarea
                name="bio"
                value={profile.bio}
                onChange={handleChange}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
