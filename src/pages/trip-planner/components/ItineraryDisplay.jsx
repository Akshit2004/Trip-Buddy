import React, { useState } from 'react';
import './ItineraryDisplay.css';

const ItineraryDisplay = ({ tripPlan, onPlanNew }) => {
  const [activeDay, setActiveDay] = useState(1);
  const [activeTab, setActiveTab] = useState('itinerary');

  if (!tripPlan) {
    return (
      <div className="itinerary-display">
        <div className="container">
          <div className="no-plan-message">
            <h2>No trip plan available</h2>
            <p>Please generate a trip plan first.</p>
          </div>
        </div>
      </div>
    );
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
          <div className="header-content">
            <h1>{tripTitle}</h1>
            <p className="overview">{overview}</p>
            {error && (
              <div className="error-notice">
                <div className="error-icon">⚠️</div>
                <p>{tripPlan.message}</p>
              </div>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button 
            className={`tab-btn ${activeTab === 'itinerary' ? 'active' : ''}`}
            onClick={() => setActiveTab('itinerary')}
          >
            <span className="tab-icon">📅</span>
            <span className="tab-text">Itinerary</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'places' ? 'active' : ''}`}
            onClick={() => setActiveTab('places')}
          >
            <span className="tab-icon">📍</span>
            <span className="tab-text">Places</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'budget' ? 'active' : ''}`}
            onClick={() => setActiveTab('budget')}
          >
            <span className="tab-icon">💰</span>
            <span className="tab-text">Budget</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'tips' ? 'active' : ''}`}
            onClick={() => setActiveTab('tips')}
          >
            <span className="tab-icon">💡</span>
            <span className="tab-text">Tips</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'itinerary' && (
            <div className="itinerary-section">
              <div className="section-header">
                <h2>📅 Your Daily Itinerary</h2>
                <p>Explore your trip day by day</p>
              </div>
              
              <div className="day-selector">
                {dayByDayItinerary?.map((day) => (
                  <button
                    key={day.day}
                    className={`day-btn ${activeDay === day.day ? 'active' : ''}`}
                    onClick={() => setActiveDay(day.day)}
                  >
                    <span className="day-number">Day {day.day}</span>
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
              <div className="section-header">
                <h2>📍 Recommended Places</h2>
                <p>Must-visit destinations for your trip</p>
              </div>
              <div className="places-grid">
                {recommendedPlaces?.map((place, index) => (
                  <PlaceCard key={index} place={place} />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'budget' && (
            <div className="budget-section">
              <div className="section-header">
                <h2>💰 Budget Overview</h2>
                <p>Estimated costs for your trip</p>
              </div>
              <BudgetBreakdown budgetData={budgetBreakdown} />
              
              <div className="transport-info">
                <h3>🚗 Transportation Information</h3>
                <div className="transport-grid">
                  <div className="transport-card">
                    <div className="transport-icon">✈️</div>
                    <h4>Getting There</h4>
                    <p>{transportationInfo?.gettingThere}</p>
                  </div>
                  <div className="transport-card">
                    <div className="transport-icon">🚌</div>
                    <h4>Local Transport</h4>
                    <p>{transportationInfo?.localTransport}</p>
                  </div>
                  <div className="transport-card">
                    <div className="transport-icon">💳</div>
                    <h4>Estimated Costs</h4>
                    <p>{transportationInfo?.costs}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tips' && (
            <div className="tips-section">
              <div className="section-header">
                <h2>💡 Travel Tips & Essentials</h2>
                <p>Everything you need to know for a perfect trip</p>
              </div>
              <div className="tips-grid">
                <div className="tips-card">
                  <div className="tips-header">
                    <div className="tips-icon">🎒</div>
                    <h3>Packing List</h3>
                  </div>
                  <ul className="tips-list">
                    {packingList?.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="tips-card">
                  <div className="tips-header">
                    <div className="tips-icon">🌟</div>
                    <h3>Local Tips</h3>
                  </div>
                  <ul className="tips-list">
                    {localTips?.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                </div>

                <div className="tips-card">
                  <div className="tips-header">
                    <div className="tips-icon">🌤️</div>
                    <h3>Best Time to Visit</h3>
                  </div>
                  <div className="best-time-content">
                    <p>{bestTimeToVisit}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button className="btn-secondary" onClick={onPlanNew}>
            <span className="btn-icon">🔄</span>
            Plan Another Trip
          </button>
          <button className="btn-primary" onClick={() => window.print()}>
            <span className="btn-icon">🖨️</span>
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
            <span className="btn-icon">📤</span>
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
    <div className="day-header">
      <h3>{dayData.title}</h3>
      <p className="day-description">{dayData.description}</p>
    </div>
    
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
              <div className="detail-item">
                <span className="detail-icon">📍</span>
                <span className="detail-text">{activity.location}</span>
              </div>
              <div className="detail-item">
                <span className="detail-icon">💰</span>
                <span className="detail-text">{activity.estimatedCost}</span>
              </div>
            </div>
            {activity.tips && (
              <div className="activity-tips">
                <span className="tip-icon">💡</span>
                <span className="tip-text">{activity.tips}</span>
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
      <div className="place-detail">
        <span className="detail-icon">📍</span>
        <span className="detail-text">{place.location}</span>
      </div>
      <div className="place-detail">
        <span className="detail-icon">💰</span>
        <span className="detail-text">{place.estimatedCost}</span>
      </div>
      {place.rating && (
        <div className="place-detail">
          <span className="detail-icon">⭐</span>
          <span className="detail-text">{place.rating}/5</span>
        </div>
      )}
    </div>
    {place.tips && (
      <div className="place-tips">
        <span className="tip-icon">💡</span>
        <span className="tip-text">{place.tips}</span>
      </div>
    )}
  </div>
);

// Budget Breakdown Component
const BudgetBreakdown = ({ budgetData }) => {
  if (!budgetData) {
    return (
      <div className="budget-breakdown">
        <div className="no-budget-message">
          <span className="info-icon">ℹ️</span>
          <p>Budget information not available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="budget-breakdown">
      <div className="budget-summary">
        <div className="budget-card">
          <div className="budget-icon">💵</div>
          <div className="budget-info">
            <h3>Total Estimated Cost</h3>
            <span className="total-amount">{budgetData.total}</span>
          </div>
        </div>
        <div className="budget-card">
          <div className="budget-icon">📊</div>
          <div className="budget-info">
            <h4>Daily Average</h4>
            <span className="daily-amount">{budgetData.daily}</span>
          </div>
        </div>
      </div>

      {budgetData.breakdown && (
        <div className="budget-categories">
          <h3>💰 Cost Breakdown</h3>
          <div className="category-grid">
            {Object.entries(budgetData.breakdown).map(([category, cost]) => (
              <div key={category} className="category-item">
                <div className="category-header">
                  <span className="category-icon">
                    {category === 'accommodation' && '🏨'}
                    {category === 'food' && '🍽️'}
                    {category === 'activities' && '🎯'}
                    {category === 'transport' && '🚗'}
                    {!['accommodation', 'food', 'activities', 'transport'].includes(category) && '💳'}
                  </span>
                  <span className="category-name">
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </span>
                </div>
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
