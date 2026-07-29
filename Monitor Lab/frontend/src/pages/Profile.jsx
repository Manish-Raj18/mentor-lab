import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../css_files/profile.css";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
      } catch (err) {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

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
                    <div className="activity-score">
                      {activity.score}
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