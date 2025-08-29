import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, orderBy, query, limit } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import '../LandingPage.css';

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [newFeedback, setNewFeedback] = useState({
    name: '',
    email: '',
    rating: 5,
    message: '',
    location: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Fetch feedbacks from Firestore
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const feedbacksQuery = query(
          collection(db, 'feedbacks'),
          orderBy('createdAt', 'desc'),
          limit(6)
        );
        const querySnapshot = await getDocs(feedbacksQuery);
        const feedbacksData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setFeedbacks(feedbacksData);
      } catch (error) {
        console.error('Error fetching feedbacks:', error);
      }
    };

    fetchFeedbacks();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const feedbackData = {
        ...newFeedback,
        createdAt: new Date(),
        approved: false, // Admin needs to approve before showing
      };

      await addDoc(collection(db, 'feedbacks'), feedbackData);
      
      // Reset form
      setNewFeedback({
        name: '',
        email: '',
        rating: 5,
        message: '',
        location: ''
      });
      setShowForm(false);
      
      alert('Thank you for your feedback! It will be reviewed and published soon.');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Error submitting feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate star rating display
  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  // Generate avatar based on name
  const generateAvatar = (name) => {
    const colors = ['#14b8a6', '#06d6a0', '#f59e0b', '#8b5cf6', '#ef4444', '#3b82f6'];
    const initial = name.charAt(0).toUpperCase();
    const color = colors[name.length % colors.length];
    
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='${color.replace('#', '%23')}'/%3E%3Ctext x='20' y='25' text-anchor='middle' fill='white' font-family='Arial' font-size='16'%3E${initial}%3C/text%3E%3C/svg%3E`;
  };

  return (
    <section className="feedback-section">
      <div className="container">
        <div className="feedback-header">
          <h2>What Our Users Say</h2>
          <p>Real feedback from real travelers</p>
        </div>
        
        <div className="feedback-content">
          {/* Feedback Display */}
          <div className="feedback-grid">
            {feedbacks.map((feedback, index) => (
              <div key={feedback.id} className={`feedback-card ${index % 2 === 0 ? 'left' : 'right'}`}>
                <div className="feedback-bubble">
                  <div className="feedback-rating">
                    <span className="stars">{renderStars(feedback.rating)}</span>
                  </div>
                  <p className="feedback-message">"{feedback.message}"</p>
                  <div className="feedback-author">
                    <img 
                      src={generateAvatar(feedback.name)} 
                      alt={feedback.name} 
                      className="author-avatar"
                    />
                    <div className="author-info">
                      <span className="author-name">{feedback.name}</span>
                      {feedback.location && (
                        <span className="author-location">📍 {feedback.location}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="feedback-cta">
            <button 
              className="feedback-toggle-btn"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? 'Cancel' : 'Share Your Experience'}
            </button>
          </div>

          {/* Feedback Form */}
          {showForm && (
            <div className="feedback-form-container">
              <form className="feedback-form" onSubmit={handleSubmit}>
                <h3>Share Your Experience</h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Name *</label>
                    <input
                      type="text"
                      id="name"
                      value={newFeedback.name}
                      onChange={(e) => setNewFeedback({...newFeedback, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                      type="email"
                      id="email"
                      value={newFeedback.email}
                      onChange={(e) => setNewFeedback({...newFeedback, email: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="location">Location</label>
                    <input
                      type="text"
                      id="location"
                      placeholder="e.g., New York, USA"
                      value={newFeedback.location}
                      onChange={(e) => setNewFeedback({...newFeedback, location: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="rating">Rating *</label>
                    <select
                      id="rating"
                      value={newFeedback.rating}
                      onChange={(e) => setNewFeedback({...newFeedback, rating: parseInt(e.target.value)})}
                    >
                      <option value={5}>5 Stars - Excellent</option>
                      <option value={4}>4 Stars - Very Good</option>
                      <option value={3}>3 Stars - Good</option>
                      <option value={2}>2 Stars - Fair</option>
                      <option value={1}>1 Star - Poor</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Your Feedback *</label>
                  <textarea
                    id="message"
                    rows="4"
                    placeholder="Tell us about your experience with Trip Buddy..."
                    value={newFeedback.message}
                    onChange={(e) => setNewFeedback({...newFeedback, message: e.target.value})}
                    required
                  />
                </div>

                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Feedback;
