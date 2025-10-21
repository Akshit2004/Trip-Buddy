/**
 * History Service - Manages AI trip plans and manual bookings history
 * Data is stored in localStorage
 */

// Storage keys
const AI_TRIPS_KEY = 'aiTrips'
const MANUAL_BOOKINGS_KEY = 'manualBookings'

/**
 * Save an AI-generated trip plan to history
 * @param {Object} tripData - Trip plan data from AI planner
 * @returns {Object} - Success status and saved trip
 */
export function saveAITrip(tripData) {
  try {
    const trips = getAITrips()
    
    const newTrip = {
      id: generateId(),
      origin: tripData.origin,
      destination: tripData.destination,
      startDate: tripData.startDate,
      endDate: tripData.endDate,
      plan: tripData.plan,
      status: 'upcoming', // upcoming, completed, cancelled
      timestamp: new Date().toISOString(),
      ...tripData
    }
    
    trips.unshift(newTrip) // Add to beginning
    localStorage.setItem(AI_TRIPS_KEY, JSON.stringify(trips))
    
    return { success: true, trip: newTrip }
  } catch (error) {
    console.error('Failed to save AI trip:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Get all AI trips from history
 * @returns {Array} - Array of AI trip plans
 */
export function getAITrips() {
  try {
    const data = localStorage.getItem(AI_TRIPS_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Failed to load AI trips:', error)
    return []
  }
}

/**
 * Update AI trip status
 * @param {string} tripId - Trip ID
 * @param {string} status - New status (upcoming, completed, cancelled)
 */
export function updateAITripStatus(tripId, status) {
  try {
    const trips = getAITrips()
    const index = trips.findIndex(t => t.id === tripId)
    
    if (index !== -1) {
      trips[index].status = status
      localStorage.setItem(AI_TRIPS_KEY, JSON.stringify(trips))
      return { success: true, trip: trips[index] }
    }
    
    return { success: false, error: 'Trip not found' }
  } catch (error) {
    console.error('Failed to update trip status:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Delete an AI trip from history
 * @param {string} tripId - Trip ID to delete
 */
export function deleteAITrip(tripId) {
  try {
    const trips = getAITrips()
    const filtered = trips.filter(t => t.id !== tripId)
    localStorage.setItem(AI_TRIPS_KEY, JSON.stringify(filtered))
    return { success: true }
  } catch (error) {
    console.error('Failed to delete AI trip:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Save a manual booking to history
 * @param {string} type - Booking type (flight, train, hotel, taxi)
 * @param {Object} details - Booking details
 * @returns {Object} - Success status and saved booking
 */
export function saveManualBooking(type, details) {
  try {
    const bookings = getManualBookings()
    
    const newBooking = {
      id: generateId(),
      type: type.toLowerCase(),
      details: details,
      status: 'upcoming', // upcoming, completed, cancelled
      timestamp: new Date().toISOString(),
      bookingId: generateBookingId()
    }
    
    bookings.unshift(newBooking) // Add to beginning
    localStorage.setItem(MANUAL_BOOKINGS_KEY, JSON.stringify(bookings))
    
    return { success: true, booking: newBooking }
  } catch (error) {
    console.error('Failed to save manual booking:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Get all manual bookings from history
 * @param {string} type - Optional type filter (flight, train, hotel, taxi)
 * @returns {Array} - Array of manual bookings
 */
export function getManualBookings(type = null) {
  try {
    const data = localStorage.getItem(MANUAL_BOOKINGS_KEY)
    const bookings = data ? JSON.parse(data) : []
    
    if (type) {
      return bookings.filter(b => b.type === type.toLowerCase())
    }
    
    return bookings
  } catch (error) {
    console.error('Failed to load manual bookings:', error)
    return []
  }
}

/**
 * Update manual booking status
 * @param {string} bookingId - Booking ID
 * @param {string} status - New status (upcoming, completed, cancelled)
 */
export function updateBookingStatus(bookingId, status) {
  try {
    const bookings = getManualBookings()
    const index = bookings.findIndex(b => b.id === bookingId)
    
    if (index !== -1) {
      bookings[index].status = status
      localStorage.setItem(MANUAL_BOOKINGS_KEY, JSON.stringify(bookings))
      return { success: true, booking: bookings[index] }
    }
    
    return { success: false, error: 'Booking not found' }
  } catch (error) {
    console.error('Failed to update booking status:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Delete a manual booking from history
 * @param {string} bookingId - Booking ID to delete
 */
export function deleteManualBooking(bookingId) {
  try {
    const bookings = getManualBookings()
    const filtered = bookings.filter(b => b.id !== bookingId)
    localStorage.setItem(MANUAL_BOOKINGS_KEY, JSON.stringify(filtered))
    return { success: true }
  } catch (error) {
    console.error('Failed to delete manual booking:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Clear all history (both AI trips and manual bookings)
 */
export function clearAllHistory() {
  try {
    localStorage.removeItem(AI_TRIPS_KEY)
    localStorage.removeItem(MANUAL_BOOKINGS_KEY)
    return { success: true }
  } catch (error) {
    console.error('Failed to clear history:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Get statistics about bookings
 * @returns {Object} - Stats about bookings
 */
export function getBookingStats() {
  try {
    const aiTrips = getAITrips()
    const bookings = getManualBookings()
    
    return {
      totalAITrips: aiTrips.length,
      totalBookings: bookings.length,
      upcomingTrips: aiTrips.filter(t => t.status === 'upcoming').length,
      upcomingBookings: bookings.filter(b => b.status === 'upcoming').length,
      completedTrips: aiTrips.filter(t => t.status === 'completed').length,
      completedBookings: bookings.filter(b => b.status === 'completed').length,
      bookingsByType: {
        flights: bookings.filter(b => b.type === 'flight').length,
        trains: bookings.filter(b => b.type === 'train').length,
        hotels: bookings.filter(b => b.type === 'hotel').length,
        taxis: bookings.filter(b => b.type === 'taxi').length
      }
    }
  } catch (error) {
    console.error('Failed to get booking stats:', error)
    return null
  }
}

// Helper function to generate unique IDs
function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Helper function to generate booking IDs
function generateBookingId() {
  return `BK${Date.now().toString().slice(-8)}`
}

export default {
  saveAITrip,
  getAITrips,
  updateAITripStatus,
  deleteAITrip,
  saveManualBooking,
  getManualBookings,
  updateBookingStatus,
  deleteManualBooking,
  clearAllHistory,
  getBookingStats
}
