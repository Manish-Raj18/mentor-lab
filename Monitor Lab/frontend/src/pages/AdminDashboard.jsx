import { useEffect, useState } from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom"
import "../css_files/dashboard.css";
function AdminDashboard() {
  const [stats, setStats] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    getStats();
  }, []);

  const getStats = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/admin/stats"
      );

      setStats(response.data);
    } catch (error) {
      console.log(error);
    }
  };

 return (
  <div className="admin-dashboard">
    <h1>Admin Dashboard</h1>
      <button className="add-test-btn" onClick={() => navigate("/admin/add-mock-test")}
      >
        Add Mock Test
      </button>
    <div className="stats-container">
      <div className="stat-card students">
        <h2>Total Students</h2>
        <p>{stats.totalStudents || 0}</p>
      </div>

      <div className="stat-card courses">
        <h2>Total Courses</h2>
        <p>{stats.totalCourses || 0}</p>
      </div>

      <div className="stat-card tests">
        <h2>Total Mock Tests</h2>
        <p>{stats.totalTests || 0}</p>
      </div>

      <div className="stat-card notes">
        <h2>Total Notes</h2>
        <p>{stats.totalNotes || 0}</p>
      </div>

      <div className="stat-card lectures">
        <h2>Total Lectures</h2>
        <p>{stats.totalLectures || 0}</p>
      </div>
    </div>
  </div>
);
}

export default AdminDashboard;