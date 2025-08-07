import React, { useState, useEffect } from 'react';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Prevent body scroll when menu is open
    document.body.style.overflow = !isMenuOpen ? 'hidden' : 'auto';
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    document.body.style.overflow = 'auto';
  };

  const handleLinkClick = (e) => {
    closeMenu();
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-brand">
          <div className="brand-logo">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L3 7L12 12L21 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 17L12 22L21 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 12L12 17L21 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2>Trip Buddy</h2>
        </div>
        
        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <div className="menu-overlay" onClick={closeMenu}></div>
          
          <div className="menu-content">

            <div className="nav-links">
              <a href="#home" className="navbar-link" onClick={handleLinkClick}>
                <span className="link-text">Home</span>
              </a>
              <a href="#features" className="navbar-link" onClick={handleLinkClick}>
                <span className="link-text">Features</span>
              </a>
              <a href="#how-it-works" className="navbar-link" onClick={handleLinkClick}>
                <span className="link-text">How It Works</span>
              </a>
              <a href="#benefits" className="navbar-link" onClick={handleLinkClick}>
                <span className="link-text">Benefits</span>
              </a>
              <a href="#testimonials" className="navbar-link" onClick={handleLinkClick}>
                <span className="link-text">Testimonials</span>
              </a>
              <a href="#contact" className="navbar-link" onClick={handleLinkClick}>
                <span className="link-text">Contact</span>
              </a>
            </div>

            <div className="navbar-buttons">
              <button className="btn-secondary" onClick={closeMenu}>
                <span>Sign In</span>
              </button>
              <button className="btn-primary" onClick={closeMenu}>
                <span>Get Started</span>
                <svg className="btn-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div 
          className={`navbar-toggle ${isMenuOpen ? 'active' : ''}`} 
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          <span className="toggle-bar"></span>
          <span className="toggle-bar"></span>
          <span className="toggle-bar"></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
