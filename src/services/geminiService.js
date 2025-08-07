import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export class GeminiService {
  constructor() {
    this.model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  /**
   * Generate a trip plan based on user preferences
   * @param {Object} formData - User preferences
   * @returns {Object} - Generated trip plan
   */
  async generateTripPlan(formData) {
    try {
      const prompt = this.createTripPlanPrompt(formData);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return this.parseAIResponse(text);
    } catch (error) {
      console.error('Error generating trip plan:', error);
      throw new Error('Failed to generate trip plan. Please try again.');
    }
  }

  /**
   * Create a detailed prompt for trip planning
   * @param {Object} formData - User preferences
   * @returns {string} - Formatted prompt
   */
  createTripPlanPrompt(formData) {
    const {
      destination,
      startDate,
      endDate,
      duration,
      budget,
      companions,
      activities,
      additionalPreferences
    } = formData;

    const budgetRange = this.getBudgetRange(budget);
    const activitiesText = activities?.length > 0 ? activities.join(', ') : 'general sightseeing';

    return `
Create a detailed travel itinerary with the following specifications:

**TRIP DETAILS:**
- Destination: ${destination}
- Duration: ${duration} days
- Travel dates: ${startDate} to ${endDate}
- Budget range: ${budgetRange}
- Travel companions: ${companions}
- Preferred activities: ${activitiesText}
- Additional preferences: ${additionalPreferences || 'None specified'}

**REQUIRED OUTPUT FORMAT (JSON):**
{
  "tripTitle": "Engaging trip title",
  "overview": "Brief 2-3 sentence trip overview",
  "bestTimeToVisit": "Information about weather and seasonal considerations",
  "budgetBreakdown": {
    "total": "Estimated total cost",
    "daily": "Average daily cost",
    "breakdown": {
      "accommodation": "Cost range",
      "food": "Cost range", 
      "activities": "Cost range",
      "transportation": "Cost range"
    }
  },
  "dayByDayItinerary": [
    {
      "day": 1,
      "title": "Day title",
      "description": "Day overview",
      "activities": [
        {
          "time": "Time slot",
          "activity": "Activity name",
          "description": "Activity description",
          "location": "Specific location",
          "estimatedCost": "Cost estimate",
          "tips": "Helpful tips"
        }
      ]
    }
  ],
  "recommendedPlaces": [
    {
      "name": "Place name",
      "category": "Restaurant/Attraction/Hotel/etc",
      "description": "Detailed description",
      "location": "Address or area",
      "estimatedCost": "Cost range",
      "rating": "Estimated rating out of 5",
      "tips": "Why it's recommended"
    }
  ],
  "packingList": [
    "Essential item 1",
    "Essential item 2"
  ],
  "localTips": [
    "Local tip 1",
    "Local tip 2"
  ],
  "transportationInfo": {
    "gettingThere": "How to reach the destination",
    "localTransport": "Getting around locally",
    "costs": "Transportation cost estimates"
  }
}

**IMPORTANT GUIDELINES:**
1. Make the itinerary realistic and achievable for ${duration} days
2. Consider the ${companions} group dynamic in recommendations
3. Focus heavily on ${activitiesText} based activities
4. Stay within the ${budgetRange} budget range
5. Include specific, actionable recommendations with real places when possible
6. Provide practical tips and local insights
7. Consider travel time between activities
8. Include meal recommendations throughout the day
9. Suggest backup indoor activities for bad weather
10. Return ONLY valid JSON without any markdown formatting or additional text

Generate a comprehensive, personalized itinerary now:`;
  }

  /**
   * Get budget range text based on selection
   * @param {string} budget - Budget selection
   * @returns {string} - Budget range description
   */
  getBudgetRange(budget) {
    switch (budget) {
      case 'Low':
        return '$0-1000 USD (budget-friendly options, local experiences)';
      case 'Medium':
        return '$1000-2500 USD (comfortable mid-range experiences)';
      case 'High':
        return '$2500+ USD (luxury experiences and premium options)';
      default:
        return 'Flexible budget (provide options across different price ranges)';
    }
  }

  /**
   * Parse AI response and handle potential formatting issues
   * @param {string} text - Raw AI response
   * @returns {Object} - Parsed trip plan
   */
  parseAIResponse(text) {
    try {
      // Clean the response - remove any markdown formatting
      let cleanText = text.trim();
      
      // Remove markdown code block markers if present
      if (cleanText.startsWith('```json')) {
        cleanText = cleanText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      
      // Parse JSON
      const parsedData = JSON.parse(cleanText);
      
      // Validate required fields
      if (!parsedData.tripTitle || !parsedData.dayByDayItinerary) {
        throw new Error('Invalid response format');
      }
      
      return parsedData;
    } catch (error) {
      console.error('Error parsing AI response:', error);
      
      // Return a fallback response if parsing fails
      return this.getFallbackResponse();
    }
  }

  /**
   * Provide a fallback response if AI fails
   * @returns {Object} - Fallback trip plan
   */
  getFallbackResponse() {
    return {
      tripTitle: "Custom Travel Experience",
      overview: "We're having trouble generating your custom itinerary right now, but here's a basic framework to get you started!",
      bestTimeToVisit: "Please check local weather and seasonal information for your destination.",
      budgetBreakdown: {
        total: "Varies by destination",
        daily: "Depends on your choices",
        breakdown: {
          accommodation: "Research local options",
          food: "Explore local cuisine",
          activities: "Based on your interests",
          transportation: "Check local transport"
        }
      },
      dayByDayItinerary: [
        {
          day: 1,
          title: "Arrival and Exploration",
          description: "Get oriented and start exploring",
          activities: [
            {
              time: "Morning",
              activity: "Arrive and check in",
              description: "Get settled at your accommodation",
              location: "Your chosen accommodation",
              estimatedCost: "Varies",
              tips: "Research transportation from airport/station"
            },
            {
              time: "Afternoon",
              activity: "Local area exploration",
              description: "Walk around your neighborhood",
              location: "Nearby area",
              estimatedCost: "Free",
              tips: "Look for local cafes and shops"
            }
          ]
        }
      ],
      recommendedPlaces: [
        {
          name: "Local visitor center",
          category: "Information",
          description: "Get maps and local recommendations",
          location: "City center",
          estimatedCost: "Free",
          rating: "N/A",
          tips: "Great first stop for insider tips"
        }
      ],
      packingList: [
        "Comfortable walking shoes",
        "Weather-appropriate clothing",
        "Travel documents",
        "Phone charger"
      ],
      localTips: [
        "Research local customs and etiquette",
        "Learn basic local phrases",
        "Keep emergency contacts handy"
      ],
      transportationInfo: {
        gettingThere: "Research flight/train/bus options",
        localTransport: "Look into public transit or ride-sharing",
        costs: "Varies by destination and transport choice"
      },
      error: true,
      message: "AI service temporarily unavailable. Please try again or contact support."
    };
  }

  /**
   * Generate place recommendations based on activities
   * @param {string} destination - Destination
   * @param {Array} activities - Selected activities
   * @returns {Object} - Place recommendations
   */
  async generatePlaceRecommendations(destination, activities) {
    try {
      const activitiesText = activities.join(', ');
      const prompt = `
Suggest 10 specific places in ${destination} for someone interested in: ${activitiesText}.

For each place, provide:
- Name
- Brief description
- Why it matches their interests
- Estimated visit duration
- Best time to visit

Return as JSON array with these fields: name, description, category, duration, bestTime, matchReason
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return JSON.parse(text.replace(/```json|```/g, '').trim());
    } catch (error) {
      console.error('Error generating place recommendations:', error);
      return [];
    }
  }
}

export default new GeminiService();
