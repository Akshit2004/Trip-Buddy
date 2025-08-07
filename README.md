# 🌟 Trip Buddy - AI-Powered Travel Planner

An intelligent trip planning application that uses Google Gemini AI 1.5 Flash to generate personalized travel itineraries based on user preferences.

## ✨ Features

### 🎯 Smart Preference Collection
- **Multi-step form** with intuitive navigation
- **Destination selection** with validation
- **Travel date picker** with date range selection
- **Duration counter** with +/- buttons
- **Budget selection** (Low/Medium/High) with visual cards
- **Travel companion options** (Solo/Couple/Family/Friends)
- **Activity interests** with multiple selection grid
- **Additional preferences** for special requests

### 🤖 AI-Powered Planning
- **Google Gemini AI 1.5 Flash** integration
- **Smart prompt engineering** for contextual recommendations
- **Comprehensive itinerary generation** with day-by-day breakdown
- **Budget breakdown** with cost estimates
- **Place recommendations** with ratings and descriptions
- **Local tips and insights** for better travel experience

### 📱 Beautiful User Interface
- **Modern responsive design** that works on all devices
- **Progress indicator** showing form completion
- **Loading animations** during AI processing
- **Tabbed interface** for easy navigation
- **Print functionality** for offline access
- **Share capabilities** for social sharing

### 📊 Comprehensive Results
- **Day-by-day itinerary** with timeline view
- **Activity details** with time, location, and costs
- **Recommended places** with categories and ratings
- **Budget breakdown** with cost analysis
- **Transportation information** for getting around
- **Packing lists** and local tips
- **Weather considerations** and best visit times

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Google Gemini AI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/trip-buddy.git
   cd trip-buddy
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file and add your API keys:
   ```env
   # Google Gemini AI Configuration
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   
   # Firebase Configuration (if using authentication)
   VITE_FIREBASE_API_KEY=your_firebase_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

4. **Get your Gemini API key**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy the key to your `.env` file

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   - Navigate to `http://localhost:5173`
   - Click on "Plan" in the navigation to access the trip planner

## 🎨 How It Works

### Step 1: Tell Us Your Preferences
Fill out the multi-step form with your travel preferences:
- Destination of choice
- Travel dates
- Trip duration
- Budget range
- Travel companions
- Activity interests
- Additional preferences

### Step 2: AI Processing
Our Google Gemini AI analyzes your preferences and generates:
- Personalized itinerary
- Activity recommendations
- Budget breakdown
- Local insights

### Step 3: Get Your Plan
Receive a comprehensive travel plan with:
- Day-by-day activities
- Recommended places
- Cost estimates
- Travel tips

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar/
│   └── footer/
├── pages/
│   ├── auth/
│   ├── landing/
│   └── trip-planner/
│       ├── TripPlanner.jsx       # Main trip planner component
│       ├── TripPlanner.css       # Styles for trip planner
│       └── components/
│           ├── ItineraryDisplay.jsx  # Results display
│           └── ItineraryDisplay.css  # Results styling
├── services/
│   └── geminiService.js          # AI integration service
├── firebase/
│   └── config.js                 # Firebase configuration
└── App.jsx                       # Main app component
```

## 🔧 Technologies Used

- **React 19** - Modern React with latest features
- **Vite** - Fast build tool and development server
- **Google Generative AI** - AI-powered trip planning
- **Firebase** - Authentication and hosting
- **CSS3** - Modern styling with gradients and animations
- **React Router** - Client-side routing

## 🎯 Key Components

### TripPlanner.jsx
Main component managing the multi-step form and state:
- Form data management
- Step navigation
- AI service integration
- Loading states

### GeminiService.js
Service handling AI integration:
- Prompt engineering
- API communication
- Response parsing
- Error handling

### ItineraryDisplay.jsx
Component for displaying generated travel plans:
- Tabbed interface
- Day-by-day itinerary
- Place recommendations
- Budget breakdown

## 🌟 AI Prompt Engineering

The application uses sophisticated prompt engineering to generate high-quality travel plans:

- **Structured prompts** with clear requirements
- **Context-aware recommendations** based on travel companions
- **Budget-conscious suggestions** within specified ranges
- **Activity-focused planning** based on user interests
- **JSON response formatting** for consistent parsing

## 🔒 Environment Variables

Create a `.env` file in the root directory:

```env
# Required for AI functionality
VITE_GEMINI_API_KEY=your_gemini_api_key

# Optional for Firebase features
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## 📱 Responsive Design

The application is fully responsive and works on:
- **Desktop computers** (1200px+)
- **Tablets** (768px - 1199px)
- **Mobile phones** (320px - 767px)

## 🎨 Design Features

- **Gradient backgrounds** for visual appeal
- **Card-based interface** for better organization
- **Smooth animations** and transitions
- **Visual progress indicators** for user guidance
- **Accessibility features** with proper ARIA labels
- **Print-friendly styles** for offline use

## 🚀 Future Enhancements

- **Map integration** for visual trip planning
- **Real-time pricing** from travel APIs
- **Weather integration** for destination conditions
- **User accounts** for saving multiple trips
- **Social sharing** with custom trip URLs
- **Collaborative planning** for group trips
- **Mobile app** with React Native
- **Offline functionality** with service workers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Google Gemini AI for powerful language capabilities
- React team for the amazing framework
- Vite for the fast development experience
- All contributors and testers

---

**Happy travels! 🌍✈️**
