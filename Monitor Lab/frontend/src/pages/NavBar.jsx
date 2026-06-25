import React, { useContext, useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import "../css_files/navbar.css";
import { ThemeContext } from '../context/ThemeContext';

const Navbar = () => {
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCoursesOpen, setIsCoursesOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsCoursesOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isAdmin");
    navigate("/login");
    closeMenu();
  };

  const isLoggedIn = !!localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  return (
    <nav className={`navbar ${darkMode ? 'dark' : 'light'}`}>
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo">
          <Link to="/" onClick={closeMenu}>
            <svg 
              className="logo-icon-svg" 
              xmlns="http://www.w3.org/2000/svg" 
              width="28" 
              height="28" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
              <path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
            <span className="logo-text">MENTOR LAB</span>
          </Link>
        </div>

        {/* Hamburger Menu Icon */}
        <div className={`hamburger ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>

        {/* Navigation Links */}
        <ul className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
          <li>
            <NavLink to="/" onClick={closeMenu} className={({ isActive }) => isActive ? "active-link" : ""}>
              HOME
            </NavLink>
          </li>
          <li 
            className="dropdown" 
            onMouseEnter={() => setIsCoursesOpen(true)} 
            onMouseLeave={() => setIsCoursesOpen(false)}
          >
            <span className="dropdown-trigger">
              COURSES {isCoursesOpen ? '▴' : '▾'}
            </span>
            <ul className={`dropdown-menu ${isCoursesOpen ? 'show' : ''}`}>
              <li><Link to="/bca" onClick={closeMenu}>BCA (Computer)</Link></li>
              <li><Link to="/bba" onClick={closeMenu}>BBA (Management)</Link></li>
              <li><Link to="/biotech" onClick={closeMenu}>Biotech (Main)</Link></li>
              <li><Link to="/biotechsylla" onClick={closeMenu}>Biotech Syllabus</Link></li>
            </ul>
          </li>
          <li>
            <NavLink to="/mock-test" onClick={closeMenu} className={({ isActive }) => isActive ? "active-link" : ""}>
              MOCK TEST
            </NavLink>
          </li>
          <li>
            <NavLink to="/study-notes" onClick={closeMenu} className={({ isActive }) => isActive ? "active-link" : ""}>
              STUDY NOTES
            </NavLink>
          </li>
          <li>
            <NavLink to="/recorded-lectures" onClick={closeMenu} className={({ isActive }) => isActive ? "active-link" : ""}>
              LECTURES
            </NavLink>
          </li>
        </ul>

        {/* Action Buttons */}
        <div className={`navbar-actions ${isMenuOpen ? 'active' : ''}`}>
          <button 
            className="theme-toggle" 
            onClick={() => setDarkMode(!darkMode)}
            title="Toggle Dark/Light Mode"
          >
            {darkMode ? '🌙' : '☀️'}
          </button>
          
          {isLoggedIn ? (
            <>
              {isAdmin && (
                <Link to="/admin" className="btn btn-admin" onClick={closeMenu}>
                  Admin
                </Link>
              )}
              <Link to="/profile" className="btn btn-profile" onClick={closeMenu}>Profile</Link>
              <button className="btn btn-logout" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-login" onClick={closeMenu}>Login</Link>
              <Link to="/signup" className="btn btn-signup" onClick={closeMenu}>Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;