import React from 'react';

const TripyProgress = ({ currentStep }) => (
  <div className="progress-container">
    <div className="progress-steps">
      <div className={`step ${currentStep === 'greeting' || currentStep === 'budget' || currentStep === 'duration' || currentStep === 'interests' || currentStep === 'travelers' || currentStep === 'planning' ? 'active' : ''}`}>
        <div className="step-number">1</div>
        <div className="step-label">Destination</div>
      </div>
      <div className={`step ${currentStep === 'budget' || currentStep === 'duration' || currentStep === 'interests' || currentStep === 'travelers' || currentStep === 'planning' ? 'active' : ''}`}>
        <div className="step-number">2</div>
        <div className="step-label">Budget</div>
      </div>
      <div className={`step ${currentStep === 'duration' || currentStep === 'interests' || currentStep === 'travelers' || currentStep === 'planning' ? 'active' : ''}`}>
        <div className="step-number">3</div>
        <div className="step-label">Duration</div>
      </div>
      <div className={`step ${currentStep === 'interests' || currentStep === 'travelers' || currentStep === 'planning' ? 'active' : ''}`}>
        <div className="step-number">4</div>
        <div className="step-label">Interests</div>
      </div>
      <div className={`step ${currentStep === 'travelers' || currentStep === 'planning' ? 'active' : ''}`}>
        <div className="step-number">5</div>
        <div className="step-label">Travelers</div>
      </div>
      <div className={`step ${currentStep === 'planning' ? 'active' : ''}`}>
        <div className="step-number">6</div>
        <div className="step-label">Plan Ready</div>
      </div>
    </div>
  </div>
);

export default TripyProgress;
