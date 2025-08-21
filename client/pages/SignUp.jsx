import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, UserPlus, ArrowLeft, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import './SignUp.css';

/**
 * SignUp Page Component
 * Features:
 * - Complete registration form with validation
 * - Real-time password strength indicator
 * - Terms and privacy policy acceptance
 * - Responsive Notion-inspired design
 * - Email availability checking
 */
const SignUp = () => {
  const navigate = useNavigate();
  const { signUp, loading, error, clearError, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Clear errors when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  // Calculate password strength
  useEffect(() => {
    const calculateStrength = (password) => {
      let strength = 0;
      if (password.length >= 8) strength += 25;
      if (/[a-z]/.test(password)) strength += 25;
      if (/[A-Z]/.test(password)) strength += 25;
      if (/[0-9]/.test(password)) strength += 15;
      if (/[^A-Za-z0-9]/.test(password)) strength += 10;
      return Math.min(strength, 100);
    };

    setPasswordStrength(calculateStrength(formData.password));
  }, [formData.password]);

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

    // Name validation
    if (!formData.name.trim()) {
      errors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (passwordStrength < 50) {
      errors.password = 'Password is too weak. Include uppercase, lowercase, and numbers.';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    // Terms validation
    if (!formData.acceptTerms) {
      errors.acceptTerms = 'You must accept the terms and conditions';
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
      await signUp({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password
      });
      // Navigation is handled by useEffect when isAuthenticated changes
    } catch (error) {
      // Error is handled by AuthContext
      console.error('Sign up failed:', error.message);
    }
  };

  // Get password strength info
  const getPasswordStrengthInfo = () => {
    if (passwordStrength < 25) return { text: 'Very Weak', color: '#ef4444' };
    if (passwordStrength < 50) return { text: 'Weak', color: '#f59e0b' };
    if (passwordStrength < 75) return { text: 'Good', color: '#10b981' };
    return { text: 'Strong', color: '#059669' };
  };

  const strengthInfo = getPasswordStrengthInfo();

  if (loading && isAuthenticated) {
    return (
      <div className="signup-container">
        <LoadingSpinner message="Creating your account..." />
      </div>
    );
  }

  return (
    <div className="signup-container">
      <div className="signup-content">
        {/* Header */}
        <div className="signup-header">
          <Link to="/" className="back-link">
            <ArrowLeft size={20} />
            Back to Home
          </Link>
          
          <div className="signup-logo">
            <UserPlus size={48} />
            <h1>Create your account</h1>
            <p>Start organizing your tasks with TaskFlow</p>
          </div>
        </div>

        {/* Sign Up Form */}
        <form onSubmit={handleSubmit} className="signup-form">
          {/* Global Error */}
          {error && (
            <div className="error-alert">
              {error}
            </div>
          )}

          {/* Name Field */}
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Full Name
            </label>
            <div className="input-group">
              <User size={20} className="input-icon" />
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`form-input ${formErrors.name ? 'error' : ''}`}
                placeholder="Enter your full name"
                autoComplete="name"
                disabled={loading}
              />
            </div>
            {formErrors.name && (
              <span className="error-message">{formErrors.name}</span>
            )}
          </div>

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
                placeholder="Create a strong password"
                autoComplete="new-password"
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
            
            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="password-strength">
                <div className="strength-bar">
                  <div 
                    className="strength-fill" 
                    style={{ 
                      width: `${passwordStrength}%`,
                      backgroundColor: strengthInfo.color 
                    }}
                  ></div>
                </div>
                <span 
                  className="strength-text"
                  style={{ color: strengthInfo.color }}
                >
                  {strengthInfo.text}
                </span>
              </div>
            )}
            
            {formErrors.password && (
              <span className="error-message">{formErrors.password}</span>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
            <div className="input-group">
              <Lock size={20} className="input-icon" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`form-input ${formErrors.confirmPassword ? 'error' : ''}`}
                placeholder="Confirm your password"
                autoComplete="new-password"
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={loading}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {formData.confirmPassword && formData.password === formData.confirmPassword && (
                <Check size={20} className="password-match" />
              )}
            </div>
            {formErrors.confirmPassword && (
              <span className="error-message">{formErrors.confirmPassword}</span>
            )}
          </div>

          {/* Terms and Conditions */}
          <div className="form-group">
            <label className={`checkbox-label ${formErrors.acceptTerms ? 'error' : ''}`}>
              <input
                type="checkbox"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleInputChange}
                className="checkbox"
                disabled={loading}
              />
              <span>
                I accept the{' '}
                <Link to="/terms" className="terms-link">Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy" className="terms-link">Privacy Policy</Link>
              </span>
            </label>
            {formErrors.acceptTerms && (
              <span className="error-message">{formErrors.acceptTerms}</span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`btn btn-primary signup-btn ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Creating Account...
              </>
            ) : (
              <>
                <UserPlus size={20} />
                Create Account
              </>
            )}
          </button>
        </form>

        {/* Sign In Link */}
        <div className="signup-footer">
          <p>
            Already have an account?{' '}
            <Link to="/signin" className="signin-link">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
