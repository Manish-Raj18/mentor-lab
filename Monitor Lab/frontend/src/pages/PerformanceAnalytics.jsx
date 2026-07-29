import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import "../css_files/analytics.css";

const API_BASE = "/api";

const PerformanceAnalytics = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_BASE}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
      } catch {
        setError("Failed to load performance data");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div className="analytics-loading">Loading analytics...</div>;
  if (error) return <div className="analytics-error">{error}</div>;
  if (!user) return <div className="analytics-error">No data available</div>;

  const stats = user.performanceStats || {};
  const activities = user.recentActivity || [];

  const parseScore = (scoreStr) => {
    if (!scoreStr) return { obtained: 0, total: 100 };
    const parts = scoreStr.split('/').map(s => parseInt(s.trim()));
    return { obtained: parts[0] || 0, total: parts[1] || 100 };
  };

  const calculateAccuracy = () => {
    if (activities.length === 0) return 0;
    let totalObtained = 0;
    let totalMax = 0;
    activities.forEach(a => {
      const s = parseScore(a.score);
      totalObtained += s.obtained;
      totalMax += s.total;
    });
    return totalMax > 0 ? Math.round((totalObtained / totalMax) * 100) : 0;
  };

  const getScoreTrend = () => {
    return activities.slice(-10).map((a, idx) => {
      const s = parseScore(a.score);
      const percentage = s.total > 0 ? Math.round((s.obtained / s.total) * 100) : 0;
      return {
        label: `Test ${idx + 1}`,
        value: percentage,
        title: a.title,
        date: a.date,
        score: a.score
      };
    });
  };

  const getSubjectPerformance = () => {
    const subjects = {};
    activities.forEach(a => {
      const title = a.title || 'Unknown';
      let subject = 'General';
      if (title.toLowerCase().includes('bca')) subject = 'BCA';
      else if (title.toLowerCase().includes('bba')) subject = 'BBA';
      else if (title.toLowerCase().includes('biotech')) subject = 'Biotech';

      if (!subjects[subject]) subjects[subject] = { count: 0, totalScore: 0, maxScore: 0 };
      subjects[subject].count++;
      const s = parseScore(a.score);
      subjects[subject].totalScore += s.obtained;
      subjects[subject].maxScore += s.total;
    });

    return Object.entries(subjects).map(([name, data]) => ({
      name,
      tests: data.count,
      percentage: data.maxScore > 0 ? Math.round((data.totalScore / data.maxScore) * 100) : 0
    }));
  };

  const getMonthlyActivity = () => {
    const months = {};
    activities.forEach(a => {
      const date = new Date(a.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!months[monthKey]) months[monthKey] = 0;
      months[monthKey]++;
    });
    return Object.entries(months).slice(-6).map(([month, count]) => ({
      month,
      count
    }));
  };

  const getStreak = () => {
    if (activities.length === 0) return 0;
    const dates = [...new Set(activities.map(a => new Date(a.date).toDateString()))];
    dates.sort((a, b) => new Date(b) - new Date(a));

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const dateStr of dates) {
      const activityDate = new Date(dateStr);
      activityDate.setHours(0, 0, 0, 0);
      const diffDays = Math.floor((currentDate - activityDate) / (1000 * 60 * 60 * 24));

      if (diffDays <= 1) {
        streak++;
        currentDate = activityDate;
      } else {
        break;
      }
    }
    return streak;
  };

  const scoreTrend = getScoreTrend();
  const subjectPerf = getSubjectPerformance();
  const monthlyActivity = getMonthlyActivity();
  const accuracy = calculateAccuracy();
  const streak = getStreak();
  const maxMonthly = Math.max(...monthlyActivity.map(m => m.count), 1);

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h1>Performance Analytics</h1>
        <p>Track your progress and identify areas for improvement</p>
      </div>

      <div className="analytics-tabs">
        <button
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab-btn ${activeTab === 'trends' ? 'active' : ''}`}
          onClick={() => setActiveTab('trends')}
        >
          Score Trends
        </button>
        <button
          className={`tab-btn ${activeTab === 'subjects' ? 'active' : ''}`}
          onClick={() => setActiveTab('subjects')}
        >
          Subject Analysis
        </button>
        <button
          className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Test History
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="analytics-content">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📝</div>
              <div className="stat-info">
                <span className="stat-number">{stats.testsTaken || 0}</span>
                <span className="stat-title">Tests Taken</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🎯</div>
              <div className="stat-info">
                <span className="stat-number">{accuracy}%</span>
                <span className="stat-title">Accuracy</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🏆</div>
              <div className="stat-info">
                <span className="stat-number">{stats.rank || 'N/A'}</span>
                <span className="stat-title">Your Rank</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🔥</div>
              <div className="stat-info">
                <span className="stat-number">{streak}</span>
                <span className="stat-title">Day Streak</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⏱️</div>
              <div className="stat-info">
                <span className="stat-number">{stats.hoursLearnt || '0h'}</span>
                <span className="stat-title">Hours Learnt</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-info">
                <span className="stat-number">{stats.avgScore || '0%'}</span>
                <span className="stat-title">Avg Score</span>
              </div>
            </div>
          </div>

          <div className="overview-grid">
            <div className="overview-card">
              <h3>Recent Score Trend</h3>
              <div className="mini-chart">
                {scoreTrend.length > 0 ? (
                  scoreTrend.map((item, idx) => (
                    <div key={idx} className="mini-bar-container">
                      <div
                        className="mini-bar"
                        style={{ height: `${item.value}%` }}
                        title={`${item.title}: ${item.score}`}
                      ></div>
                      <span className="mini-label">{idx + 1}</span>
                    </div>
                  ))
                ) : (
                  <p className="no-data">No test data yet</p>
                )}
              </div>
            </div>

            <div className="overview-card">
              <h3>Subject Performance</h3>
              <div className="subject-bars">
                {subjectPerf.length > 0 ? (
                  subjectPerf.map((subj, idx) => (
                    <div key={idx} className="subject-bar-item">
                      <div className="subject-info">
                        <span className="subject-name">{subj.name}</span>
                        <span className="subject-pct">{subj.percentage}%</span>
                      </div>
                      <div className="progress-track">
                        <div
                          className="progress-fill"
                          style={{ width: `${subj.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="no-data">No subject data yet</p>
                )}
              </div>
            </div>

            <div className="overview-card">
              <h3>Monthly Activity</h3>
              <div className="monthly-chart">
                {monthlyActivity.length > 0 ? (
                  monthlyActivity.map((item, idx) => (
                    <div key={idx} className="monthly-bar-container">
                      <div
                        className="monthly-bar"
                        style={{ height: `${(item.count / maxMonthly) * 100}%` }}
                        title={`${item.month}: ${item.count} tests`}
                      ></div>
                      <span className="monthly-label">
                        {item.month.split('-')[1]}/{item.month.split('-')[0].slice(2)}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="no-data">No activity data yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'trends' && (
        <div className="analytics-content">
          <div className="trend-card">
            <h3>Score Progression (Last 10 Tests)</h3>
            <div className="trend-chart">
              {scoreTrend.length > 0 ? (
                <div className="bar-chart">
                  <div className="chart-y-axis">
                    <span>100%</span>
                    <span>75%</span>
                    <span>50%</span>
                    <span>25%</span>
                    <span>0%</span>
                  </div>
                  <div className="chart-bars">
                    {scoreTrend.map((item, idx) => (
                      <div key={idx} className="chart-bar-wrapper">
                        <div className="chart-bar" style={{ height: `${item.value}%` }}>
                          <span className="bar-value">{item.value}%</span>
                        </div>
                        <span className="bar-label">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="no-data">Take some tests to see your score trends</p>
              )}
            </div>
          </div>

          <div className="trend-insights">
            <h3>Insights</h3>
            <div className="insight-cards">
              {scoreTrend.length >= 2 && (
                <div className="insight-card">
                  <span className="insight-icon">
                    {scoreTrend[scoreTrend.length - 1].value >= scoreTrend[scoreTrend.length - 2].value ? '📈' : '📉'}
                  </span>
                  <div>
                    <h4>Latest Trend</h4>
                    <p>
                      {scoreTrend[scoreTrend.length - 1].value >= scoreTrend[scoreTrend.length - 2].value
                        ? `Improving! Your score went from ${scoreTrend[scoreTrend.length - 2].value}% to ${scoreTrend[scoreTrend.length - 1].value}%`
                        : `Declining. Your score went from ${scoreTrend[scoreTrend.length - 2].value}% to ${scoreTrend[scoreTrend.length - 1].value}%`
                      }
                    </p>
                  </div>
                </div>
              )}
              <div className="insight-card">
                <span className="insight-icon">💡</span>
                <div>
                  <h4>Recommendation</h4>
                  <p>
                    {accuracy >= 80
                      ? "Excellent performance! Try harder tests to challenge yourself."
                      : accuracy >= 60
                        ? "Good progress! Focus on weak areas to improve further."
                        : "Keep practicing! Review study notes and retake mock tests."
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'subjects' && (
        <div className="analytics-content">
          <div className="subjects-grid">
            {subjectPerf.length > 0 ? (
              subjectPerf.map((subj, idx) => (
                <div key={idx} className="subject-card">
                  <div className="subject-header">
                    <h3>{subj.name}</h3>
                    <span className="subject-grade">
                      {subj.percentage >= 80 ? 'A' : subj.percentage >= 60 ? 'B' : subj.percentage >= 40 ? 'C' : 'D'}
                    </span>
                  </div>
                  <div className="subject-score">
                    <div className="score-circle" style={{ '--score': `${subj.percentage}%` }}>
                      <span>{subj.percentage}%</span>
                    </div>
                  </div>
                  <div className="subject-details">
                    <div className="detail-item">
                      <span>Tests Taken</span>
                      <strong>{subj.tests}</strong>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-subjects">
                <p>No subject data available yet.</p>
                <Link to="/mock-test" className="btn-primary">Take a Mock Test</Link>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="analytics-content">
          <div className="history-card">
            <h3>Complete Test History</h3>
            {activities.length > 0 ? (
              <div className="history-table-wrapper">
                <table className="history-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Test Name</th>
                      <th>Date</th>
                      <th>Score</th>
                      <th>Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...activities].reverse().map((activity, idx) => {
                      const s = parseScore(activity.score);
                      const pct = s.total > 0 ? Math.round((s.obtained / s.total) * 100) : 0;
                      return (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td>{activity.title}</td>
                          <td>{new Date(activity.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}</td>
                          <td className="score-cell">{activity.score}</td>
                          <td>
                            <span className={`pct-badge ${pct >= 80 ? 'high' : pct >= 50 ? 'mid' : 'low'}`}>
                              {pct}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="no-history">
                <p>No test history found.</p>
                <Link to="/mock-test" className="btn-primary">Start Your First Test</Link>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="analytics-actions">
        <Link to="/mock-test" className="btn-primary">Take a Mock Test</Link>
        <Link to="/profile" className="btn-secondary">View Profile</Link>
      </div>
    </div>
  );
};

export default PerformanceAnalytics;
