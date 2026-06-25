import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "./context/ThemeContext";
import Navbar from "./pages/NavBar";
import Home from "./pages/home";
import BCA from "./pages/bca";
import StudyNotes from "./pages/StudyNotes";
import RecordedLectures from "./pages/RecordedLectures";
import Test from "./pages/mock-test";
import ProtectedRoute from "./components/ProtectedRoute";
import RoadMap from "./pages/bbaroadmap";
import Login from "./pages/login";
import Signup from "./pages/signUp";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import AddMockTest from "./pages/AddMockTest";
import AdminLogin from "./pages/AdminLogin";
import AdminRoute from "./components/AdminRoute";
import ForgotPassword from "./pages/ForgotPassword";
import Biotech from "./pages/biotech";
import BcaRoadmap from "./pages/roadmapbca";
import BBA from "./pages/bba";
import BIO from "./pages/biotechsylla";
import Chatbot from "./components/Chatbot";


function App() {
  const { darkMode } = useContext(ThemeContext);

  return (
    <div className={darkMode ? "dark-theme" : "light-theme"}>
      <Router>
        <Navbar/>
        <Chatbot />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bca" element={<BCA />} />
          <Route path="/bba" element={<BBA />} />
          <Route path="/biotechsylla" element={<BIO />} />
          <Route path="/study-notes" element={<StudyNotes />} />
          <Route path="/recorded-lectures" element={<RecordedLectures />} />
          <Route path="/mock-test" element={
            <ProtectedRoute>
              <Test />
            </ProtectedRoute>
          } />
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
          <Route path="/admin/add-mock-test" element={
            <AdminRoute>
              <AddMockTest />
            </AdminRoute>
          } />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/biotech" element={<Biotech />} />  
        </Routes>
      </Router>
    </div>
  );
}

export default App;