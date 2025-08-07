import React from 'react';

const TripyMessages = ({ messages, isLoading, messagesEndRef }) => (
  <div className="messages-container">
    {messages.map((message, index) => (
      <div key={index} className={`message ${message.type}`}>
        <div className="message-content">
          <div className="message-bubble">
            {message.content}
          </div>
          <div className="message-timestamp">
            {message.timestamp.toLocaleTimeString()}
          </div>
        </div>
      </div>
    ))}
    {isLoading && (
      <div className="message ai">
        <div className="message-content">
          <div className="message-bubble loading">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
            Tripy is thinking...
          </div>
        </div>
      </div>
    )}
    <div ref={messagesEndRef} />
  </div>
);

export default TripyMessages;
