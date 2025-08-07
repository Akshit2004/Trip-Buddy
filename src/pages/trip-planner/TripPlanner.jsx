import React, { useState } from 'react';
import './TripPlanner.css';
import ItineraryDisplay from './components/ItineraryDisplay';
import geminiService from '../../services/geminiService';

const TripPlanner = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    duration: 3,
    budget: '',
    companions: '',
    activities: [],
    additionalPreferences: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState(null);

  const totalSteps = 7;

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Validate required fields
      if (!formData.destination || !formData.budget || !formData.companions) {
        alert('Please fill in all required fields: destination, budget, and travel companions.');
        setIsLoading(false);
        return;
      }

      // Generate trip plan using Gemini AI
      console.log('Generating trip plan with data:', formData);
      const tripPlan = await geminiService.generateTripPlan(formData);
      console.log('Generated trip plan:', tripPlan);
      
      setGeneratedPlan(tripPlan);
    } catch (error) {
      console.error('Error generating trip plan:', error);
      alert('Sorry, we encountered an error generating your trip plan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <DestinationStep formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <DateStep formData={formData} updateFormData={updateFormData} />;
      case 3:
        return <DurationStep formData={formData} updateFormData={updateFormData} />;
      case 4:
        return <BudgetStep formData={formData} updateFormData={updateFormData} />;
      case 5:
        return <CompanionStep formData={formData} updateFormData={updateFormData} />;
      case 6:
        return <ActivityStep formData={formData} updateFormData={updateFormData} />;
      case 7:
        return <ReviewStep formData={formData} updateFormData={updateFormData} />;
      default:
        return null;
    }
  };

  if (generatedPlan) {
    return (
      <ItineraryDisplay 
        tripPlan={generatedPlan} 
        onPlanNew={() => {
          setGeneratedPlan(null);
          setCurrentStep(1);
          setFormData({
            destination: '',
            startDate: '',
            endDate: '',
            duration: 3,
            budget: '',
            companions: '',
            activities: [],
            additionalPreferences: ''
          });
        }}
      />
    );
  }

  return (
    <div className="trip-planner">
      <div className="container">
        <div className="planner-header">
          <h1>Tell us your travel preferences</h1>
          <p>Just provide some basic information, and our trip planner will generate a customized itinerary based on your preferences.</p>
        </div>

        <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />

        <div className="form-container">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              {renderCurrentStep()}
              
              <div className="form-navigation">
                {currentStep > 1 && (
                  <button 
                    className="btn-secondary" 
                    onClick={prevStep}
                  >
                    Previous
                  </button>
                )}
                
                {currentStep < totalSteps ? (
                  <button 
                    className="btn-primary" 
                    onClick={nextStep}
                  >
                    Next
                  </button>
                ) : (
                  <button 
                    className="btn-primary" 
                    onClick={handleSubmit}
                  >
                    Generate My Trip Plan
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Placeholder components - will be implemented next
const DestinationStep = ({ formData, updateFormData }) => (
  <div className="form-step">
    <h2>What is destination of choice?</h2>
    <input
      type="text"
      placeholder="Enter destination"
      value={formData.destination}
      onChange={(e) => updateFormData('destination', e.target.value)}
      className="destination-input"
    />
  </div>
);

const DateStep = ({ formData, updateFormData }) => (
  <div className="form-step">
    <h2>When are you planning to travel?</h2>
    <div className="date-inputs">
      <input
        type="date"
        value={formData.startDate}
        onChange={(e) => updateFormData('startDate', e.target.value)}
        className="date-input"
      />
      <input
        type="date"
        value={formData.endDate}
        onChange={(e) => updateFormData('endDate', e.target.value)}
        className="date-input"
      />
    </div>
  </div>
);

const DurationStep = ({ formData, updateFormData }) => (
  <div className="form-step">
    <h2>How many days are you planning to travel?</h2>
    <div className="duration-selector">
      <span>Day</span>
      <div className="counter">
        <button 
          onClick={() => updateFormData('duration', Math.max(1, formData.duration - 1))}
          className="counter-btn"
        >
          -
        </button>
        <span className="counter-value">{formData.duration}</span>
        <button 
          onClick={() => updateFormData('duration', formData.duration + 1)}
          className="counter-btn"
        >
          +
        </button>
      </div>
    </div>
  </div>
);

const BudgetStep = ({ formData, updateFormData }) => (
  <div className="form-step">
    <h2>What is Your Budget?</h2>
    <p className="budget-description">The budget is exclusively allocated for activities and dining purposes.</p>
    <div className="budget-options">
      {['Low', 'Medium', 'High'].map(budget => (
        <div 
          key={budget}
          className={`budget-card ${formData.budget === budget ? 'selected' : ''}`}
          onClick={() => updateFormData('budget', budget)}
        >
          <div className="budget-icon">💰</div>
          <h3>{budget}</h3>
          <p>
            {budget === 'Low' && '0 - 1000 USD'}
            {budget === 'Medium' && '1000 - 2500 USD'}
            {budget === 'High' && '2500+ USD'}
          </p>
        </div>
      ))}
    </div>
  </div>
);

const CompanionStep = ({ formData, updateFormData }) => (
  <div className="form-step">
    <h2>Who do you plan on traveling with on your next adventure?</h2>
    <div className="companion-options">
      {[
        { value: 'Solo', icon: '👤' },
        { value: 'Couple', icon: '👫' },
        { value: 'Family', icon: '👨‍👩‍👧‍👦' },
        { value: 'Friends', icon: '👥' }
      ].map(companion => (
        <div 
          key={companion.value}
          className={`companion-card ${formData.companions === companion.value ? 'selected' : ''}`}
          onClick={() => updateFormData('companions', companion.value)}
        >
          <div className="companion-icon">{companion.icon}</div>
          <h3>{companion.value}</h3>
        </div>
      ))}
    </div>
  </div>
);

const ActivityStep = ({ formData, updateFormData }) => {
  const activities = [
    { name: 'Beaches', icon: '🏖️' },
    { name: 'City sightseeing', icon: '🏛️' },
    { name: 'Outdoor adventures', icon: '🏔️' },
    { name: 'Festivals/events', icon: '🎭' },
    { name: 'Food exploration', icon: '🍜' },
    { name: 'Nightlife', icon: '🌃' },
    { name: 'Shopping', icon: '🛍️' },
    { name: 'Spa wellness', icon: '🧘‍♀️' }
  ];

  const toggleActivity = (activity) => {
    const currentActivities = formData.activities || [];
    const isSelected = currentActivities.includes(activity);
    
    if (isSelected) {
      updateFormData('activities', currentActivities.filter(a => a !== activity));
    } else {
      updateFormData('activities', [...currentActivities, activity]);
    }
  };

  return (
    <div className="form-step">
      <h2>Which activities are you interested in?</h2>
      <div className="activity-grid">
        {activities.map(activity => (
          <div 
            key={activity.name}
            className={`activity-card ${formData.activities?.includes(activity.name) ? 'selected' : ''}`}
            onClick={() => toggleActivity(activity.name)}
          >
            <div className="activity-icon">{activity.icon}</div>
            <h3>{activity.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

const ReviewStep = ({ formData, updateFormData }) => (
  <div className="form-step">
    <h2>Review Your Preferences</h2>
    <div className="review-summary">
      <div className="review-item">
        <strong>Destination:</strong> {formData.destination || 'Not specified'}
      </div>
      <div className="review-item">
        <strong>Duration:</strong> {formData.duration} days
      </div>
      <div className="review-item">
        <strong>Budget:</strong> {formData.budget || 'Not specified'}
      </div>
      <div className="review-item">
        <strong>Companions:</strong> {formData.companions || 'Not specified'}
      </div>
      <div className="review-item">
        <strong>Activities:</strong> {formData.activities?.join(', ') || 'None selected'}
      </div>
    </div>
    
    <div className="additional-preferences">
      <h3>Any additional preferences?</h3>
      <textarea
        placeholder="Tell us about any dietary restrictions, accessibility needs, or special requests..."
        value={formData.additionalPreferences}
        onChange={(e) => updateFormData('additionalPreferences', e.target.value)}
        className="preferences-textarea"
      />
    </div>
  </div>
);

const ProgressIndicator = ({ currentStep, totalSteps }) => (
  <div className="progress-indicator">
    <div className="progress-bar">
      <div 
        className="progress-fill"
        style={{ width: `${(currentStep / totalSteps) * 100}%` }}
      ></div>
    </div>
    <span className="progress-text">Step {currentStep} of {totalSteps}</span>
  </div>
);

const LoadingSpinner = () => (
  <div className="loading-spinner">
    <div className="spinner"></div>
    <h2>Generating your personalized trip plan...</h2>
    <p>Our AI is analyzing your preferences and creating the perfect itinerary for you!</p>
  </div>
);

export default TripPlanner;
