import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area,
  Legend
} from "recharts";
import "../css_files/dashboard.css";

const API_BASE = "http://localhost:5000/api";

const COLORS = ["#3498db", "#2ecc71", "#f39c12", "#9b59b6", "#e74c3c", "#1abc9c"];

const navItems = [
  { key: "overview", label: "Overview", icon: "📊" },
  { key: "mocktests", label: "Mock Tests", icon: "📝" },
  { key: "students", label: "Students", icon: "👥" },
  { key: "uploadnotes", label: "Upload Notes", icon: "📄" },
];

const coursesData = {
  BCA: ["C Programming", "C++ Programming", "Java Programming", "Python Programming", "HTML & Web Design", "JavaScript", "CSS Styling", "Database Management System", "Data Structures & Algorithms", "Operating Systems", "System Analysis & Design", "Computer Architecture", "Design & Analysis of Algorithms", "Computer Networks", "Differential Calculus", "Integral Calculus", "Differential Equations", "Abstract Algebra", "Linear Algebra", "Matrix Algebra", "Analytical Geometry (3D)", "Probability Theory", "Probability Distributions", "Statistics & Central Tendency", "Measures of Variation", "Correlation Analysis", "Regression Analysis", "Sampling Distribution"],
  BBA: ["Principles of Management", "Organizational Behaviour", "Human Resource Management", "Strategic Management", "Business Ethics & Governance", "Entrepreneurship Development", "Financial Accounting", "Cost Accounting", "Corporate Accounting", "Management Accounting", "Financial Management", "Income Tax Law & Practice", "Business Mathematics", "Business Statistics", "Research Methodology", "Operations Research", "Computer Applications & IT", "Management Information Systems", "Principles of Marketing", "Marketing Management", "Consumer Behavior Analysis", "E-Commerce & Digital Business", "International Business & EXIM", "Microeconomics", "Macroeconomics", "Business Environment", "Business Law / Legal Aspects", "Environmental Studies & CSR", "Production & Operations Mgmt", "Logistics & Supply Chain", "Business Communication", "Corporate Summer Internship", "Final Capstone Project & Viva"],
  BIOTECH: ["Cell Biology", "Genetics", "Molecular Biology", "Biochemistry", "Microbiology", "Physiology", "Developmental Biology", "Biomolecules", "Biostatistics", "Genetic Engineering", "Recombinant DNA Technology", "Bioprocess Engineering", "Enzyme Technology", "Industrial Biotechnology", "Plant Biotechnology", "Animal Biotechnology", "Medical Biotechnology", "Agricultural Biotechnology", "Environmental Biotechnology", "Bioinformatics", "Computational Biology", "Immunology", "Virology", "Genomics", "Biosafety & Bioethics", "Research Methodology", "Project Work & Internship"]
};

