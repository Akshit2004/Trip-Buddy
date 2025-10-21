import React, { useState, useEffect } from 'react'
import TopNav from '../Components/TopNav'
import BottomNav from '../Components/BottomNav'
import FlightIcon from '../Components/icons/FlightIcon'
import TrainIcon from '../Components/icons/TrainIcon'
import HotelIcon from '../Components/icons/HotelIcon'
import TaxiIcon from '../Components/icons/TaxiIcon'

export default function History() {
  const [activeTab, setActiveTab] = useState('ai-trips')
  const [aiTrips, setAiTrips] = useState([])
  const [manualBookings, setManualBookings] = useState([])
  const [bookingFilter, setBookingFilter] = useState('all') // all, flights, trains, hotels, taxis
  const [selectedTrip, setSelectedTrip] = useState(null)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  useEffect(() => {
    // Load AI Trips from localStorage
    const storedTrips = localStorage.getItem('aiTrips')
    if (storedTrips) {
      try {
        setAiTrips(JSON.parse(storedTrips))
      } catch (e) {
        console.error('Failed to parse AI trips:', e)
      }
    }

    // Load Manual Bookings from localStorage
    const storedBookings = localStorage.getItem('manualBookings')
    if (storedBookings) {
      try {
        setManualBookings(JSON.parse(storedBookings))
      } catch (e) {
        console.error('Failed to parse manual bookings:', e)
      }
    }
  }, [])

  // Filter manual bookings by type
  const filteredBookings = bookingFilter === 'all' 
    ? manualBookings 
    : manualBookings.filter(b => b.type === bookingFilter)

  // Format date for display
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A'
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  // Get status badge styling
  const getStatusBadge = (status) => {
    const styles = {
      upcoming: 'bg-blue-100 text-blue-700',
      completed: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700'
    }
    return styles[status] || styles.upcoming
  }

  // Get icon for booking type
  const getBookingIcon = (type) => {
    switch (type) {
      case 'flight':
        return <FlightIcon className="w-5 h-5" />
      case 'train':
        return <TrainIcon className="w-5 h-5" />
      case 'hotel':
        return <HotelIcon className="w-5 h-5" />
      case 'taxi':
        return <TaxiIcon className="w-5 h-5" />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <TopNav title="History" />
      
      <div className="max-w-md mx-auto px-4 pb-28 pt-4">
        {/* Tab Selector */}
        <div className="flex bg-white rounded-2xl p-1.5 shadow-sm border border-slate-200 mb-6">
          <button
            onClick={() => setActiveTab('ai-trips')}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 ${
              activeTab === 'ai-trips'
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <span>🤖</span>
              AI Trips
            </span>
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 ${
              activeTab === 'bookings'
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <span>📋</span>
              Bookings
            </span>
          </button>
        </div>

        {/* AI Trips Tab Content */}
        {activeTab === 'ai-trips' && (
          <div className="space-y-4">
            {aiTrips.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center">
                  <span className="text-5xl">🗺️</span>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">No AI Trips Yet</h3>
                <p className="text-slate-500 text-sm mb-6">
                  Create your first AI-powered trip plan to see it here
                </p>
                <a
                  href="/trips"
                  className="inline-block bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Plan a Trip
                </a>
              </div>
            ) : (
              aiTrips.map((trip, index) => (
                <div
                  key={trip.id || index}
                  className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-all"
                >
                  {/* Trip Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">✈️</span>
                        <h3 className="font-bold text-slate-800 text-lg">
                          {trip.origin} → {trip.destination}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <i className="fas fa-calendar" aria-hidden="true" />
                        <span>{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(trip.status || 'upcoming')}`}>
                      {trip.status || 'Upcoming'}
                    </span>
                  </div>

                  {/* Trip Summary */}
                  {trip.plan && (
                    <div className="bg-slate-50 rounded-xl p-3 mb-3">
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        {trip.plan.estimatedCosts?.totalINR && (
                          <div>
                            <span className="text-slate-500 block mb-1">Total Cost</span>
                            <span className="font-bold text-slate-800">₹{trip.plan.estimatedCosts.totalINR.toLocaleString()}</span>
                          </div>
                        )}
                        {trip.plan.itinerary && (
                          <div>
                            <span className="text-slate-500 block mb-1">Duration</span>
                            <span className="font-bold text-slate-800">{trip.plan.itinerary.length} days</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        setSelectedTrip(trip)
                        setShowDetailModal(true)
                      }}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-2 px-4 rounded-xl text-sm font-semibold hover:shadow-lg transition-all"
                    >
                      View Details
                    </button>
                    <button className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all">
                      <i className="fas fa-share-alt" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Manual Bookings Tab Content */}
        {activeTab === 'bookings' && (
          <>
            {/* Booking Type Filter */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
              <button
                onClick={() => setBookingFilter('all')}
                className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                  bookingFilter === 'all'
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setBookingFilter('flight')}
                className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                  bookingFilter === 'flight'
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <FlightIcon className="w-4 h-4" />
                Flights
              </button>
              <button
                onClick={() => setBookingFilter('train')}
                className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                  bookingFilter === 'train'
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <TrainIcon className="w-4 h-4" />
                Trains
              </button>
              <button
                onClick={() => setBookingFilter('hotel')}
                className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                  bookingFilter === 'hotel'
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <HotelIcon className="w-4 h-4" />
                Hotels
              </button>
              <button
                onClick={() => setBookingFilter('taxi')}
                className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                  bookingFilter === 'taxi'
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <TaxiIcon className="w-4 h-4" />
                Taxis
              </button>
            </div>

            {/* Bookings List */}
            <div className="space-y-4">
              {filteredBookings.length === 0 ? (
                <div className="text-center py-16 px-4">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center">
                    <span className="text-5xl">📋</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">
                    {bookingFilter === 'all' ? 'No Bookings Yet' : `No ${bookingFilter.charAt(0).toUpperCase() + bookingFilter.slice(1)} Bookings`}
                  </h3>
                  <p className="text-slate-500 text-sm mb-6">
                    Start booking from the Home page to see your history here
                  </p>
                  <a
                    href="/home"
                    className="inline-block bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    Browse Options
                  </a>
                </div>
              ) : (
                filteredBookings.map((booking, index) => (
                  <div
                    key={booking.id || index}
                    className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-all"
                  >
                    {/* Booking Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center">
                          {getBookingIcon(booking.type)}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-800">
                            {booking.details?.name || booking.details?.airline || 'Booking'}
                          </h3>
                          <p className="text-xs text-slate-500 capitalize">{booking.type}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(booking.status || 'upcoming')}`}>
                        {booking.status || 'Upcoming'}
                      </span>
                    </div>

                    {/* Booking Details */}
                    <div className="bg-slate-50 rounded-xl p-3 mb-3">
                      {booking.type === 'flight' && (
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Route</span>
                            <span className="font-semibold text-slate-800">
                              {booking.details?.from} → {booking.details?.to}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Date</span>
                            <span className="font-semibold text-slate-800">
                              {formatDate(booking.details?.departAt)}
                            </span>
                          </div>
                          {booking.details?.priceINR && (
                            <div className="flex justify-between">
                              <span className="text-slate-500">Price</span>
                              <span className="font-bold text-blue-600">
                                ₹{booking.details.priceINR.toLocaleString()}
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {booking.type === 'train' && (
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Route</span>
                            <span className="font-semibold text-slate-800">
                              {booking.details?.from} → {booking.details?.to}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Train</span>
                            <span className="font-semibold text-slate-800">
                              {booking.details?.trainNumber} - {booking.details?.trainName}
                            </span>
                          </div>
                          {booking.details?.priceINR && (
                            <div className="flex justify-between">
                              <span className="text-slate-500">Price</span>
                              <span className="font-bold text-blue-600">
                                ₹{booking.details.priceINR.toLocaleString()}
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {booking.type === 'hotel' && (
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Location</span>
                            <span className="font-semibold text-slate-800">
                              {booking.details?.city}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Check-in</span>
                            <span className="font-semibold text-slate-800">
                              {formatDate(booking.details?.checkIn)}
                            </span>
                          </div>
                          {booking.details?.pricePerNightINR && (
                            <div className="flex justify-between">
                              <span className="text-slate-500">Per Night</span>
                              <span className="font-bold text-blue-600">
                                ₹{booking.details.pricePerNightINR.toLocaleString()}
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {booking.type === 'taxi' && (
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Service</span>
                            <span className="font-semibold text-slate-800">
                              {booking.details?.service}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Vehicle</span>
                            <span className="font-semibold text-slate-800">
                              {booking.details?.vehicleType}
                            </span>
                          </div>
                          {booking.details?.estimatedFareINR && (
                            <div className="flex justify-between">
                              <span className="text-slate-500">Fare</span>
                              <span className="font-bold text-blue-600">
                                ₹{booking.details.estimatedFareINR.toLocaleString()}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Booking Time */}
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                      <span>Booked on {formatDate(booking.timestamp)}</span>
                      {booking.bookingId && (
                        <span className="font-mono">#{booking.bookingId}</span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          setSelectedBooking(booking)
                          setShowDetailModal(true)
                        }}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-2 px-4 rounded-xl text-sm font-semibold hover:shadow-lg transition-all"
                      >
                        View Details
                      </button>
                      <button className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all">
                        <i className="fas fa-download" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-fadeIn">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => {
              setShowDetailModal(false)
              setSelectedTrip(null)
              setSelectedBooking(null)
            }}
          ></div>

          {/* Modal */}
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden z-[10000]">
            {/* AI Trip Details */}
            {selectedTrip && (
              <>
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                        <span className="text-2xl">✈️</span>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">{selectedTrip.origin} → {selectedTrip.destination}</h2>
                        <p className="text-sm text-white text-opacity-90">
                          AI-Generated Trip Plan
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setShowDetailModal(false)
                        setSelectedTrip(null)
                      }}
                      className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all"
                    >
                      <span className="text-xl">✕</span>
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                  {/* Trip Info */}
                  <div className="bg-slate-50 rounded-xl p-4 mb-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Travel Dates</p>
                        <p className="font-semibold text-slate-800">
                          {formatDate(selectedTrip.startDate)} - {formatDate(selectedTrip.endDate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Status</p>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(selectedTrip.status || 'upcoming')}`}>
                          {selectedTrip.status || 'Upcoming'}
                        </span>
                      </div>
                      {selectedTrip.plan?.itinerary && (
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Duration</p>
                          <p className="font-semibold text-slate-800">{selectedTrip.plan.itinerary.length} days</p>
                        </div>
                      )}
                      {selectedTrip.plan?.estimatedCosts?.totalINR && (
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Total Cost</p>
                          <p className="font-bold text-blue-600">₹{selectedTrip.plan.estimatedCosts.totalINR.toLocaleString()}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Itinerary */}
                  {selectedTrip.plan?.itinerary && selectedTrip.plan.itinerary.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                        <span>📅</span>
                        Day-by-Day Itinerary
                      </h3>
                      <div className="space-y-3">
                        {selectedTrip.plan.itinerary.map((day, index) => (
                          <div key={index} className="bg-white border border-slate-200 rounded-xl p-4">
                            <p className="font-bold text-slate-800 mb-2">
                              Day {index + 1}: {formatDate(day.date)}
                            </p>
                            {day.activities && day.activities.length > 0 && (
                              <ul className="space-y-1 text-sm text-slate-600">
                                {day.activities.map((activity, idx) => (
                                  <li key={idx} className="flex items-start gap-2">
                                    <span className="text-blue-500 mt-1">•</span>
                                    <span>{activity}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Route Details */}
                  {selectedTrip.plan?.route?.legs && selectedTrip.plan.route.legs.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                        <span>🛣️</span>
                        Travel Route
                      </h3>
                      <div className="space-y-2">
                        {selectedTrip.plan.route.legs.map((leg, index) => (
                          <div key={index} className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">
                                {leg.mode === 'flight' ? '✈️' : leg.mode === 'train' ? '🚆' : '🚌'}
                              </span>
                              <div className="flex-1">
                                <p className="font-semibold text-slate-800">
                                  {leg.from} → {leg.to}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {leg.airline || leg.trainName || leg.mode} 
                                  {leg.flightNumber && ` • ${leg.flightNumber}`}
                                  {leg.priceINR && ` • ₹${leg.priceINR.toLocaleString()}`}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  {selectedTrip.plan?.notes && (
                    <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                      <p className="text-xs font-bold text-amber-900 mb-2 flex items-center gap-2">
                        <span>📝</span>
                        Travel Tips
                      </p>
                      <p className="text-sm text-amber-800 whitespace-pre-wrap">{selectedTrip.plan.notes}</p>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Booking Details */}
            {selectedBooking && (
              <>
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                        {getBookingIcon(selectedBooking.type)}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold capitalize">{selectedBooking.type} Booking</h2>
                        <p className="text-sm text-white text-opacity-90">
                          Booking ID: #{selectedBooking.bookingId}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setShowDetailModal(false)
                        setSelectedBooking(null)
                      }}
                      className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all"
                    >
                      <span className="text-xl">✕</span>
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                  {/* Booking Status */}
                  <div className="bg-slate-50 rounded-xl p-4 mb-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Booked On</p>
                        <p className="font-semibold text-slate-800">{formatDate(selectedBooking.timestamp)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Status</p>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(selectedBooking.status || 'upcoming')}`}>
                          {selectedBooking.status || 'Upcoming'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Flight Details */}
                  {selectedBooking.type === 'flight' && (
                    <div className="space-y-4">
                      <div className="bg-white border border-slate-200 rounded-xl p-4">
                        <h3 className="font-bold text-slate-800 mb-3">Flight Information</h3>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Airline</span>
                            <span className="font-semibold text-slate-800">{selectedBooking.details?.airline}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Flight Number</span>
                            <span className="font-semibold text-slate-800">{selectedBooking.details?.flightNumber}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Route</span>
                            <span className="font-semibold text-slate-800">
                              {selectedBooking.details?.from} → {selectedBooking.details?.to}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Departure</span>
                            <span className="font-semibold text-slate-800">
                              {selectedBooking.details?.departAt ? new Date(selectedBooking.details.departAt).toLocaleString() : 'N/A'}
                            </span>
                          </div>
                          {selectedBooking.details?.arriveAt && (
                            <div className="flex justify-between">
                              <span className="text-slate-500">Arrival</span>
                              <span className="font-semibold text-slate-800">
                                {new Date(selectedBooking.details.arriveAt).toLocaleString()}
                              </span>
                            </div>
                          )}
                          {selectedBooking.details?.class && (
                            <div className="flex justify-between">
                              <span className="text-slate-500">Class</span>
                              <span className="font-semibold text-slate-800">{selectedBooking.details.class}</span>
                            </div>
                          )}
                          {selectedBooking.details?.priceINR && (
                            <div className="flex justify-between pt-3 border-t border-slate-200">
                              <span className="text-slate-700 font-semibold">Total Price</span>
                              <span className="font-bold text-blue-600 text-lg">
                                ₹{selectedBooking.details.priceINR.toLocaleString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Train Details */}
                  {selectedBooking.type === 'train' && (
                    <div className="space-y-4">
                      <div className="bg-white border border-slate-200 rounded-xl p-4">
                        <h3 className="font-bold text-slate-800 mb-3">Train Information</h3>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Train Name</span>
                            <span className="font-semibold text-slate-800">{selectedBooking.details?.trainName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Train Number</span>
                            <span className="font-semibold text-slate-800">{selectedBooking.details?.trainNumber}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Route</span>
                            <span className="font-semibold text-slate-800">
                              {selectedBooking.details?.from} → {selectedBooking.details?.to}
                            </span>
                          </div>
                          {selectedBooking.details?.departAt && (
                            <div className="flex justify-between">
                              <span className="text-slate-500">Departure</span>
                              <span className="font-semibold text-slate-800">
                                {new Date(selectedBooking.details.departAt).toLocaleString()}
                              </span>
                            </div>
                          )}
                          {selectedBooking.details?.arriveAt && (
                            <div className="flex justify-between">
                              <span className="text-slate-500">Arrival</span>
                              <span className="font-semibold text-slate-800">
                                {new Date(selectedBooking.details.arriveAt).toLocaleString()}
                              </span>
                            </div>
                          )}
                          {selectedBooking.details?.class && (
                            <div className="flex justify-between">
                              <span className="text-slate-500">Class</span>
                              <span className="font-semibold text-slate-800">{selectedBooking.details.class}</span>
                            </div>
                          )}
                          {selectedBooking.details?.priceINR && (
                            <div className="flex justify-between pt-3 border-t border-slate-200">
                              <span className="text-slate-700 font-semibold">Total Price</span>
                              <span className="font-bold text-green-600 text-lg">
                                ₹{selectedBooking.details.priceINR.toLocaleString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Hotel Details */}
                  {selectedBooking.type === 'hotel' && (
                    <div className="space-y-4">
                      <div className="bg-white border border-slate-200 rounded-xl p-4">
                        <h3 className="font-bold text-slate-800 mb-3">Hotel Information</h3>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Hotel Name</span>
                            <span className="font-semibold text-slate-800">{selectedBooking.details?.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Location</span>
                            <span className="font-semibold text-slate-800">{selectedBooking.details?.city}</span>
                          </div>
                          {selectedBooking.details?.checkIn && (
                            <div className="flex justify-between">
                              <span className="text-slate-500">Check-in</span>
                              <span className="font-semibold text-slate-800">{formatDate(selectedBooking.details.checkIn)}</span>
                            </div>
                          )}
                          {selectedBooking.details?.checkOut && (
                            <div className="flex justify-between">
                              <span className="text-slate-500">Check-out</span>
                              <span className="font-semibold text-slate-800">{formatDate(selectedBooking.details.checkOut)}</span>
                            </div>
                          )}
                          {selectedBooking.details?.roomType && (
                            <div className="flex justify-between">
                              <span className="text-slate-500">Room Type</span>
                              <span className="font-semibold text-slate-800">{selectedBooking.details.roomType}</span>
                            </div>
                          )}
                          {selectedBooking.details?.pricePerNightINR && (
                            <div className="flex justify-between pt-3 border-t border-slate-200">
                              <span className="text-slate-700 font-semibold">Per Night</span>
                              <span className="font-bold text-amber-600 text-lg">
                                ₹{selectedBooking.details.pricePerNightINR.toLocaleString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Taxi Details */}
                  {selectedBooking.type === 'taxi' && (
                    <div className="space-y-4">
                      <div className="bg-white border border-slate-200 rounded-xl p-4">
                        <h3 className="font-bold text-slate-800 mb-3">Ride Information</h3>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Service</span>
                            <span className="font-semibold text-slate-800">{selectedBooking.details?.service}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Vehicle Type</span>
                            <span className="font-semibold text-slate-800">{selectedBooking.details?.vehicleType}</span>
                          </div>
                          {selectedBooking.details?.pickup && (
                            <div className="flex justify-between">
                              <span className="text-slate-500">Pickup</span>
                              <span className="font-semibold text-slate-800">{selectedBooking.details.pickup}</span>
                            </div>
                          )}
                          {selectedBooking.details?.dropoff && (
                            <div className="flex justify-between">
                              <span className="text-slate-500">Drop-off</span>
                              <span className="font-semibold text-slate-800">{selectedBooking.details.dropoff}</span>
                            </div>
                          )}
                          {selectedBooking.details?.estimatedFareINR && (
                            <div className="flex justify-between pt-3 border-t border-slate-200">
                              <span className="text-slate-700 font-semibold">Estimated Fare</span>
                              <span className="font-bold text-purple-600 text-lg">
                                ₹{selectedBooking.details.estimatedFareINR.toLocaleString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="mt-6 flex gap-3">
                    <button 
                      onClick={() => {
                        setShowDetailModal(false)
                        setSelectedBooking(null)
                      }}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-4 rounded-xl transition-all"
                    >
                      Close
                    </button>
                    <button className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-lg">
                      Download Receipt
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <BottomNav />

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}
