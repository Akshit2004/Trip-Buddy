// Sample mock data for testing the beautiful UI without API calls

export const mockTripPlan = {
  route: {
    legs: [
      {
        mode: 'flight',
        from: 'DEL',
        to: 'GOI',
        airline: 'IndiGo',
        flightNumber: '6E 2305',
        durationMinutes: 150,
        distanceKm: 1850,
        priceINR: 4500,
        departAt: '2025-10-25T08:00:00',
        arriveAt: '2025-10-25T10:30:00'
      },
      {
        mode: 'taxi',
        from: 'GOI',
        to: 'Goa Hotel',
        operator: 'Local Taxi',
        durationMinutes: 45,
        distanceKm: 35,
        priceINR: 800
      }
    ],
    totalDurationMinutes: 195,
    totalPriceINR: 5300
  },
  
  itinerary: [
    {
      date: '2025-10-25',
      location: 'Goa',
      activities: [
        'Arrive at Goa Airport and transfer to hotel',
        'Check-in at beachfront resort',
        'Relax at Baga Beach and enjoy sunset',
        'Dinner at beach shack - try Goan fish curry',
        'Evening stroll along the coastline'
      ],
      transfers: [],
      accommodation: 'Beach Paradise Resort, Baga',
      notes: 'Keep sunscreen handy! Goa can be quite sunny in October.'
    },
    {
      date: '2025-10-26',
      location: 'Goa',
      activities: [
        'Morning breakfast at hotel',
        'Visit Fort Aguada - historic Portuguese fort',
        'Water sports at Calangute Beach (jet ski, parasailing)',
        'Lunch at beach restaurant',
        'Explore Anjuna Flea Market',
        'Sunset cruise on Mandovi River',
        'Dinner at upscale Goan restaurant'
      ],
      transfers: [
        {
          mode: 'taxi',
          from: 'Hotel',
          to: 'Fort Aguada',
          duration: '20 min'
        }
      ],
      accommodation: 'Beach Paradise Resort, Baga',
      notes: 'Book water sports in advance for better deals!'
    },
    {
      date: '2025-10-27',
      location: 'Goa',
      activities: [
        'Early morning yoga session on the beach',
        'Visit Old Goa churches (Basilica of Bom Jesus)',
        'Lunch at authentic Goan restaurant',
        'Spa and relaxation at resort',
        'Beach volleyball and water activities',
        'Farewell dinner with live music'
      ],
      transfers: [],
      accommodation: 'Beach Paradise Resort, Baga',
      notes: 'Churches close early, visit before 4 PM'
    },
    {
      date: '2025-10-28',
      location: 'Departure',
      activities: [
        'Breakfast and hotel checkout',
        'Last-minute shopping at local markets',
        'Transfer to Goa Airport',
        'Flight back to Delhi'
      ],
      transfers: [
        {
          mode: 'taxi',
          from: 'Hotel',
          to: 'GOI Airport',
          duration: '45 min'
        },
        {
          mode: 'flight',
          from: 'GOI',
          to: 'DEL',
          duration: '2h 30min'
        }
      ],
      notes: 'Reach airport 2 hours before departure'
    }
  ],

  estimatedCosts: {
    transportTotalINR: 5300,
    accommodationPerNightINR: 3500,
    totalINR: 15800
  },

  alternatives: [
    {
      label: 'Train Journey Option',
      legs: 2,
      totalDurationMinutes: 1800,
      totalPriceINR: 2800
    },
    {
      label: 'Budget Flight + Bus',
      legs: 3,
      totalDurationMinutes: 240,
      totalPriceINR: 3500
    }
  ],

  notes: `Best time to visit Goa: October-March when weather is pleasant. 
- Pack light cotton clothes and beachwear
- Don't forget swimwear and sunscreen
- Carry a light jacket for evening boat rides
- Try local Goan cuisine - fish curry, vindaloo, and bebinca
- Rent a scooter for easy local travel`,

  recommendedBookings: {
    hotel: {
      name: 'Beach Paradise Resort',
      city: 'Baga, Goa',
      pricePerNightINR: 3500
    }
  }
}

export const mockOrigin = 'Delhi'
export const mockDestination = 'Goa'
