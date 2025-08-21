import React from 'react';
import './LoadingSpinner.css';

/**
 * LoadingSpinner Component
 * Features:
 * - Multiple sizes (small, medium, large)
 * - Optional message display
 * - Smooth animations
 * - Accessibility support
 */
const LoadingSpinner = ({ 
  size = 'medium', 
  message = '', 
  className = '',
  color = 'primary' 
}) => {
  return (
    <div className={`loading-spinner-container ${size} ${className}`}>
      <div className={`loading-spinner ${size} ${color}`}>
        <div className="spinner-circle"></div>
        <div className="spinner-circle"></div>
        <div className="spinner-circle"></div>
      </div>
      {message && (
        <p className="loading-message" aria-live="polite">
          {message}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
