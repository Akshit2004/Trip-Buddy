import React, { useState } from 'react';
import './ItineraryDisplay.css';

const ItineraryDisplay = ({ tripPlan, onPlanNew }) => {
  const [activeDay, setActiveDay] = useState(1);
  const [activeTab, setActiveTab] = useState('itinerary');

  if (!tripPlan) {
    return <div>No trip plan available</div>;
  }

  const {
    tripTitle,
    overview,
    bestTimeToVisit,
    budgetBreakdown,
    dayByDayItinerary,
    recommendedPlaces,
    packingList,
    localTips,
    transportationInfo,
    error
  } = tripPlan;

  return (
    <div className="itinerary-display">
      <div className="container">
        {/* Header */}
        <div className="itinerary-header">
          <h1>{tripTitle}</h1>
          <p className="overview">{overview}</p>
          {error && (
            <div className="error-notice">
              <p>⚠️ {tripPlan.message}</p>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button 
            className={`tab-btn ${activeTab === 'itinerary' ? 'active' : ''}`}
            onClick={() => setActiveTab('itinerary')}
          >
            📅 Itinerary
          </button>
          <button 
            className={`tab-btn ${activeTab === 'places' ? 'active' : ''}`}
            onClick={() => setActiveTab('places')}
          >
            📍 Places
          </button>
          <button 
            className={`tab-btn ${activeTab === 'budget' ? 'active' : ''}`}
            onClick={() => setActiveTab('budget')}
          >
            💰 Budget
          </button>
          <button 
            className={`tab-btn ${activeTab === 'tips' ? 'active' : ''}`}
            onClick={() => setActiveTab('tips')}
          >
            💡 Tips
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'itinerary' && (
            <div className="itinerary-section">
              <div className="day-selector">
                {dayByDayItinerary?.map((day) => (
                  <button
                    key={day.day}
                    className={`day-btn ${activeDay === day.day ? 'active' : ''}`}
                    onClick={() => setActiveDay(day.day)}
                  >
                    Day {day.day}
                  </button>
                ))}
              </div>

              {dayByDayItinerary?.find(day => day.day === activeDay) && (
                <DayItinerary 
                  dayData={dayByDayItinerary.find(day => day.day === activeDay)} 
                />
              )}
            </div>
          )}

          {activeTab === 'places' && (
            <div className="places-section">
              <h2>Recommended Places</h2>
              <div className="places-grid">
                {recommendedPlaces?.map((place, index) => (
                  <PlaceCard key={index} place={place} />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'budget' && (
            <div className="budget-section">
              <h2>Budget Breakdown</h2>
              <BudgetBreakdown budgetData={budgetBreakdown} />
              
              <div className="transport-info">
                <h3>Transportation Information</h3>
                <div className="transport-card">
                  <div className="transport-item">
                    <h4>Getting There</h4>
                    <p>{transportationInfo?.gettingThere}</p>
                  </div>
                  <div className="transport-item">
                    <h4>Local Transport</h4>
                    <p>{transportationInfo?.localTransport}</p>
                  </div>
                  <div className="transport-item">
                    <h4>Estimated Costs</h4>
                    <p>{transportationInfo?.costs}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tips' && (
            <div className="tips-section">
              <div className="tips-grid">
                <div className="tips-card">
                  <h3>🎒 Packing List</h3>
                  <ul>
                    {packingList?.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="tips-card">
                  <h3>🌟 Local Tips</h3>
                  <ul>
                    {localTips?.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                </div>

                <div className="tips-card">
                  <h3>🌤️ Best Time to Visit</h3>
                  <p>{bestTimeToVisit}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button className="btn-secondary" onClick={onPlanNew}>
            Plan Another Trip
          </button>
          <button className="btn-primary" onClick={() => window.print()}>
            Print Itinerary
          </button>
          <button className="btn-primary" onClick={() => {
            navigator.share ? 
              navigator.share({
                title: tripTitle,
                text: overview,
                url: window.location.href
              }) :
              navigator.clipboard.writeText(window.location.href)
          }}>
            Share Trip
          </button>
        </div>
      </div>
    </div>
  );
};

// Day Itinerary Component
const DayItinerary = ({ dayData }) => (
  <div className="day-itinerary">
    <h2>{dayData.title}</h2>
    <p className="day-description">{dayData.description}</p>
    
    <div className="activities-timeline">
      {dayData.activities?.map((activity, index) => (
        <div key={index} className="activity-item">
          <div className="activity-time">
            <span className="time-badge">{activity.time}</span>
          </div>
          <div className="activity-content">
            <h4>{activity.activity}</h4>
            <p className="activity-description">{activity.description}</p>
            <div className="activity-details">
              <span className="location">📍 {activity.location}</span>
              <span className="cost">💰 {activity.estimatedCost}</span>
            </div>
            {activity.tips && (
              <div className="activity-tips">
                <strong>💡 Tip:</strong> {activity.tips}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Place Card Component
const PlaceCard = ({ place }) => (
  <div className="place-card">
    <div className="place-header">
      <h3>{place.name}</h3>
      <span className="place-category">{place.category}</span>
    </div>
    <p className="place-description">{place.description}</p>
    <div className="place-details">
      <div className="place-location">📍 {place.location}</div>
      <div className="place-cost">💰 {place.estimatedCost}</div>
      {place.rating && (
        <div className="place-rating">
          ⭐ {place.rating}/5
        </div>
      )}
    </div>
    {place.tips && (
      <div className="place-tips">
        <strong>Why recommended:</strong> {place.tips}
      </div>
    )}
  </div>
);

// Budget Breakdown Component
const BudgetBreakdown = ({ budgetData }) => {
  if (!budgetData) return <div>Budget information not available</div>;

  return (
    <div className="budget-breakdown">
      <div className="budget-summary">
        <div className="budget-total">
          <h3>Total Estimated Cost</h3>
          <span className="total-amount">{budgetData.total}</span>
        </div>
        <div className="budget-daily">
          <h4>Daily Average</h4>
          <span className="daily-amount">{budgetData.daily}</span>
        </div>
      </div>

      {budgetData.breakdown && (
        <div className="budget-categories">
          <h3>Cost Breakdown</h3>
          <div className="category-grid">
            {Object.entries(budgetData.breakdown).map(([category, cost]) => (
              <div key={category} className="category-item">
                <span className="category-name">
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </span>
                <span className="category-cost">{cost}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ItineraryDisplay;
