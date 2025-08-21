import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, LogIn, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import './SignIn.css';

/**
 * SignIn Page Component
 * Features:
 * - Clean Notion-inspired design
 * - Form validation and error handling
 * - Show/hide password functionality
 * - Remember me option
 * - Demo account quick access
 * - Responsive design
 */
const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, loading, error, clearError, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  // Clear errors when component mounts or form changes
  useEffect(() => {
    clearError();
  }, [clearError]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear field-specific error
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password.trim()) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    if (!validateForm()) return;

    try {
      await signIn(formData.email, formData.password);
      // Navigation is handled by useEffect when isAuthenticated changes
    } catch (error) {
      // Error is handled by AuthContext
      console.error('Sign in failed:', error.message);
    }
  };

  // Demo account quick access
  const handleDemoSignIn = async () => {
    setFormData({
      email: 'demo@taskflow.com',
      password: 'demo123',
      rememberMe: false
    });

    try {
      await signIn('demo@taskflow.com', 'demo123');
    } catch (error) {
      console.error('Demo sign in failed:', error.message);
    }
  };

  if (loading && isAuthenticated) {
    return (
      <div className="signin-container">
        <LoadingSpinner message="Signing you in..." />
      </div>
    );
  }

  return (
    <div className="signin-container">
      <div className="signin-content">
        {/* Header */}
        <div className="signin-header">
          <Link to="/" className="back-link">
            <ArrowLeft size={20} />
            Back to Home
          </Link>
          
          <div className="signin-logo">
            <LogIn size={48} />
            <h1>Welcome back</h1>
            <p>Sign in to your TaskFlow account</p>
          </div>
        </div>

        {/* Demo Account Notice */}
        <div className="demo-notice">
          <h3>Try the Demo</h3>
          <p>Use the demo account to explore TaskFlow's features</p>
          <button 
            type="button" 
            className="btn btn-secondary demo-btn"
            onClick={handleDemoSignIn}
            disabled={loading}
          >
            Sign in with Demo Account
          </button>
          <div className="demo-credentials">
            <small>Email: demo@taskflow.com | Password: demo123</small>
          </div>
        </div>

        <div className="divider">
          <span>Or sign in with your account</span>
        </div>

        {/* Sign In Form */}
        <form onSubmit={handleSubmit} className="signin-form">
          {/* Global Error */}
          {error && (
            <div className="error-alert">
              {error}
            </div>
          )}

          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <div className="input-group">
              <Mail size={20} className="input-icon" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`form-input ${formErrors.email ? 'error' : ''}`}
                placeholder="Enter your email"
                autoComplete="email"
                disabled={loading}
              />
            </div>
            {formErrors.email && (
              <span className="error-message">{formErrors.email}</span>
            )}
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="input-group">
              <Lock size={20} className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`form-input ${formErrors.password ? 'error' : ''}`}
                placeholder="Enter your password"
                autoComplete="current-password"
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {formErrors.password && (
              <span className="error-message">{formErrors.password}</span>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="form-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                className="checkbox"
                disabled={loading}
              />
              <span>Remember me</span>
            </label>
            
            <Link to="/forgot-password" className="forgot-link">
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`btn btn-primary signin-btn ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Signing in...
              </>
            ) : (
              <>
                <LogIn size={20} />
                Sign In
              </>
            )}
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="signin-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/signup" className="signup-link">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