function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({});
  const [tests, setTests] = useState([]);
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [uploadMode, setUploadMode] = useState("pdf");
  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState({ title: "", subject: "", topic: "", duration: 60 });
  const [pdfFile, setPdfFile] = useState(null);
  const [manualQuestions, setManualQuestions] = useState([{ question: "", options: ["", "", "", ""], correctAnswer: "" }]);
  const [uploading, setUploading] = useState(false);

  const [notesCourse, setNotesCourse] = useState("");
  const [notesSubject, setNotesSubject] = useState("");
  const [notesTitle, setNotesTitle] = useState("");
  const [notesDesc, setNotesDesc] = useState("");
  const [notesPdf, setNotesPdf] = useState(null);

  const handleNotesUpload = async (e) => {
    e.preventDefault();
    if (!notesPdf || !notesTitle || !notesCourse || !notesSubject) {
      alert("Please fill all required fields");
      return;
    }
    setUploading(true);
    try {
      const token = localStorage.getItem("token");
      const fd = new FormData();
      fd.append("pdf", notesPdf);
      fd.append("title", notesTitle);
      fd.append("description", notesDesc);
      fd.append("course", notesCourse);
      fd.append("subject", notesSubject);
      await axios.post(`${API_BASE}/notes/upload`, fd, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
      });
      alert("Notes uploaded successfully!");
      setNotesCourse("");
      setNotesSubject("");
      setNotesTitle("");
      setNotesDesc("");
      setNotesPdf(null);
      fetchNotes();
      getStats();
    } catch (err) {
      alert(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteNote = async (id) => {
    if (!confirm("Delete this note?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE}/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchNotes();
      getStats();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  useEffect(() => {
    getStats();
    fetchTests();
    fetchStudents();
    fetchNotes();
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

  const fetchNotes = async () => {
    try {
      const res = await axios.get(`${API_BASE}/notes`);
      setNotes(res.data);
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

  const overviewData = [
    { name: "Students", value: stats.totalStudents || 0 },
    { name: "Courses", value: stats.totalCourses || 0 },
    { name: "Notes", value: stats.totalNotes || 0 },
    { name: "Lectures", value: stats.totalLectures || 0 },
    { name: "Tests", value: stats.totalTests || 0 },
    { name: "Questions", value: stats.totalQuestions || 0 },
  ];

  const statCards = [
    { label: "Students", value: stats.totalStudents || 0, icon: "👥", color: "#3498db" },
    { label: "Courses", value: stats.totalCourses || 0, icon: "📚", color: "#2ecc71" },
    { label: "Notes", value: stats.totalNotes || 0, icon: "📄", color: "#9b59b6" },
    { label: "Lectures", value: stats.totalLectures || 0, icon: "🎬", color: "#e74c3c" },
    { label: "Tests", value: stats.totalTests || 0, icon: "📝", color: "#f39c12" },
    { label: "Questions", value: stats.totalQuestions || 0, icon: "❓", color: "#1abc9c" },
  ];

  return (
    <div className="dashboard-layout">
      <div className={`sidebar-overlay ${sidebarOpen ? "open" : ""}`} onClick={() => setSidebarOpen(false)} />
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <span className="sidebar-logo">⚙️</span>
          <span className="sidebar-title">Admin Panel</span>
        </div>
        <nav className="sidebar-nav">
          {navItems.map(item => (
            <button
              key={item.key}
              className={`sidebar-link ${activeSection === item.key ? "active" : ""}`}
              onClick={() => { setActiveSection(item.key); setSidebarOpen(false); }}
            >
              <span className="sidebar-link-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>&#9776;</button>
          <h1>Admin Dashboard</h1>
          <div />
        </header>

        <div className="dashboard-content">
          {activeSection === "overview" && (
            <>
              <div className="stats-container">
                {statCards.map((card) => (
                  <div key={card.label} className="stat-card" style={{ borderTopColor: card.color }}>
                    <span className="stat-icon">{card.icon}</span>
                    <p className="stat-value">{card.value.toLocaleString()}</p>
                    <h2 className="stat-label">{card.label}</h2>
                  </div>
                ))}
              </div>

              <div className="charts-grid">
                <div className="chart-card">
                  <h3>Platform Overview</h3>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={overviewData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                      <XAxis dataKey="name" tick={{ fill: "var(--text-color)", fontSize: 12 }} />
                      <YAxis tick={{ fill: "var(--text-color)", fontSize: 12 }} />
                      <Tooltip contentStyle={{ background: "var(--card-bg)", border: "1px solid var(--border-color)", borderRadius: "8px", color: "var(--text-color)" }} />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                        {overviewData.map((_, i) => (<Cell key={i} fill={COLORS[i % COLORS.length]} />))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="chart-card">
                  <h3>Content Distribution</h3>
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie data={overviewData} cx="50%" cy="50%" innerRadius={60} outerRadius={100}
                        dataKey="value" nameKey="name" paddingAngle={3}>
                        {overviewData.map((_, i) => (<Cell key={i} fill={COLORS[i % COLORS.length]} stroke="transparent" />))}
                      </Pie>
                      <Tooltip contentStyle={{ background: "var(--card-bg)", border: "1px solid var(--border-color)", borderRadius: "8px", color: "var(--text-color)" }} />
                      <Legend wrapperStyle={{ fontSize: 12, color: "var(--text-color)" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="charts-grid">
                {stats.registrationTrend?.length > 0 && (
                  <div className="chart-card full-width">
                    <h3>Student Registration Trend (Last 6 Months)</h3>
                    <ResponsiveContainer width="100%" height={240}>
                      <AreaChart data={stats.registrationTrend}>
                        <defs>
                          <linearGradient id="regGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3498db" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#3498db" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                        <XAxis dataKey="month" tick={{ fill: "var(--text-color)", fontSize: 12 }} />
                        <YAxis tick={{ fill: "var(--text-color)", fontSize: 12 }} allowDecimals={false} />
                        <Tooltip contentStyle={{ background: "var(--card-bg)", border: "1px solid var(--border-color)", borderRadius: "8px", color: "var(--text-color)" }} />
                        <Area type="monotone" dataKey="students" stroke="#3498db" fill="url(#regGrad)" strokeWidth={2} dot={{ fill: "#3498db", r: 4 }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}
                {stats.subjectBreakdown?.length > 0 && (
                  <div className="chart-card full-width">
                    <h3>Tests & Questions by Subject</h3>
                    <ResponsiveContainer width="100%" height={240}>
                      <BarChart data={stats.subjectBreakdown}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                        <XAxis dataKey="name" tick={{ fill: "var(--text-color)", fontSize: 12 }} />
                        <YAxis tick={{ fill: "var(--text-color)", fontSize: 12 }} allowDecimals={false} />
                        <Tooltip contentStyle={{ background: "var(--card-bg)", border: "1px solid var(--border-color)", borderRadius: "8px", color: "var(--text-color)" }} />
                        <Legend wrapperStyle={{ fontSize: 12, color: "var(--text-color)" }} />
                        <Bar dataKey="tests" name="Tests" fill="#f39c12" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="questions" name="Questions" fill="#3498db" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </>
          )}

          {activeSection === "mocktests" && (
            <div>
              <div className="section-header">
                <h2>Mock Test Management</h2>
                <button className="add-test-btn" onClick={() => setShowForm(!showForm)}>
                  {showForm ? "Cancel" : "+ Add New Mock Test"}
                </button>
              </div>

              {showForm && (
                <div className="form-card">
                  <div className="toggle-group">
                    <button onClick={() => setUploadMode("pdf")}
                      style={{ background: uploadMode === "pdf" ? "var(--accent-color)" : "var(--secondary-bg)", color: uploadMode === "pdf" ? "var(--hero-text)" : "var(--text-color)" }}>
                      Upload PDF
                    </button>
                    <button onClick={() => setUploadMode("manual")}
                      style={{ background: uploadMode === "manual" ? "var(--accent-color)" : "var(--secondary-bg)", color: uploadMode === "manual" ? "var(--hero-text)" : "var(--text-color)" }}>
                      Add Manually
                    </button>
                  </div>
                  <div className="form-grid">
                    <div className="form-field">
                      <label>Test Title *</label>
                      <input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Biotech Midterm Quiz" />
                    </div>
                    <div className="form-field">
                      <label>Subject</label>
                      <input value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} placeholder="e.g. Biotechnology" />
                    </div>
                    <div className="form-field">
                      <label>Topic</label>
                      <input value={formData.topic} onChange={e => setFormData({ ...formData, topic: e.target.value })} placeholder="e.g. Genetics" />
                    </div>
                    <div className="form-field">
                      <label>Duration (minutes)</label>
                      <input type="number" value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} />
                    </div>
                  </div>

                  {uploadMode === "pdf" ? (
                    <form onSubmit={handleUploadPDF}>
                      <div className="form-field">
                        <label>Select PDF File *</label>
                        <input type="file" accept=".pdf" onChange={e => setPdfFile(e.target.files[0])} />
                      </div>
                      <p className="form-hint">PDF should have questions numbered like "1. Question text" with options "A) Option" and answers "Ans: A"</p>
                      <button type="submit" disabled={uploading} className="btn-primary">
                        {uploading ? "Uploading..." : "Upload & Create Test"}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleAddManual}>
                      {manualQuestions.map((q, qIdx) => (
                        <div key={qIdx} className="question-card">
                          <div className="question-header">
                            <strong>Question {qIdx + 1}</strong>
                            {manualQuestions.length > 1 && (
                              <button type="button" onClick={() => removeQuestion(qIdx)} className="btn-remove">Remove</button>
                            )}
                          </div>
                          <input value={q.question} onChange={e => updateQuestion(qIdx, "question", e.target.value)}
                            placeholder="Enter question text" className="question-input" />
                          <div className="options-grid">
                            {q.options.map((opt, oIdx) => (
                              <input key={oIdx} value={opt} onChange={e => updateOption(qIdx, oIdx, e.target.value)}
                                placeholder={`Option ${String.fromCharCode(65 + oIdx)}`} className="option-input" />
                            ))}
                          </div>
                          <select value={q.correctAnswer} onChange={e => updateQuestion(qIdx, "correctAnswer", e.target.value)}
                            className="answer-select">
                            <option value="">Select Correct Answer</option>
                            {q.options.filter(o => o.trim()).map((opt, oIdx) => (
                              <option key={oIdx} value={opt}>{String.fromCharCode(65 + oIdx)}) {opt}</option>
                            ))}
                          </select>
                        </div>
                      ))}
                      <button type="button" onClick={addQuestion} className="btn-add-question">+ Add Another Question</button>
                      <div>
                        <button type="submit" disabled={uploading} className="btn-primary">
                          {uploading ? "Creating..." : "Create Mock Test"}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              <div className="table-card">
                <div className="table-scroll">
                  <table className="dashboard-table">
                    <thead>
                      <tr>
                        <th>Title</th><th>Subject</th><th>Topic</th>
                        <th style={{ textAlign: "center" }}>Questions</th>
                        <th style={{ textAlign: "center" }}>Duration</th>
                        <th style={{ textAlign: "center" }}>Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tests.length === 0 ? (
                        <tr><td colSpan="6" className="table-empty">No mock tests found. Click "Add New Mock Test" to create one.</td></tr>
                      ) : (
                        tests.map((test) => (
                          <tr key={test._id}>
                            <td className="cell-bold">{test.title}</td>
                            <td>{test.subject || "-"}</td>
                            <td>{test.topic || "-"}</td>
                            <td className="cell-center">{test.questions.length}</td>
                            <td className="cell-center">{test.duration || 60} min</td>
                            <td className="cell-center cell-small">{new Date(test.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeSection === "students" && (
            <div>
              <div className="section-header">
                <h2>Student Details</h2>
              </div>
              <div className="table-card">
                <div className="table-scroll">
                  <table className="dashboard-table">
                    <thead>
                      <tr>
                        <th>Full Name</th><th>Email</th><th>Student ID</th>
                        <th style={{ textAlign: "center" }}>Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.length === 0 ? (
                        <tr><td colSpan="4" className="table-empty">No students registered yet.</td></tr>
                      ) : (
                        students.map((student) => (
                          <tr key={student._id}>
                            <td className="cell-bold">{student.name}</td>
                            <td>{student.email}</td>
                            <td>{student.studentId || "-"}</td>
                            <td className="cell-center cell-small">{new Date(student.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeSection === "uploadnotes" && (
            <div>
              <div className="section-header">
                <h2>Upload Study Notes</h2>
              </div>
              <div className="form-card">
                <form onSubmit={handleNotesUpload}>
                  <div className="form-field">
                    <label>Course *</label>
                    <select value={notesCourse} onChange={e => { setNotesCourse(e.target.value); setNotesSubject(""); }}>
                      <option value="">Select Course</option>
                      <option value="BCA">BCA</option>
                      <option value="BBA">BBA</option>
                      <option value="BIOTECH">BIOTECH</option>
                    </select>
                  </div>
                  <div className="form-field">
                    <label>Subject *</label>
                    <select value={notesSubject} onChange={e => setNotesSubject(e.target.value)} disabled={!notesCourse}>
                      <option value="">Select Subject</option>
                      {notesCourse && coursesData[notesCourse]?.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-field">
                    <label>Title *</label>
                    <input value={notesTitle} onChange={e => setNotesTitle(e.target.value)} placeholder="e.g. Chapter 1 Notes" />
                  </div>
                  <div className="form-field">
                    <label>Description</label>
                    <input value={notesDesc} onChange={e => setNotesDesc(e.target.value)} placeholder="Brief description" />
                  </div>
                  <div className="form-field">
                    <label>Select PDF File *</label>
                    <input type="file" accept=".pdf" onChange={e => setNotesPdf(e.target.files[0])} />
                  </div>
                  <button type="submit" disabled={uploading} className="btn-primary">
                    {uploading ? "Uploading..." : "Upload Notes"}
                  </button>
                </form>
              </div>

              <div className="section-header" style={{ marginTop: "2rem" }}>
                <h2>All Notes</h2>
              </div>
              <div className="table-card">
                <div className="table-scroll">
                  <table className="dashboard-table">
                    <thead>
                      <tr>
                        <th>Course</th><th>Subject</th><th>Title</th>
                        <th style={{ textAlign: "center" }}>PDF</th>
                        <th style={{ textAlign: "center" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {notes.length === 0 ? (
                        <tr><td colSpan="5" className="table-empty">No notes uploaded yet.</td></tr>
                      ) : (
                        notes.map((note) => (
                          <tr key={note._id}>
                            <td>{note.course || "-"}</td>
                            <td>{note.subject || "-"}</td>
                            <td className="cell-bold">{note.title}</td>
                            <td className="cell-center">
                              <a href={`http://localhost:5000/uploads/${note.pdfUrl}`} target="_blank" rel="noreferrer" className="btn-primary" style={{ textDecoration: "none", fontSize: "0.8rem", padding: "4px 12px" }}>View PDF</a>
                            </td>
                            <td className="cell-center">
                              <button onClick={() => handleDeleteNote(note._id)} className="btn-remove" style={{ padding: "4px 12px", fontSize: "0.8rem" }}>Delete</button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
