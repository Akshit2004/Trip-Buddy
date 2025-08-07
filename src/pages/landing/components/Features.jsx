import React from 'react';
import '../LandingPage.css';

const Features = () => (
  <section className="features" id="features">
    <div className="container">
      <div className="features-header">
        <div className="section-badge">
          <span>✨ Powered by AI</span>
        </div>
        <h2>Everything you need for perfect trips</h2>
        <p>From idea to itinerary in seconds, not hours</p>
      </div>
      
      <div className="features-showcase">
        <div className="feature-main">
          <div className="feature-visual">
            <div className="demo-screen">
              <div className="demo-header">
                <div className="demo-dots">
                  <span></span><span></span><span></span>
                </div>
                <div className="demo-title">Trip Buddy AI</div>
              </div>
              <div className="demo-content">
                <div className="chat-message user">
                  "Plan a 5-day trip to Paris for $2000"
                </div>
                <div className="chat-message ai">
                  <div className="typing-indicator">
                    <span></span><span></span><span></span>
                  </div>
                </div>
                <div className="generated-plan">
                  <div className="plan-item">
                    <span className="day">Day 1</span>
                    <span className="activity">Louvre & Seine River</span>
                  </div>
                  <div className="plan-item">
                    <span className="day">Day 2</span>
                    <span className="activity">Eiffel Tower & Champs</span>
                  </div>
                  <div className="plan-item">
                    <span className="day">Day 3</span>
                    <span className="activity">Montmartre & Sacré-Cœur</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="feature-content">
            <h3>AI That Actually Understands Travel</h3>
            <p>Our AI doesn't just search the internet. It understands context, preferences, and creates itineraries that feel personally crafted for you.</p>
            
            <div className="feature-highlights">
              <div className="highlight">
                <span className="highlight-icon">🎯</span>
                <span>Personalized to your style</span>
              </div>
              <div className="highlight">
                <span className="highlight-icon">⚡</span>
                <span>Results in under 30 seconds</span>
              </div>
              <div className="highlight">
                <span className="highlight-icon">💡</span>
                <span>Suggests hidden gems</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="features-grid">
          <div className="feature-card compact">
            <div className="card-icon">💰</div>
            <h4>Smart Budget Control</h4>
            <p>Never overspend. Our AI optimizes every recommendation to fit your budget perfectly.</p>
          </div>
          
          <div className="feature-card compact">
            <div className="card-icon">🌍</div>
            <h4>Local Expert Knowledge</h4>
            <p>Tap into insights from locals and experienced travelers in every destination.</p>
          </div>
          
          <div className="feature-card compact">
            <div className="card-icon">📱</div>
            <h4>Live Trip Updates</h4>
            <p>Real-time adjustments for weather, crowds, and local events during your trip.</p>
          </div>
          
          <div className="feature-card compact">
            <div className="card-icon">🔄</div>
            <h4>Flexible Itineraries</h4>
            <p>Change your mind? Modify plans instantly with AI-powered re-planning.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Features;
