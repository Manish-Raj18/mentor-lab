import { useEffect, useState } from "react";
import axios from "axios";
import "../css_files/dashboard.css";

const API_BASE = "http://localhost:5000/api";

function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [tests, setTests] = useState([]);
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [uploadMode, setUploadMode] = useState("pdf");
  const [formData, setFormData] = useState({ title: "", subject: "", topic: "", duration: 60 });
  const [pdfFile, setPdfFile] = useState(null);
  const [manualQuestions, setManualQuestions] = useState([{ question: "", options: ["", "", "", ""], correctAnswer: "" }]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    getStats();
    fetchTests();
    fetchStudents();
  }, []);

  const getStats = async () => {
    try {
      const response = await axios.get(`${API_BASE}/admin/stats`);
      setStats(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTests = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE}/mocktest`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTests(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${API_BASE}/admin/students`);
      setStudents(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUploadPDF = async (e) => {
    e.preventDefault();
    if (!pdfFile || !formData.title) {
      alert("Please provide a title and select a PDF file");
      return;
    }
    setUploading(true);
    try {
      const token = localStorage.getItem("token");
      const fd = new FormData();
      fd.append("pdf", pdfFile);
      fd.append("title", formData.title);
      fd.append("subject", formData.subject);
      fd.append("topic", formData.topic);
      fd.append("duration", formData.duration);

      await axios.post(`${API_BASE}/mocktest/upload-pdf`, fd, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
      });
      alert("Mock test uploaded successfully!");
      setShowForm(false);
      setFormData({ title: "", subject: "", topic: "", duration: 60 });
      setPdfFile(null);
      fetchTests();
      getStats();
    } catch (err) {
      alert(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleAddManual = async (e) => {
    e.preventDefault();
    if (!formData.title) {
      alert("Please provide a test title");
      return;
    }
    const validQuestions = manualQuestions.filter(q => q.question.trim() && q.options.every(o => o.trim()));
    if (validQuestions.length === 0) {
      alert("Please add at least one valid question with all 4 options");
      return;
    }
    setUploading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API_BASE}/mocktest/add`, {
        title: formData.title,
        subject: formData.subject,
        topic: formData.topic,
        duration: formData.duration,
        questions: validQuestions
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Mock test created successfully!");
      setShowForm(false);
      setFormData({ title: "", subject: "", topic: "", duration: 60 });
      setManualQuestions([{ question: "", options: ["", "", "", ""], correctAnswer: "" }]);
      fetchTests();
      getStats();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create test");
    } finally {
      setUploading(false);
    }
  };

  const addQuestion = () => {
    setManualQuestions(prev => [...prev, { question: "", options: ["", "", "", ""], correctAnswer: "" }]);
  };

  const updateQuestion = (qIdx, field, value) => {
    setManualQuestions(prev => {
      const updated = [...prev];
      updated[qIdx] = { ...updated[qIdx], [field]: value };
      return updated;
    });
  };

  const updateOption = (qIdx, oIdx, value) => {
    setManualQuestions(prev => {
      const updated = [...prev];
      const options = [...updated[qIdx].options];
      options[oIdx] = value;
      updated[qIdx] = { ...updated[qIdx], options };
      return updated;
    });
  };

  const removeQuestion = (qIdx) => {
    setManualQuestions(prev => prev.filter((_, i) => i !== qIdx));
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      <div className="stats-container">
        <div className="stat-card students">
          <h2>Student Logins</h2>
          <p>{stats.totalStudents || 0}</p>
        </div>
        <div className="stat-card courses">
          <h2>Total Courses</h2>
          <p>{stats.totalCourses || 0}</p>
        </div>
        <div className="stat-card notes">
          <h2>Total Notes</h2>
          <p>{stats.totalNotes || 0}</p>
        </div>
        <div className="stat-card lectures">
          <h2>Total Lectures</h2>
          <p>{stats.totalLectures || 0}</p>
        </div>
        <div className="stat-card tests">
          <h2>Total Mock Tests</h2>
          <p>{stats.totalTests || 0}</p>
        </div>
      </div>

      <div style={{ marginTop: "40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ color: "var(--text-color)", margin: 0 }}>Mock Test Management</h2>
          <button className="add-test-btn" onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "+ Add New Mock Test"}
          </button>
        </div>

        {showForm && (
          <div style={{ background: "var(--card-bg)", border: "1px solid var(--border-color)", borderRadius: "12px", padding: "1.5rem", marginBottom: "2rem" }}>
            <div style={{ display: "flex", gap: "1rem", marginBottom: "1.2rem" }}>
              <button
                onClick={() => setUploadMode("pdf")}
                style={{
                  padding: "0.5rem 1.2rem", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: "bold",
                  background: uploadMode === "pdf" ? "var(--accent-color)" : "var(--secondary-bg)",
                  color: uploadMode === "pdf" ? "var(--hero-text)" : "var(--text-color)"
                }}
              >
                Upload PDF
              </button>
              <button
                onClick={() => setUploadMode("manual")}
                style={{
                  padding: "0.5rem 1.2rem", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: "bold",
                  background: uploadMode === "manual" ? "var(--accent-color)" : "var(--secondary-bg)",
                  color: uploadMode === "manual" ? "var(--hero-text)" : "var(--text-color)"
                }}
              >
                Add Manually
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "bold", color: "var(--text-color)", marginBottom: "0.3rem" }}>Test Title *</label>
                <input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Biotech Midterm Quiz"
                  style={{ width: "100%", padding: "0.6rem", borderRadius: "6px", border: "1px solid var(--border-color)", background: "var(--input-bg)", color: "var(--input-text)", fontSize: "0.9rem" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "bold", color: "var(--text-color)", marginBottom: "0.3rem" }}>Subject</label>
                <input value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Biotechnology"
                  style={{ width: "100%", padding: "0.6rem", borderRadius: "6px", border: "1px solid var(--border-color)", background: "var(--input-bg)", color: "var(--input-text)", fontSize: "0.9rem" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "bold", color: "var(--text-color)", marginBottom: "0.3rem" }}>Topic</label>
                <input value={formData.topic} onChange={e => setFormData({ ...formData, topic: e.target.value })}
                  placeholder="e.g. Genetics"
                  style={{ width: "100%", padding: "0.6rem", borderRadius: "6px", border: "1px solid var(--border-color)", background: "var(--input-bg)", color: "var(--input-text)", fontSize: "0.9rem" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "bold", color: "var(--text-color)", marginBottom: "0.3rem" }}>Duration (minutes)</label>
                <input type="number" value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })}
                  style={{ width: "100%", padding: "0.6rem", borderRadius: "6px", border: "1px solid var(--border-color)", background: "var(--input-bg)", color: "var(--input-text)", fontSize: "0.9rem" }} />
              </div>
            </div>

            {uploadMode === "pdf" ? (
              <form onSubmit={handleUploadPDF}>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "bold", color: "var(--text-color)", marginBottom: "0.3rem" }}>Select PDF File *</label>
                <input type="file" accept=".pdf" onChange={e => setPdfFile(e.target.files[0])}
                  style={{ marginBottom: "1rem", color: "var(--text-color)" }} />
                <p style={{ fontSize: "0.75rem", color: "var(--text-color)", opacity: 0.6, marginBottom: "1rem" }}>
                  PDF should have questions numbered like "1. Question text" with options "A) Option" and answers "Ans: A"
                </p>
                <button type="submit" disabled={uploading}
                  style={{ padding: "0.7rem 1.5rem", background: "var(--accent-color)", color: "var(--hero-text)", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", fontSize: "0.9rem" }}>
                  {uploading ? "Uploading..." : "Upload & Create Test"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleAddManual}>
                {manualQuestions.map((q, qIdx) => (
                  <div key={qIdx} style={{ border: "1px solid var(--border-color)", borderRadius: "8px", padding: "1rem", marginBottom: "1rem", background: "var(--secondary-bg)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                      <strong style={{ color: "var(--text-color)", fontSize: "0.85rem" }}>Question {qIdx + 1}</strong>
                      {manualQuestions.length > 1 && (
                        <button type="button" onClick={() => removeQuestion(qIdx)}
                          style={{ background: "#dc3545", color: "white", border: "none", borderRadius: "4px", padding: "0.2rem 0.6rem", cursor: "pointer", fontSize: "0.75rem" }}>
                          Remove
                        </button>
                      )}
                    </div>
                    <input value={q.question} onChange={e => updateQuestion(qIdx, "question", e.target.value)}
                      placeholder="Enter question text"
                      style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid var(--border-color)", background: "var(--input-bg)", color: "var(--input-text)", fontSize: "0.85rem", marginBottom: "0.5rem" }} />
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBottom: "0.5rem" }}>
                      {q.options.map((opt, oIdx) => (
                        <input key={oIdx} value={opt} onChange={e => updateOption(qIdx, oIdx, e.target.value)}
                          placeholder={`Option ${String.fromCharCode(65 + oIdx)}`}
                          style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid var(--border-color)", background: "var(--input-bg)", color: "var(--input-text)", fontSize: "0.85rem" }} />
                      ))}
                    </div>
                    <select value={q.correctAnswer} onChange={e => updateQuestion(qIdx, "correctAnswer", e.target.value)}
                      style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid var(--border-color)", background: "var(--input-bg)", color: "var(--input-text)", fontSize: "0.85rem" }}>
                      <option value="">Select Correct Answer</option>
                      {q.options.filter(o => o.trim()).map((opt, oIdx) => (
                        <option key={oIdx} value={opt}>{String.fromCharCode(65 + oIdx)}) {opt}</option>
                      ))}
                    </select>
                  </div>
                ))}
                <button type="button" onClick={addQuestion}
                  style={{ padding: "0.5rem 1rem", background: "var(--secondary-bg)", color: "var(--text-color)", border: "1px dashed var(--border-color)", borderRadius: "6px", cursor: "pointer", marginBottom: "1rem", fontSize: "0.85rem" }}>
                  + Add Another Question
                </button>
                <div>
                  <button type="submit" disabled={uploading}
                    style={{ padding: "0.7rem 1.5rem", background: "var(--accent-color)", color: "var(--hero-text)", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", fontSize: "0.9rem" }}>
                    {uploading ? "Creating..." : "Create Mock Test"}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        <div style={{ background: "var(--card-bg)", border: "1px solid var(--border-color)", borderRadius: "12px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--secondary-bg)", borderBottom: "1px solid var(--border-color)" }}>
                <th style={{ padding: "0.8rem 1rem", textAlign: "left", color: "var(--text-color)", fontSize: "0.8rem", textTransform: "uppercase" }}>Title</th>
                <th style={{ padding: "0.8rem 1rem", textAlign: "left", color: "var(--text-color)", fontSize: "0.8rem", textTransform: "uppercase" }}>Subject</th>
                <th style={{ padding: "0.8rem 1rem", textAlign: "left", color: "var(--text-color)", fontSize: "0.8rem", textTransform: "uppercase" }}>Topic</th>
                <th style={{ padding: "0.8rem 1rem", textAlign: "center", color: "var(--text-color)", fontSize: "0.8rem", textTransform: "uppercase" }}>Questions</th>
                <th style={{ padding: "0.8rem 1rem", textAlign: "center", color: "var(--text-color)", fontSize: "0.8rem", textTransform: "uppercase" }}>Duration</th>
                <th style={{ padding: "0.8rem 1rem", textAlign: "center", color: "var(--text-color)", fontSize: "0.8rem", textTransform: "uppercase" }}>Created</th>
              </tr>
            </thead>
            <tbody>
              {tests.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: "2rem", textAlign: "center", color: "var(--text-color)", opacity: 0.5 }}>
                    No mock tests found. Click "Add New Mock Test" to create one.
                  </td>
                </tr>
              ) : (
                tests.map((test) => (
                  <tr key={test._id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                    <td style={{ padding: "0.8rem 1rem", color: "var(--text-color)", fontWeight: "bold" }}>{test.title}</td>
                    <td style={{ padding: "0.8rem 1rem", color: "var(--text-color)" }}>{test.subject || "-"}</td>
                    <td style={{ padding: "0.8rem 1rem", color: "var(--text-color)" }}>{test.topic || "-"}</td>
                    <td style={{ padding: "0.8rem 1rem", textAlign: "center", color: "var(--text-color)" }}>{test.questions.length}</td>
                    <td style={{ padding: "0.8rem 1rem", textAlign: "center", color: "var(--text-color)" }}>{test.duration || 60} min</td>
                    <td style={{ padding: "0.8rem 1rem", textAlign: "center", color: "var(--text-color)", fontSize: "0.8rem" }}>
                      {new Date(test.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ marginTop: "40px" }}>
        <h2 style={{ color: "var(--text-color)", marginBottom: "20px" }}>Student Details</h2>
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--border-color)", borderRadius: "12px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--secondary-bg)", borderBottom: "1px solid var(--border-color)" }}>
                <th style={{ padding: "0.8rem 1rem", textAlign: "left", color: "var(--text-color)", fontSize: "0.8rem", textTransform: "uppercase" }}>Full Name</th>
                <th style={{ padding: "0.8rem 1rem", textAlign: "left", color: "var(--text-color)", fontSize: "0.8rem", textTransform: "uppercase" }}>Email</th>
                <th style={{ padding: "0.8rem 1rem", textAlign: "left", color: "var(--text-color)", fontSize: "0.8rem", textTransform: "uppercase" }}>Student ID</th>
                <th style={{ padding: "0.8rem 1rem", textAlign: "center", color: "var(--text-color)", fontSize: "0.8rem", textTransform: "uppercase" }}>Joined</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ padding: "2rem", textAlign: "center", color: "var(--text-color)", opacity: 0.5 }}>
                    No students registered yet.
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student._id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                    <td style={{ padding: "0.8rem 1rem", color: "var(--text-color)", fontWeight: "bold" }}>{student.name}</td>
                    <td style={{ padding: "0.8rem 1rem", color: "var(--text-color)" }}>{student.email}</td>
                    <td style={{ padding: "0.8rem 1rem", color: "var(--text-color)" }}>{student.studentId || "-"}</td>
                    <td style={{ padding: "0.8rem 1rem", textAlign: "center", color: "var(--text-color)", fontSize: "0.8rem" }}>
                      {new Date(student.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;