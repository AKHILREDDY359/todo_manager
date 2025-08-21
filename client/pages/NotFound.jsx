import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Home, ArrowLeft, ClipboardList, Info } from 'lucide-react';
import './NotFound.css';

/**
 * NotFound (404) Page Component
 * Features:
 * - User-friendly 404 error page
 * - Navigation back to home
 * - Animated illustration
 * - Responsive design
 */
const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        {/* Animated 404 Illustration */}
        <div className="error-illustration">
          <div className="error-number">404</div>
          <div className="error-icon">
            <Search size={64} />
          </div>
        </div>

        {/* Error Message */}
        <div className="error-message">
          <h1 className="error-title">Page Not Found</h1>
          <p className="error-description">
            Oops! It looks like the page you're looking for doesn't exist. 
            It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="error-actions">
          <Link to="/" className="btn btn-primary">
            <Home className="btn-icon" size={18} />
            Go to Todo Manager
          </Link>
          <button
            className="btn btn-secondary"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="btn-icon" size={18} />
            Go Back
          </button>
        </div>

        {/* Helpful Links */}
        <div className="helpful-links">
          <h3>You might be looking for:</h3>
          <ul className="links-list">
            <li>
              <Link to="/">
                <ClipboardList size={16} className="inline mr-2" />
                Todo Manager
              </Link>
            </li>
            <li>
              <Link to="/about">
                <Info size={16} className="inline mr-2" />
                About TaskFlow
              </Link>
            </li>
          </ul>
        </div>

        {/* Footer Message */}
        <div className="error-footer">
          <p>
            If you think this is a mistake, please check the URL or go back to the home page.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
