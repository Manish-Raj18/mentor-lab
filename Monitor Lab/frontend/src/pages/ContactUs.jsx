import { useState } from "react";
import axios from "axios";
import "../css_files/style.css";

const API_BASE = "/api";

function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState({ type: "", text: "" });
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (sending) return;

    setSending(true);
    setStatus({ type: "", text: "" });

    try {
      const response = await axios.post(`${API_BASE}/contact`, formData);
      setStatus({
        type: "success",
        text: response.data?.message || "Thank you for reaching out! Your message has been sent.",
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      setStatus({
        type: "error",
        text:
          error.response?.data?.message ||
          "Something went wrong while sending your message. Please try again or email mentorlab06@gmail.com.",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="home">
      <section className="hero" style={{ height: "auto", minHeight: "250px" }}>
        <div className="hero-left">
          <h1>Contact Us</h1>
          <p>We'd love to hear from you. Feel free to reach out!</p>
        </div>
      </section>

      <section className="features" style={{ padding: "40px 20px" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
              maxLength={80}
              style={{ padding: "12px", borderRadius: "8px", border: "1px solid #ccc", fontSize: "16px" }}
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
              maxLength={120}
              style={{ padding: "12px", borderRadius: "8px", border: "1px solid #ccc", fontSize: "16px" }}
            />
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
              required
              maxLength={150}
              style={{ padding: "12px", borderRadius: "8px", border: "1px solid #ccc", fontSize: "16px" }}
            />
            <textarea
              name="message"
              placeholder="Your Message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              required
              maxLength={5000}
              style={{ padding: "12px", borderRadius: "8px", border: "1px solid #ccc", fontSize: "16px", resize: "vertical" }}
            />
            <button
              type="submit"
              disabled={sending}
              style={{
                padding: "12px 24px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: sending ? "#9db9d6" : "#4a90d9",
                color: "#fff",
                fontSize: "16px",
                cursor: sending ? "not-allowed" : "pointer",
              }}
            >
              {sending ? "Sending..." : "Send Message"}
            </button>

            {status.text && (
              <p
                role="status"
                style={{
                  margin: 0,
                  padding: "12px 16px",
                  borderRadius: "8px",
                  fontSize: "15px",
                  backgroundColor: status.type === "success" ? "#ecfdf5" : "#fef2f2",
                  border: `1px solid ${status.type === "success" ? "#6ee7b7" : "#fca5a5"}`,
                  color: status.type === "success" ? "#065f46" : "#991b1b",
                }}
              >
                {status.text}
              </p>
            )}
          </form>

          <div style={{ marginTop: "40px", textAlign: "center" }}>
            <h3>Other Ways to Reach Us</h3>
            <p>Email: mentorlab06@gmail.com</p>
            <p>Phone: +91-9031772278</p>
            <p>Address: Mentor Lab, Education Hub, India</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>© 2026 MENTOR LAB. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default ContactUs;
