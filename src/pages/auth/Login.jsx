import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isSignUp) {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        // Handle sign up
        console.log('Sign up:', formData);
      } else {
        // Handle sign in
        console.log('Sign in:', formData);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    console.log('Google authentication');
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setError('');
  };

  return (
    <div className="auth-page">
      {/* Background Elements */}
      <div className="auth-background">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
          <div className="shape shape-5"></div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="auth-nav">
        <Link to="/" className="auth-logo">
          <div className="logo-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L3 7L12 12L21 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 17L12 22L21 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 12L12 17L21 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span>Trip Buddy</span>
        </Link>
        <Link to="/" className="back-home">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Home
        </Link>
      </nav>

      {/* Main Content */}
      <div className="auth-container">
        <div className="auth-card">
          {/* Form Container */}
          <div className="form-container">
            <div className={`form-wrapper ${isSignUp ? 'sign-up-mode' : ''}`}>
              
              {/* Sign In Form */}
              <div className="form-panel sign-in-panel">
                <div className="form-content">
                  <h2 className="form-title">Welcome Back</h2>
                  <p className="form-subtitle">Sign in to continue your journey</p>
                  
                  <form onSubmit={handleSubmit} className="auth-form">
                    {error && (
                      <div className="error-message">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                          <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2"/>
                          <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        {error}
                      </div>
                    )}

                    <div className="input-group">
                      <div className="input-wrapper">
                        <svg className="input-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2"/>
                          <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Email address"
                          required
                        />
                      </div>
                    </div>

                    <div className="input-group">
                      <div className="input-wrapper">
                        <svg className="input-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                          <circle cx="12" cy="16" r="1" stroke="currentColor" strokeWidth="2"/>
                          <path d="M7 11V7A5 5 0 0 1 17 7V11" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="Password"
                          required
                        />
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      className={`auth-btn primary ${isLoading ? 'loading' : ''}`}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="spinner"></div>
                      ) : (
                        <>
                          Sign In
                          <svg className="btn-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </>
                      )}
                    </button>

                    <div className="divider">
                      <span>or</span>
                    </div>

                    <button 
                      type="button" 
                      onClick={handleGoogleAuth}
                      className="auth-btn google"
                    >
                      <svg className="google-icon" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Continue with Google
                    </button>
                  </form>
                </div>
              </div>

              {/* Sign Up Form */}
              <div className="form-panel sign-up-panel">
                <div className="form-content">
                  <h2 className="form-title">Create Account</h2>
                  <p className="form-subtitle">Join us and start your adventure</p>
                  
                  <form onSubmit={handleSubmit} className="auth-form">
                    {error && (
                      <div className="error-message">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                          <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2"/>
                          <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        {error}
                      </div>
                    )}

                    <div className="input-group">
                      <div className="input-wrapper">
                        <svg className="input-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2"/>
                          <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Full name"
                          required
                        />
                      </div>
                    </div>

                    <div className="input-group">
                      <div className="input-wrapper">
                        <svg className="input-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2"/>
                          <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Email address"
                          required
                        />
                      </div>
                    </div>

                    <div className="input-group">
                      <div className="input-wrapper">
                        <svg className="input-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                          <circle cx="12" cy="16" r="1" stroke="currentColor" strokeWidth="2"/>
                          <path d="M7 11V7A5 5 0 0 1 17 7V11" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="Password"
                          required
                        />
                      </div>
                    </div>

                    <div className="input-group">
                      <div className="input-wrapper">
                        <svg className="input-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                          <circle cx="12" cy="16" r="1" stroke="currentColor" strokeWidth="2"/>
                          <path d="M7 11V7A5 5 0 0 1 17 7V11" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          placeholder="Confirm password"
                          required
                        />
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      className={`auth-btn primary ${isLoading ? 'loading' : ''}`}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="spinner"></div>
                      ) : (
                        <>
                          Create Account
                          <svg className="btn-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </>
                      )}
                    </button>

                    <div className="divider">
                      <span>or</span>
                    </div>

                    <button 
                      type="button" 
                      onClick={handleGoogleAuth}
                      className="auth-btn google"
                    >
                      <svg className="google-icon" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Continue with Google
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* Toggle Overlay */}
          <div className={`overlay-container ${isSignUp ? 'sign-up-mode' : ''}`}>
            <div className="overlay">
              <div className="overlay-panel overlay-left">
                <div className="overlay-content">
                  <h2>Welcome Back!</h2>
                  <p>To keep connected with us please login with your personal info</p>
                  <button className="ghost-btn" onClick={toggleMode}>
                    Sign In
                  </button>
                </div>
              </div>
              <div className="overlay-panel overlay-right">
                <div className="overlay-content">
                  <h2>Hello, Friend!</h2>
                  <p>Enter your personal details and start your journey with us</p>
                  <button className="ghost-btn" onClick={toggleMode}>
                    Sign Up
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
