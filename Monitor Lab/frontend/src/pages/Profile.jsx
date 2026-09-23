import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import "../css_files/profile.css";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [certCount, setCertCount] = useState(0);
  const [college, setCollege] = useState("");
  const [editingCollege, setEditingCollege] = useState(false);
  const [collegeSaved, setCollegeSaved] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
        setCollege(response.data.college || "");
      } catch (err) {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    const fetchCerts = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/certificate/mine", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCertCount((response.data || []).length);
      } catch {
        setCertCount(0);
      }
    };

    fetchProfile();
    fetchCerts();
  }, []);

  const saveCollege = async () => {
    if (editingCollege && college.trim() !== (user.college || "")) {
      try {
        const token = localStorage.getItem("token");
        await axios.put("/api/auth/profile", { college: college.trim() }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCollegeSaved(true);
        setTimeout(() => setCollegeSaved(false), 2500);
      } catch {
        alert("Failed to save college. Try again.");
      }
    }
    setEditingCollege(false);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const getInitials = (name) => {
    return name ? name.split(" ").map(n => n[0]).join("").toUpperCase() : "U";
  };

  return (
    <div className="profile-container">
      {/* Header Section */}
      <div className="profile-header">
        <div className="profile-avatar">
          {getInitials(user.name)}
        </div>
        <div className="profile-info">
          <span className="profile-role">{user.isAdmin ? "ADMINISTRATOR" : "STUDENT"}</span>
          <h1>{user.name}</h1>
          <div className="profile-meta">
            <span>📧 {user.email}</span>
            <span>🆔 {user.studentId || "N/A"}</span>
            <span>🏫 {user.college || "College not set"}</span>
          </div>
          <div className="profile-college-edit">
            {editingCollege ? (
              <div className="college-edit-row">
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  placeholder="Enter your college name"
                  className="college-input"
                />
                <button className="college-save-btn" onClick={saveCollege}>Save</button>
                <button className="college-cancel-btn" onClick={() => { setCollege(user.college || ""); setEditingCollege(false); }}>Cancel</button>
              </div>
            ) : (
              <button className="college-edit-btn" onClick={() => setEditingCollege(true)}>✏️ {user.college ? "Edit College" : "Add College"}</button>
            )}
            {collegeSaved && <span className="college-saved-msg">✅ College saved — certificate me update hoga</span>}
          </div>
        </div>
      </div>

      {/* Grid Content */}
      <div className="profile-grid">
        {/* Left Column: Stats */}
        <aside className="profile-sidebar">
          <div className="profile-card">
            <h3>📊 Performance Overview</h3>
            <div className="stat-grid">
                <div className="stat-item">
                  <span className="stat-value">{user.performanceStats.testsTaken}</span>
                  <span className="stat-label">Tests Taken</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{user.performanceStats.avgScore}</span>
                  <span className="stat-label">Avg. Score</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{user.performanceStats.rank}</span>
                  <span className="stat-label">Rank</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{user.performanceStats.hoursLearnt}</span>
                  <span className="stat-label">Hours Learnt</span>
                </div>
            </div>
          </div>
          <div className="profile-card">
            <h3>🎓 Certificates</h3>
            <div className="stat-grid">
                <div className="stat-item">
                  <span className="stat-value">{certCount}</span>
                  <span className="stat-label">Earned</span>
                </div>
            </div>
            <Link to="/certificates" className="cert-link">View My Certificates →</Link>
          </div>
        </aside>

        {/* Right Column: Recent Activity */}
        <main className="profile-main">
          <div className="profile-card">
            <h3>🕒 Recent Test Activity</h3>
            <div className="activity-list">
              {user.recentActivity && user.recentActivity.length > 0 ? (
                user.recentActivity.map((activity, index) => (
                  <div key={index} className="activity-item">
                    <div className="activity-info">
                      <h4>{activity.title}</h4>
                      <p>{new Date(activity.date).toLocaleDateString()}</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                      <div className="activity-score">
                        {activity.score}
                      </div>
                      {activity.resultId && (
                        <button
                          className="activity-review-btn"
                          onClick={() => navigate(`/test-review/${activity.resultId}`)}
                        >
                          Review
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ textAlign: 'center', padding: '2rem', opacity: 0.5 }}>No recent activity found.</p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Profile;