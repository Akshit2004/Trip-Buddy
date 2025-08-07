import React from 'react';

const TripyInput = ({ inputValue, setInputValue, handleKeyPress, handleSendMessage, isLoading }) => (
  <div className="input-container">
    <div className="input-wrapper">
      <textarea
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Describe your travel plans to Tripy..."
        className="message-input"
        rows="1"
        disabled={isLoading}
      />
      <button 
        onClick={handleSendMessage} 
        className="send-button"
        disabled={isLoading || !inputValue.trim()}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path 
            d="M22 2L11 13L2 22L22 2Z" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <path 
            d="M22 2L15 9" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  </div>
);

export default TripyInput;
