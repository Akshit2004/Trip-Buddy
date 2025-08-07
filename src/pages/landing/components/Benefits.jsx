import React from 'react';
import '../LandingPage.css';

const Benefits = () => (
  <section className="benefits">
    <div className="container">
      <div className="benefits-header">
        <h2>Stop planning. Start traveling.</h2>
        <p>See why thousands choose AI over traditional trip planning</p>
      </div>
      
      <div className="comparison-table">
        <div className="comparison-header">
          <div className="method traditional">
            <h3>😩 Traditional Planning</h3>
            <p>The old, stressful way</p>
          </div>
          <div className="vs-divider">VS</div>
          <div className="method ai">
            <h3>🚀 Trip Buddy AI</h3>
            <p>The smart, effortless way</p>
          </div>
        </div>
        
        <div className="comparison-rows">
          <div className="comparison-row">
            <div className="row-label">Time Investment</div>
            <div className="traditional-cell">
              <span className="negative">10-20 hours</span>
              <p>Endless research and comparison</p>
            </div>
            <div className="ai-cell">
              <span className="positive">30 seconds</span>
              <p>AI does all the work instantly</p>
            </div>
          </div>
          
          <div className="comparison-row">
            <div className="row-label">Decision Making</div>
            <div className="traditional-cell">
              <span className="negative">Overwhelming</span>
              <p>Too many choices, analysis paralysis</p>
            </div>
            <div className="ai-cell">
              <span className="positive">Curated</span>
              <p>Perfect options tailored to you</p>
            </div>
          </div>
          
          <div className="comparison-row">
            <div className="row-label">Local Knowledge</div>
            <div className="traditional-cell">
              <span className="negative">Tourist traps</span>
              <p>Generic recommendations</p>
            </div>
            <div className="ai-cell">
              <span className="positive">Hidden gems</span>
              <p>Local insights and secrets</p>
            </div>
          </div>
          
          <div className="comparison-row">
            <div className="row-label">Budget Control</div>
            <div className="traditional-cell">
              <span className="negative">Guesswork</span>
              <p>Hope you don't overspend</p>
            </div>
            <div className="ai-cell">
              <span className="positive">Optimized</span>
              <p>Smart budget allocation</p>
            </div>
          </div>
          
          <div className="comparison-row">
            <div className="row-label">Flexibility</div>
            <div className="traditional-cell">
              <span className="negative">Rigid plans</span>
              <p>Hard to change once booked</p>
            </div>
            <div className="ai-cell">
              <span className="positive">Adaptive</span>
              <p>Real-time adjustments</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="benefits-showcase">
        <div className="showcase-item">
          <div className="showcase-icon">⏰</div>
          <div className="showcase-content">
            <h4>Save 15+ hours per trip</h4>
            <p>Spend time exploring, not planning</p>
          </div>
        </div>
        
        <div className="showcase-item">
          <div className="showcase-icon">💰</div>
          <div className="showcase-content">
            <h4>Save 20% on average</h4>
            <p>Smart deals and budget optimization</p>
          </div>
        </div>
        
        <div className="showcase-item">
          <div className="showcase-icon">🎯</div>
          <div class="showcase-content">
            <h4>100% personalized</h4>
            <p>Matches your exact preferences</p>
          </div>
        </div>
        
        <div className="showcase-item">
          <div className="showcase-icon">🌟</div>
          <div className="showcase-content">
            <h4>Discover the unexpected</h4>
            <p>Hidden gems and local experiences</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Benefits;
