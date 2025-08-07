import React from 'react';
import './LandingPage.css';

const Hero = () => (
  <section className="hero" id="home">
    <div className="hero-container">
      <div className="hero-content">
        <div className="hero-text">
          <h1>Plan Your Perfect Trip with AI Intelligence</h1>
          <p>
            Discover personalized travel experiences with our AI-powered trip planner. 
            From hidden gems to popular destinations, we create itineraries tailored just for you.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary-large">Start Planning</button>
            <button className="btn-secondary-large">Watch Demo</button>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <h3>50,000+</h3>
              <p>Trips Planned</p>
            </div>
            <div className="stat">
              <h3>98%</h3>
              <p>Satisfaction Rate</p>
            </div>
            <div className="stat">
              <h3>150+</h3>
              <p>Countries Covered</p>
            </div>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-card">
            <div className="card-content">
              <h4>🗺️ Your AI Trip Assistant</h4>
              <p>Creating personalized itinerary...</p>
              <div className="progress-bar">
                <div className="progress"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Hero;
