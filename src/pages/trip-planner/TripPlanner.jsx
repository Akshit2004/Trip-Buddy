import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

import './TripPlanner.css';
import TripyBubble from './components/TripyBubble';
import TripyHeader from './components/TripyHeader';
import TripyMessages from './components/TripyMessages';
import TripyInput from './components/TripyInput';
import TripyProgress from './components/TripyProgress';

const TripPlanner = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState('greeting');
  const [tripData, setTripData] = useState({
    destination: '',
    budget: '',
    duration: '',
    interests: [],
    travelers: ''
  });
  const messagesEndRef = useRef(null);

  // Initialize Gemini AI
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

  useEffect(() => {
    // Initial greeting
    setMessages([
      {
        type: 'ai',
        content: "Hello, I'm Tripy, your intelligent travel companion. I'm here to help you plan the perfect trip. Where would you like to explore?",
        timestamp: new Date()
      }
    ]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const generateAIResponse = async (userInput) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      let prompt = '';
      
      switch (currentStep) {
        case 'greeting':
          prompt = `You are Tripy, an AI travel assistant. The user wants to travel to: "${userInput}". 
          Provide a brief, enthusiastic response about their destination choice and ask about their budget range. 
          Keep it conversational and like a friendly, futuristic AI assistant. Keep response under 100 words.`;
          setTripData(prev => ({ ...prev, destination: userInput }));
          setCurrentStep('budget');
          break;
        
        case 'budget':
          prompt = `The user's budget is: "${userInput}". Acknowledge their budget and ask about the duration of their trip (how many days). 
          Be encouraging about what they can do within their budget. Keep response under 80 words.`;
          setTripData(prev => ({ ...prev, budget: userInput }));
          setCurrentStep('duration');
          break;
        
        case 'duration':
          prompt = `The user wants to travel for: "${userInput}". Acknowledge the duration and ask about their interests 
          (adventure, culture, food, nightlife, nature, history, etc.). Keep the Tripy personality. Keep response under 80 words.`;
          setTripData(prev => ({ ...prev, duration: userInput }));
          setCurrentStep('interests');
          break;
        
        case 'interests':
          prompt = `The user's interests are: "${userInput}". Ask about the number of travelers (solo, couple, family, friends group). Keep response under 60 words.`;
          setTripData(prev => ({ ...prev, interests: userInput.split(',').map(i => i.trim()) }));
          setCurrentStep('travelers');
          break;
        
        case 'travelers':
          setTripData(prev => ({ ...prev, travelers: userInput }));
          setCurrentStep('planning');
          prompt = `Based on this travel information:
          - Destination: ${tripData.destination}
          - Budget: ${tripData.budget}
          - Duration: ${tripData.duration}
          - Interests: ${tripData.interests.join(', ')}
          - Travelers: ${userInput}
          
          Create a comprehensive travel plan with:
          1. Best time to visit
          2. Recommended accommodations within budget
          3. Must-visit attractions based on interests
          4. Local cuisine recommendations
          5. Daily itinerary suggestions
          6. Travel tips specific to the destination
          
          Present this as Tripy would - organized, detailed, and personalized. Keep it concise but informative.`;
          break;
        
        default:
          prompt = `Continue the conversation as Tripy, the AI travel assistant. Respond to: "${userInput}" 
          in the context of travel planning for ${tripData.destination}. Keep response under 150 words.`;
      }

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating AI response:', error);
      
      // Handle quota exceeded error specifically
      if (error.message?.includes('429') || error.message?.includes('quota')) {
        return "I'm currently experiencing high demand. Please wait a moment before sending another message. You can also try refreshing the page or coming back in a few minutes.";
      }
      
      // Handle other API errors
      if (error.message?.includes('API key')) {
        return "There seems to be an issue with the API configuration. Please check your API key setup.";
      }
      
      return "I apologize, but I'm experiencing some technical difficulties. Please try again in a moment.";
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const aiResponse = await generateAIResponse(inputValue);
      
      const aiMessage = {
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="trip-planner">
      {/* Animated Background */}
      <div className="jarvis-background">
        <div className="grid-overlay"></div>
        <div className="energy-particles"></div>
      </div>

      {/* Floating Liquid Bubble */}
      <TripyBubble />

      {/* Chat Interface */}
      <div className="chat-container">
        <TripyHeader />
        <TripyMessages messages={messages} isLoading={isLoading} messagesEndRef={messagesEndRef} />
        <TripyInput
          inputValue={inputValue}
          setInputValue={setInputValue}
          handleKeyPress={handleKeyPress}
          handleSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </div>

      {/* Progress Indicator */}
      <TripyProgress currentStep={currentStep} />
    </div>
  );
};

export default TripPlanner;
