import { useState } from "react";
import "../css_files/style.css";

function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for reaching out! We will get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
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
              style={{ padding: "12px", borderRadius: "8px", border: "1px solid #ccc", fontSize: "16px" }}
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{ padding: "12px", borderRadius: "8px", border: "1px solid #ccc", fontSize: "16px" }}
            />
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
              required
              style={{ padding: "12px", borderRadius: "8px", border: "1px solid #ccc", fontSize: "16px" }}
            />
            <textarea
              name="message"
              placeholder="Your Message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              required
              style={{ padding: "12px", borderRadius: "8px", border: "1px solid #ccc", fontSize: "16px", resize: "vertical" }}
            />
            <button
              type="submit"
              style={{
                padding: "12px 24px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "#4a90d9",
                color: "#fff",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              Send Message
            </button>
          </form>

          <div style={{ marginTop: "40px", textAlign: "center" }}>
            <h3>Other Ways to Reach Us</h3>
            <p>Email: support@mentorlab.com</p>
            <p>Phone: +91-9876543210</p>
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
