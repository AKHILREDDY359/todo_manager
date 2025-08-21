import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, CheckSquare, Menu, X, ClipboardList, Info, Phone } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext.jsx';
import './Navbar.css';

/**
 * Navigation Bar Component
 * Features:
 * - Responsive design (mobile hamburger menu)
 * - Active route highlighting
 * - Dark/light theme toggle
 * - Modern glassmorphism design
 * - Touch-friendly for mobile devices
 */
const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Navigation items configuration
  const navItems = [
    { path: '/', label: 'Todo Manager', icon: ClipboardList },
    { path: '/about', label: 'About', icon: Info },
  ];

  // Check if current path is active
  const isActivePath = (path) => {
    return location.pathname === path;
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when link is clicked
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Brand/Logo */}
        <Link to="/" className="nav-brand" onClick={closeMobileMenu}>
          <CheckSquare className="brand-icon" size={24} />
          <span className="brand-text">TaskFlow</span>
        </Link>

        {/* Desktop Navigation Links */}
        <ul className={`nav-links ${isMobileMenuOpen ? 'nav-links-mobile' : ''}`}>
          {navItems.map((item) => (
            <li key={item.path} className="nav-item">
              <Link
                to={item.path}
                className={`nav-link ${isActivePath(item.path) ? 'nav-link-active' : ''}`}
                onClick={closeMobileMenu}
              >
                <item.icon className="nav-icon" size={18} />
                <span className="nav-text">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Theme Toggle and Mobile Menu Button */}
        <div className="nav-actions">
          {/* Theme Toggle Button */}
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <Moon className="theme-icon" size={18} />
            ) : (
              <Sun className="theme-icon" size={18} />
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className={`mobile-menu-toggle ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-overlay"
          onClick={closeMobileMenu}
          aria-hidden="true"
        ></div>
      )}
    </nav>
  );
};

export default Navbar;
