import React from 'react';
import '../LandingPage.css';

const Hero = () => (
  <section className="hero" id="home">
    <div className="hero-background">
      <div className="floating-elements">
        <div className="float-element float-1">✈️</div>
        <div className="float-element float-2">🗺️</div>
        <div className="float-element float-3">🎒</div>
        <div className="float-element float-4">📍</div>
        <div className="float-element float-5">🏖️</div>
      </div>
    </div>
    
    <div className="hero-container">
      <div className="hero-main">
        
        <h1 className="hero-title">
          <span className="title-line">Your Next Adventure</span>
          <span className="title-line highlight">Starts Here</span>
        </h1>
        
        <p className="hero-subtitle">
          Stop spending hours planning. Let our AI create the perfect itinerary in seconds.
          <br />
          <span className="accent-text">Smart. Personal. Effortless.</span>
        </p>
        
        <div className="hero-cta">
          <div className="cta-input-group">
            <input 
              type="text" 
              placeholder="Where do you want to go?" 
              className="destination-input"
            />
            <button className="cta-button">
              <span>Plan My Trip</span>
              <span className="button-icon">→</span>
            </button>
          </div>
          <p className="cta-note">Free to start</p>
        </div>
        
        <div className="hero-metrics">
          <div className="metric">
            <div className="metric-number">50K+</div>
            <div className="metric-label">Happy Travelers</div>
          </div>
          <div className="metric">
            <div className="metric-number">150+</div>
            <div className="metric-label">Countries</div>
          </div>
          <div className="metric">
            <div className="metric-number">4.9★</div>
            <div className="metric-label">User Rating</div>
          </div>
        </div>
      </div>
      
      <div className="hero-visual">
        <div className="phone-mockup">
          <div className="phone-screen">
            <div className="app-header">
              <div className="app-title">Trip Buddy AI</div>
              <div className="notification-dot"></div>
            </div>
            <div className="trip-card active">
              <div className="trip-location">🇯🇵 Tokyo, Japan</div>
              <div className="trip-date">March 15-22, 2024</div>
              <div className="trip-progress">
                <div className="progress-bar">
                  <div className="progress-fill"></div>
                </div>
                <span>Planning complete</span>
              </div>
            </div>
            <div className="quick-actions">
              <div className="action-item">📍 Day 1: Shibuya</div>
              <div className="action-item">🍱 Lunch at Tsukiji</div>
              <div className="action-item">🏯 Tokyo Skytree</div>
            </div>
          </div>
        </div>
        
        <div className="feature-bubbles">
          <div className="bubble bubble-1">
            <span className="bubble-icon">🧠</span>
            <span className="bubble-text">AI Planning</span>
          </div>
          <div className="bubble bubble-2">
            <span className="bubble-icon">💰</span>
            <span className="bubble-text">Budget Smart</span>
          </div>
          <div className="bubble bubble-3">
            <span className="bubble-icon">⚡</span>
            <span className="bubble-text">Instant Results</span>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Hero;
