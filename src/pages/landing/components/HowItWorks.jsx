import React from 'react';
import '../LandingPage.css';

const HowItWorks = () => (
  <section className="how-it-works" id="how-it-works">
    <div className="container">
      <div className="works-header">
        <h2>From Idea to Itinerary</h2>
        <p>See how Trip Buddy AI transforms your travel dreams into reality</p>
      </div>
      
      <div className="process-flow">
        <div className="flow-step" data-step="1">
          <div className="step-visual">
            <div className="phone-frame">
              <div className="step-screen">
                <div className="input-simulation">
                  <div className="input-field active">
                    <span className="cursor">|</span>
                    Where to? Tokyo, Japan
                  </div>
                  <div className="input-field">
                    Budget: $3000
                  </div>
                  <div className="input-field">
                    Dates: Mar 15-22
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="step-content">
            <div className="step-number">01</div>
            <h3>Tell us what you want</h3>
            <p>Just type naturally - destination, budget, dates, and any preferences. Our AI understands context like a human travel agent.</p>
            <div className="step-features">
              <span className="feature-tag">✨ Natural Language</span>
              <span className="feature-tag">🎯 Context Aware</span>
            </div>
          </div>
        </div>
        
        <div className="flow-connector">
          <div className="connector-line"></div>
          <div className="connector-icon">⚡</div>
        </div>
        
        <div className="flow-step" data-step="2">
          <div className="step-visual">
            <div className="ai-processing">
              <div className="processing-header">AI Working...</div>
              <div className="processing-items">
                <div className="process-item">🔍 Analyzing 2.5M data points</div>
                <div className="process-item">📊 Comparing 500+ hotels</div>
                <div className="process-item">🗺️ Optimizing routes</div>
                <div className="process-item">💰 Finding best deals</div>
              </div>
              <div className="processing-bar">
                <div className="processing-fill"></div>
              </div>
            </div>
          </div>
          <div className="step-content">
            <div className="step-number">02</div>
            <h3>AI creates your perfect plan</h3>
            <p>Our AI analyzes millions of data points, reviews, and real-time information to craft your personalized itinerary in under 30 seconds.</p>
            <div className="step-features">
              <span className="feature-tag">🧠 Deep Learning</span>
              <span className="feature-tag">⚡ 30 Seconds</span>
            </div>
          </div>
        </div>
        
        <div className="flow-connector">
          <div className="connector-line"></div>
          <div className="connector-icon">🎉</div>
        </div>
        
        <div className="flow-step" data-step="3">
          <div className="step-visual">
            <div className="result-preview">
              <div className="itinerary-card">
                <div className="day-plan">
                  <div className="day-header">Day 1 - Tokyo</div>
                  <div className="activities">
                    <div className="activity">🏮 Senso-ji Temple</div>
                    <div className="activity">🍜 Ramen Tasting</div>
                    <div className="activity">🏙️ Tokyo Skytree</div>
                  </div>
                </div>
                <div className="quick-stats">
                  <span>📍 12 places</span>
                  <span>💰 $2,850 total</span>
                  <span>⭐ 4.8 avg rating</span>
                </div>
              </div>
            </div>
          </div>
          <div className="step-content">
            <div className="step-number">03</div>
            <h3>Get your complete itinerary</h3>
            <p>Receive a detailed day-by-day plan with restaurants, activities, and hidden gems. Modify anything with a single click.</p>
            <div className="step-features">
              <span className="feature-tag">📱 Mobile Ready</span>
              <span className="feature-tag">🔄 Fully Editable</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="demo-cta">
        <button className="demo-button">
          <span>Try it yourself</span>
          <span className="demo-icon">→</span>
        </button>
        <p className="demo-note">See the magic happen in real-time</p>
      </div>
    </div>
  </section>
);

export default HowItWorks;
