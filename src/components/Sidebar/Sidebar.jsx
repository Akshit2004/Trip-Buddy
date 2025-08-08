import React from 'react';
import './Sidebar.css';

const Sidebar = ({ isCollapsed, onToggle, onSignOut }) => {
  return (
    <>
      {/* Sidebar Toggle Button */}
      <button 
        className="sidebar-toggle"
        onClick={onToggle}
        title={isCollapsed ? "Show Menu" : "Hide Menu"}
      >
        {isCollapsed ? '☰' : '✕'}
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">Trip Buddy</div>
          <div className="sidebar-subtitle">AI Travel Planner</div>
        </div>
        
        <nav className="sidebar-nav">
          <button className="nav-item active">
            <span className="nav-icon">🗺️</span>
            <span>Trip Planner</span>
          </button>
          <button className="nav-item">
            <span className="nav-icon">📝</span>
            <span>My Trips</span>
          </button>
          <button className="nav-item">
            <span className="nav-icon">⭐</span>
            <span>Favorites</span>
          </button>
          <button className="nav-item">
            <span className="nav-icon">👤</span>
            <span>Profile</span>
          </button>
          <button className="nav-item">
            <span className="nav-icon">⚙️</span>
            <span>Settings</span>
          </button>
        </nav>
        
        <div className="sidebar-footer">
          <button className="sign-out-btn" onClick={onSignOut}>
            <span className="nav-icon">🚪</span>
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
