import React from 'react';
import './ErrorMessage.css';

/**
 * ErrorMessage Component
 * Features:
 * - Display error messages with proper styling
 * - Retry functionality
 * - Different error types
 * - Dismissible errors
 * - Accessibility support
 */
const ErrorMessage = ({
  message = 'An unexpected error occurred',
  type = 'error',
  onRetry,
  onDismiss,
  retryText = 'Try Again',
  showRetry = true,
  showDismiss = false,
  className = ''
}) => {
  const getErrorIcon = () => {
    switch (type) {
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      case 'success':
        return '✅';
      default:
        return '❌';
    }
  };

  return (
    <div className={`error-message-container ${type} ${className}`} role="alert">
      <div className="error-content">
        <div className="error-icon">
          {getErrorIcon()}
        </div>
        <div className="error-text">
          <p className="error-main-message">{message}</p>
        </div>
      </div>
      
      <div className="error-actions">
        {showRetry && onRetry && (
          <button
            className="error-btn retry-btn"
            onClick={onRetry}
            type="button"
          >
            🔄 {retryText}
          </button>
        )}
        
        {showDismiss && onDismiss && (
          <button
            className="error-btn dismiss-btn"
            onClick={onDismiss}
            type="button"
            aria-label="Dismiss error"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
