import React from 'react';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Hero Section */}
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

      {/* Features Section */}
      <section className="features" id="features">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose Trip Buddy AI?</h2>
            <p>Experience the future of travel planning with our intelligent features</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🧠</div>
              <h3>AI-Powered Planning</h3>
              <p>Our advanced AI analyzes millions of travel data points to create personalized itineraries that match your preferences, budget, and travel style.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⏱️</div>
              <h3>Save 10+ Hours</h3>
              <p>Skip the endless research. Get a complete trip plan in minutes, not hours. More time for anticipation, less time for preparation.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Smart Budget Optimization</h3>
              <p>Maximize your travel budget with AI-driven recommendations for flights, hotels, and activities that offer the best value for money.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌍</div>
              <h3>Local Insights</h3>
              <p>Discover hidden gems and authentic experiences with recommendations from local experts and fellow travelers worldwide.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Real-time Updates</h3>
              <p>Stay informed with live updates on weather, traffic, attractions, and local events that might affect your travel plans.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Personalized Recommendations</h3>
              <p>Every suggestion is tailored to your interests, from adventure sports to cultural experiences, food preferences to accommodation style.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works" id="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2>How Trip Buddy AI Works</h2>
            <p>Planning your dream trip is just three simple steps away</p>
          </div>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Tell Us Your Preferences</h3>
                <p>Share your destination, dates, budget, and interests. Our AI understands your travel style through simple questions.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>AI Creates Your Itinerary</h3>
                <p>Our intelligent algorithm processes millions of data points to craft a personalized itinerary with optimal routes and timing.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Enjoy Your Perfect Trip</h3>
                <p>Access your itinerary on any device, make real-time adjustments, and enjoy a seamlessly planned adventure.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits">
        <div className="container">
          <div className="benefits-content">
            <div className="benefits-text">
              <h2>Transform Your Travel Planning Experience</h2>
              <div className="benefit-list">
                <div className="benefit-item">
                  <span className="benefit-icon">✅</span>
                  <div>
                    <h4>Eliminate Decision Fatigue</h4>
                    <p>Stop feeling overwhelmed by endless options. Our AI curates the best choices for you.</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <span className="benefit-icon">✅</span>
                  <div>
                    <h4>Avoid Tourist Traps</h4>
                    <p>Discover authentic experiences and avoid overpriced, overcrowded tourist attractions.</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <span className="benefit-icon">✅</span>
                  <div>
                    <h4>Flexible Itineraries</h4>
                    <p>Adapt your plans on the go with suggestions that adjust to your current location and preferences.</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <span className="benefit-icon">✅</span>
                  <div>
                    <h4>24/7 Travel Support</h4>
                    <p>Get instant help and recommendations whenever you need them during your journey.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="benefits-visual">
              <div className="benefit-card">
                <h4>Traditional Planning</h4>
                <ul>
                  <li>⏰ Hours of research</li>
                  <li>😰 Decision overwhelm</li>
                  <li>💸 Budget uncertainty</li>
                  <li>📱 Multiple apps needed</li>
                </ul>
              </div>
              <div className="vs">VS</div>
              <div className="benefit-card highlight">
                <h4>Trip Buddy AI</h4>
                <ul>
                  <li>⚡ Minutes to plan</li>
                  <li>🎯 Personalized choices</li>
                  <li>💰 Optimized budget</li>
                  <li>📱 All-in-one solution</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="container">
          <div className="section-header">
            <h2>What Travelers Say About Us</h2>
            <p>Join thousands of satisfied travelers who've discovered the joy of AI-planned trips</p>
          </div>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="stars">⭐⭐⭐⭐⭐</div>
              <p>"Trip Buddy AI planned our entire European vacation in 15 minutes. Every recommendation was spot-on, and we discovered places we never would have found on our own!"</p>
              <div className="testimonial-author">
                <strong>Sarah Johnson</strong>
                <span>Solo Traveler, San Francisco</span>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="stars">⭐⭐⭐⭐⭐</div>
              <p>"As a busy professional, I don't have time for extensive trip planning. This AI did all the work and gave us an amazing honeymoon itinerary that fit our budget perfectly."</p>
              <div className="testimonial-author">
                <strong>Mike Chen</strong>
                <span>Newlywed, New York</span>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="stars">⭐⭐⭐⭐⭐</div>
              <p>"The local insights were incredible! We ate at family-run restaurants and visited hidden beaches that made our trip truly authentic and memorable."</p>
              <div className="testimonial-author">
                <strong>Emma Rodriguez</strong>
                <span>Family Traveler, Miami</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Experience Effortless Travel Planning?</h2>
            <p>Join over 50,000 travelers who've discovered the future of trip planning. Start your adventure today!</p>
            <div className="cta-buttons">
              <button className="btn-primary-large">Start Planning for Free</button>
              <button className="btn-secondary-large">View Sample Itinerary</button>
            </div>
            <p className="cta-note">✨ No credit card required • 7-day free trial • Cancel anytime</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
