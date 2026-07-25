import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "./context/ThemeContext";
import Navbar from "./pages/NavBar";
import Home from "./pages/home";
import BCA from "./pages/bca";
import ContactUs from "./pages/ContactUs";
import RecordedLectures from "./pages/RecordedLectures";
import AboutUs from "./pages/AboutUs";
import Login from "./pages/login";
import Signup from "./pages/signUp";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminRoute from "./components/AdminRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPassword from "./pages/ForgotPassword";
import Biotech from "./pages/biotech";
import Chatbot from "./components/Chatbot";
import ChatbotPage from "./pages/ChatbotPage";
import BcaRoadmap from "./pages/BCARoadmap";
import BBA from "./pages/bba";
import BIO from "./pages/biotechsylla";
import RoadMap from "./pages/bbaroadmap";
import MockTest from "./pages/MockTest";
import StudyNotes from "./pages/StudyNotes";
import PerformanceAnalytics from "./pages/PerformanceAnalytics";



function App() {
  const { darkMode } = useContext(ThemeContext);

  return (
    <div className={darkMode ? "dark-theme" : "light-theme"}>
      <Router>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bca" element={<BCA />} />
          <Route path="/bba" element={<BBA />} />
          <Route path="/biotechsylla" element={<BIO />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/study-notes" element={<StudyNotes />} />
          <Route path="/recorded-lectures" element={<RecordedLectures />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/bbaroadmap" element={<RoadMap />} />
          <Route path="/roadmapbca" element={<BcaRoadmap />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/biotech" element={<Biotech />} />
          <Route path="/chatbot" element={<ChatbotPage />} />
          <Route path="/mock-test" element={<ProtectedRoute><MockTest /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><PerformanceAnalytics /></ProtectedRoute>} />
        </Routes>
        <Chatbot />
      </Router>
    </div>
  );
}

export default App;