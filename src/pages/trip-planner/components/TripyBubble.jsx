import React from 'react';
import '../../trip-planner/TripPlanner.css';

const TripyBubble = () => (
  <div className="liquid-bubble">
    <div className="bubble-core">
      <div className="pulse-ring"></div>
      <div className="pulse-ring delay-1"></div>
      <div className="pulse-ring delay-2"></div>
      <div className="inner-glow"></div>
    </div>
    <div className="bubble-text">Tripy</div>
  </div>
);

export default TripyBubble;
