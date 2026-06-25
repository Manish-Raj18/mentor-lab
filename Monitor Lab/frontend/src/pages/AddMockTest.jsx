import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css_files/style.css"; // Reuse existing styles or add new ones

function AddMockTest() {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("Biotech");
  const [topic, setTopic] = useState("");
  const [duration, setDuration] = useState(60);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a PDF file");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("subject", subject);
    formData.append("topic", topic);
    formData.append("duration", duration);
    formData.append("pdf", file);

    try {
      const response = await axios.post("http://localhost:5000/api/mocktest/upload-pdf", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage("Test created successfully with " + response.data.questions.length + " questions!");
      setTimeout(() => navigate("/admin"), 2000);
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Error uploading PDF. Please check the format.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-dashboard" style={{ padding: "40px 20px" }}>
      <div className="login-box" style={{ maxWidth: "600px", margin: "0 auto", textAlign: "left" }}>
        <h2 style={{ textAlign: "center", marginBottom: "30px" }}>Add Mock Test via PDF</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Test Title</label>
            <input type="text" placeholder="e.g. Cell Biology Quiz 1" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Subject</label>
            <select value={subject} onChange={(e) => setSubject(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "5px", background: "var(--input-bg)", color: "var(--text-color)" }}>
              <option value="Biotech">Biotechnology</option>
              <option value="BBA">BBA</option>
              <option value="BCA">BCA</option>
            </select>
          </div>

          <div className="form-group">
            <label>Topic Name (Must match Study Notes topic)</label>
            <input type="text" placeholder="e.g. Genetics, Programming Languages" value={topic} onChange={(e) => setTopic(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Duration (Minutes)</label>
            <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Select Question PDF</label>
            <input type="file" accept=".pdf" onChange={handleFileChange} required />
          </div>

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? "Processing PDF..." : "Generate Test"}
          </button>
        </form>

        {message && <p style={{ marginTop: "20px", textAlign: "center", color: message.includes("Error") ? "red" : "green", fontWeight: "bold" }}>{message}</p>}

        <div className="format-guide" style={{ marginTop: "30px", padding: "15px", background: "var(--secondary-bg)", borderRadius: "8px", fontSize: "0.85rem" }}>
          <h4 style={{ marginBottom: "10px" }}>📚 PDF Format Guide:</h4>
          <p>For best results, ensure your PDF follows this structure:</p>
          <ul style={{ paddingLeft: "20px", marginTop: "5px" }}>
            <li>Questions start with a number (e.g., <strong>1. What is...</strong>)</li>
            <li>Options start with a letter (e.g., <strong>A. Option Text</strong>)</li>
            <li>Answers follow the options (e.g., <strong>Ans: A</strong>)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AddMockTest;
