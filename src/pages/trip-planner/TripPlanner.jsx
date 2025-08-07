import React, { useState } from 'react';
import './TripPlanner.css';
import ItineraryDisplay from './components/ItineraryDisplay';
import geminiService from '../../services/geminiService';

const TripPlanner = () => {
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
  const [errors, setErrors] = useState({});

  // Function to calculate end date from start date and duration
  const calculateEndDate = (startDate, duration) => {
    if (!startDate || !duration) return '';
    
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + duration - 1); // Subtract 1 because if you travel for 3 days starting Monday, you end on Wednesday
    
    return end.toISOString().split('T')[0];
  };

  const updateFormData = (field, value) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        [field]: value
      };
      
      // Auto-calculate end date when start date or duration changes
      if (field === 'startDate' || field === 'duration') {
        const startDate = field === 'startDate' ? value : prev.startDate;
        const duration = field === 'duration' ? value : prev.duration;
        newData.endDate = calculateEndDate(startDate, duration);
      }
      
      return newData;
    });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.destination.trim()) {
      newErrors.destination = 'Destination is required';
    }
    if (!formData.budget) {
      newErrors.budget = 'Budget selection is required';
    }
    if (!formData.companions) {
      newErrors.companions = 'Travel companion selection is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
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

  const resetForm = () => {
    setGeneratedPlan(null);
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
    setErrors({});
  };

  if (generatedPlan) {
    return (
      <ItineraryDisplay 
        tripPlan={generatedPlan} 
        onPlanNew={resetForm}
      />
    );
  }

  return (
    <div className="trip-planner">
      <div className="container">
        <div className="planner-header">
          <h1>Plan Your Perfect Trip</h1>
          <p>Fill out your travel preferences below, and our AI will create a personalized itinerary just for you.</p>
        </div>

        <div className="form-container">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="single-page-form">
              {/* Destination Section */}
              <div className="form-section">
                <div className="section-header">
                  <h2>🌍 Where do you want to go?</h2>
                  <p>Enter your dream destination</p>
                </div>
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="e.g., Paris, Tokyo, New York..."
                    value={formData.destination}
                    onChange={(e) => updateFormData('destination', e.target.value)}
                    className={`destination-input ${errors.destination ? 'error' : ''}`}
                  />
                  {errors.destination && <span className="error-message">{errors.destination}</span>}
                </div>
              </div>

              {/* Dates Section */}
              <div className="form-section">
                <div className="section-header">
                  <h2>📅 When are you traveling?</h2>
                  <p>Select your start date (optional)</p>
                </div>
                <div className="date-inputs">
                  <div className="input-group">
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => updateFormData('startDate', e.target.value)}
                      className="date-input"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  {formData.startDate && formData.endDate && (
                    <div className="input-group">
                      <label>End Date (Calculated)</label>
                      <div className="calculated-date">
                        {new Date(formData.endDate).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Duration Section */}
              <div className="form-section">
                <div className="section-header">
                  <h2>⏰ How long is your trip?</h2>
                  <p>Number of days you'll be traveling</p>
                </div>
                <div className="duration-selector">
                  <button 
                    onClick={() => updateFormData('duration', Math.max(1, formData.duration - 1))}
                    className="counter-btn"
                    type="button"
                  >
                    -
                  </button>
                  <div className="duration-display">
                    <span className="duration-number">{formData.duration}</span>
                    <span className="duration-text">Day{formData.duration !== 1 ? 's' : ''}</span>
                  </div>
                  <button 
                    onClick={() => updateFormData('duration', formData.duration + 1)}
                    className="counter-btn"
                    type="button"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Budget Section */}
              <div className="form-section">
                <div className="section-header">
                  <h2>💰 What's your budget?</h2>
                  <p>Budget for activities and dining</p>
                </div>
                <div className="budget-options">
                  {[
                    { value: 'Low', icon: '💵', range: '$0 - $1000', description: 'Budget-friendly options' },
                    { value: 'Medium', icon: '💸', range: '$1000 - $2500', description: 'Comfortable spending' },
                    { value: 'High', icon: '💎', range: '$2500+', description: 'Premium experiences' }
                  ].map(budget => (
                    <div 
                      key={budget.value}
                      className={`budget-card ${formData.budget === budget.value ? 'selected' : ''} ${errors.budget ? 'error-border' : ''}`}
                      onClick={() => updateFormData('budget', budget.value)}
                    >
                      <div className="budget-icon">{budget.icon}</div>
                      <h3>{budget.value}</h3>
                      <p className="budget-range">{budget.range}</p>
                      <p className="budget-desc">{budget.description}</p>
                    </div>
                  ))}
                </div>
                {errors.budget && <span className="error-message">{errors.budget}</span>}
              </div>

              {/* Companions Section */}
              <div className="form-section">
                <div className="section-header">
                  <h2>👥 Who's joining you?</h2>
                  <p>Select your travel companions</p>
                </div>
                <div className="companion-options">
                  {[
                    { value: 'Solo', icon: '🧳', description: 'Just me' },
                    { value: 'Couple', icon: '💕', description: 'Romantic getaway' },
                    { value: 'Family', icon: '👨‍👩‍👧‍👦', description: 'Family vacation' },
                    { value: 'Friends', icon: '🎉', description: 'Friends trip' }
                  ].map(companion => (
                    <div 
                      key={companion.value}
                      className={`companion-card ${formData.companions === companion.value ? 'selected' : ''} ${errors.companions ? 'error-border' : ''}`}
                      onClick={() => updateFormData('companions', companion.value)}
                    >
                      <div className="companion-icon">{companion.icon}</div>
                      <h3>{companion.value}</h3>
                      <p>{companion.description}</p>
                    </div>
                  ))}
                </div>
                {errors.companions && <span className="error-message">{errors.companions}</span>}
              </div>

              {/* Activities Section */}
              <div className="form-section">
                <div className="section-header">
                  <h2>🎯 What interests you?</h2>
                  <p>Select activities you'd like to experience (optional)</p>
                </div>
                <ActivitySelector formData={formData} updateFormData={updateFormData} />
              </div>

              {/* Additional Preferences */}
              <div className="form-section">
                <div className="section-header">
                  <h2>✨ Any special requests?</h2>
                  <p>Dietary restrictions, accessibility needs, or other preferences</p>
                </div>
                <textarea
                  placeholder="Tell us about any dietary restrictions, accessibility needs, or special requests..."
                  value={formData.additionalPreferences}
                  onChange={(e) => updateFormData('additionalPreferences', e.target.value)}
                  className="preferences-textarea"
                  rows="4"
                />
              </div>

              {/* Submit Button */}
              <div className="form-submit">
                <button 
                  className="btn-primary generate-btn"
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  <span className="btn-icon">🚀</span>
                  Generate My Perfect Trip
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Activity Selector Component
const ActivitySelector = ({ formData, updateFormData }) => {
  const activities = [
    { name: 'Beaches', icon: '🏖️', category: 'Relaxation' },
    { name: 'City sightseeing', icon: '🏛️', category: 'Culture' },
    { name: 'Outdoor adventures', icon: '🏔️', category: 'Adventure' },
    { name: 'Festivals/events', icon: '🎭', category: 'Entertainment' },
    { name: 'Food exploration', icon: '🍜', category: 'Culinary' },
    { name: 'Nightlife', icon: '🌃', category: 'Entertainment' },
    { name: 'Shopping', icon: '�️', category: 'Leisure' },
    { name: 'Spa wellness', icon: '🧘‍♀️', category: 'Relaxation' },
    { name: 'Museums', icon: '🖼️', category: 'Culture' },
    { name: 'Photography', icon: '📸', category: 'Creative' },
    { name: 'Wildlife', icon: '🦋', category: 'Nature' },
    { name: 'Water sports', icon: '🏄‍♂️', category: 'Adventure' }
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
    <div className="activity-grid">
      {activities.map(activity => (
        <div 
          key={activity.name}
          className={`activity-card ${formData.activities?.includes(activity.name) ? 'selected' : ''}`}
          onClick={() => toggleActivity(activity.name)}
        >
          <div className="activity-icon">{activity.icon}</div>
          <h4>{activity.name}</h4>
          <span className="activity-category">{activity.category}</span>
        </div>
      ))}
    </div>
  );
};

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="loading-spinner">
    <div className="spinner-container">
      <div className="spinner"></div>
      <div className="loading-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
    <div className="loading-content">
      <h2>Creating Your Dream Itinerary</h2>
      <p>Our AI is analyzing your preferences and crafting the perfect travel plan...</p>
      <div className="loading-steps">
        <div className="loading-step active">🧠 Analyzing preferences</div>
        <div className="loading-step">🌍 Finding destinations</div>
        <div className="loading-step">🗓️ Planning schedule</div>
        <div className="loading-step">✨ Adding special touches</div>
      </div>
    </div>
  </div>
);

export default TripPlanner;
