import React from 'react';
import '../LandingPage.css';

const Testimonials = () => (
  <section className="testimonials">
    <div className="container">
      <div className="testimonials-header">
        <h2>Loved by travelers worldwide</h2>
        <p>Real stories from real travelers</p>
      </div>
      
      <div className="testimonials-showcase">
        <div className="testimonial-stats">
          <div className="stat-card">
            <div className="stat-number">4.9</div>
            <div className="stat-label">Average Rating</div>
            <div className="stat-stars">⭐⭐⭐⭐⭐</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-number">50K+</div>
            <div className="stat-label">Happy Travelers</div>
            <div className="stat-icon">😊</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-number">98%</div>
            <div className="stat-label">Would Recommend</div>
            <div className="stat-icon">👍</div>
          </div>
        </div>
        
        <div className="testimonials-feed">
          <div className="testimonial-row">
            <div className="testimonial-bubble left">
              <div className="bubble-content">
                <p>"Planned my entire Tokyo trip in 10 minutes. Found amazing local spots I never would have discovered!"</p>
                <div className="bubble-author">
                  <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='16' fill='%2314b8a6'/%3E%3Ctext x='16' y='20' text-anchor='middle' fill='white' font-family='Arial' font-size='14'%3ES%3C/text%3E%3C/svg%3E" alt="Sarah" />
                  <span>Sarah K.</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="testimonial-row">
            <div className="testimonial-bubble right">
              <div className="bubble-content">
                <p>"Saved me 15+ hours of research. The budget optimization was incredible - stayed under budget while doing everything I wanted!"</p>
                <div className="bubble-author">
                  <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='16' fill='%2306d6a0'/%3E%3Ctext x='16' y='20' text-anchor='middle' fill='white' font-family='Arial' font-size='14'%3EM%3C/text%3E%3C/svg%3E" alt="Mike" />
                  <span>Mike R.</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="testimonial-row">
            <div className="testimonial-bubble left">
              <div className="bubble-content">
                <p>"The AI understood our family needs perfectly. Kid-friendly restaurants, activities for all ages - it was like having a local friend plan our trip!"</p>
                <div className="bubble-author">
                  <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='16' fill='%23f59e0b'/%3E%3Ctext x='16' y='20' text-anchor='middle' fill='white' font-family='Arial' font-size='14'%3EL%3C/text%3E%3C/svg%3E" alt="Lisa" />
                  <span>Lisa M.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="testimonials-carousel">
          <div className="featured-testimonial">
            <div className="testimonial-content">
              <div className="quote-mark">"</div>
              <p>Trip Buddy AI completely changed how I travel. What used to take me weeks of planning now takes minutes. The recommendations are so personalized, it's like the AI knows me better than I know myself!</p>
              <div className="testimonial-footer">
                <div className="author-info">
                  <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Ccircle cx='24' cy='24' r='24' fill='%2314b8a6'/%3E%3Ctext x='24' y='28' text-anchor='middle' fill='white' font-family='Arial' font-size='18'%3EA%3C/text%3E%3C/svg%3E" alt="Alex" className="author-avatar" />
                  <div>
                    <div className="author-name">Alex Thompson</div>
                    <div className="author-title">Travel Blogger • 500K followers</div>
                  </div>
                </div>
                <div className="social-proof">
                  <div className="platform">📱 Instagram</div>
                  <div className="verification">✓ Verified Traveler</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Testimonials;
