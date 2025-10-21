import React, { useState } from 'react'
import BookingModal from './BookingModal'
import { saveAITrip } from '../services/historyService'

// Hub city name mapping for display purposes
const CITY_BY_CODE = {
  'DEL': 'New Delhi',
  'BOM': 'Mumbai',
  'BLR': 'Bengaluru',
  'HYD': 'Hyderabad',
  'MAA': 'Chennai',
  'CCU': 'Kolkata',
  'JAI': 'Jaipur',
  'AMD': 'Ahmedabad',
  'IXC': 'Chandigarh',
  'GOI': 'Goa',
  'NAG': 'Nagpur',
  'PNQ': 'Pune',
  'TRV': 'Thiruvananthapuram',
  // Add more as needed
  'VTZ': 'Visakhapatnam',
  'COK': 'Kochi',
  'IXZ': 'Port Blair',
  'LKO': 'Lucknow',
  'PAT': 'Patna',
  'RAJ': 'Rajkot',
  'SXR': 'Srinagar',
  'BHU': 'Bhubaneswar',
  'IDR': 'Indore',
  'GWL': 'Gwalior',
  'TEZ': 'Tezpur',
  'IXB': 'Bagdogra'
}

function TripPlanDisplay({ plan, origin, destination }) {
  const [bookingModalOpen, setBookingModalOpen] = useState(false)
  const [currentBookingData, setCurrentBookingData] = useState(null)

  if (!plan) return null

  // Helper to get city name from code
  const getCityName = (code) => {
    if (!code) return ''
    const upperCode = code.toUpperCase()
    return CITY_BY_CODE[upperCode] || code
  }

  // Extract key data from plan
  const route = plan.route || {}
  const legs = route.legs || []
  const itinerary = plan.itinerary || []
  const costs = plan.estimatedCosts || {}
  const alternatives = plan.alternatives || []
  const notes = plan.notes || ''

  // Mode icons
  const getModeIcon = (mode) => {
    const icons = {
      bus: '🚌',
      flight: '✈️',
      train: '🚆',
      taxi: '🚕',
      ground: '🚌'
    }
    return icons[mode?.toLowerCase()] || '🚗'
  }

  const getModeColor = (mode) => {
    const colors = {
      bus: 'bg-amber-100 text-amber-800 border-amber-200',
      flight: 'bg-sky-100 text-sky-800 border-sky-200',
      train: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      taxi: 'bg-purple-100 text-purple-800 border-purple-200',
      ground: 'bg-amber-100 text-amber-800 border-amber-200'
    }
    return colors[mode?.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const formatDuration = (minutes) => {
    if (!minutes) return 'N/A'
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    return h > 0 ? `${h}h ${m}m` : `${m}m`
  }

  const formatDateTime = (dateStr) => {
    if (!dateStr) return ''
    try {
      const d = new Date(dateStr)
      return d.toLocaleString('en-IN', { 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    } catch {
      return dateStr
    }
  }

  const totalPrice = costs.totalINR || costs.transportTotalINR || route.totalPriceINR || 0
  const totalDuration = route.totalDurationMinutes || legs.reduce((sum, l) => sum + (l.durationMinutes || 0), 0)

  return (
    <div className="space-y-4 animate-fadeInScale">
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="text-lg">🎉</span>
        <h3 className="text-lg font-bold text-slate-800">Your Perfect Trip</h3>
      </div>

      {/* Journey Overview Card */}
      <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl border border-teal-100 p-5 shadow-sm">
        <div className="bg-white rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">From</p>
              <p className="text-base font-bold text-slate-900">{origin}</p>
            </div>
            <span className="text-2xl">→</span>
            <div className="text-right">
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">To</p>
              <p className="text-base font-bold text-slate-900">{destination}</p>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white rounded-xl p-3 shadow-sm">
            <p className="text-xs text-slate-500 font-medium mb-1">Total Duration</p>
            <p className="text-lg font-bold text-teal-600">{formatDuration(totalDuration)}</p>
          </div>
          <div className="bg-white rounded-xl p-3 shadow-sm">
            <p className="text-xs text-slate-500 font-medium mb-1">Est. Cost</p>
            <p className="text-lg font-bold text-teal-600">₹{totalPrice.toLocaleString()}</p>
          </div>
        </div>

        {/* Route Legs - Timeline Style */}
        {legs.length > 0 && (
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-xs text-slate-500 font-bold mb-3 uppercase tracking-wide flex items-center gap-2">
              <span>🗺️</span>
              Your Journey
            </p>
            <div className="space-y-3">
              {legs.map((leg, idx) => (
                <div key={idx} className="relative">
                  {/* Connector Line */}
                  {idx < legs.length - 1 && (
                    <div className="absolute left-4 top-12 bottom-0 w-0.5 bg-slate-200 -mb-3"></div>
                  )}
                  
                  <div className="flex gap-3">
                    {/* Mode Icon */}
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-lg z-10 border-2 ${getModeColor(leg.mode)}`}>
                      {getModeIcon(leg.mode)}
                    </div>
                    
                    {/* Leg Details */}
                    <div className="flex-1 pb-3">
                      <div className={`rounded-lg border p-3 ${getModeColor(leg.mode)} bg-opacity-50`}>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <p className="text-xs font-bold uppercase tracking-wide opacity-70">
                              {leg.mode || 'Transfer'}
                            </p>
                            <p className="text-sm font-semibold text-slate-900 mt-1">
                              {getCityName(leg.from)} → {getCityName(leg.to)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-bold text-slate-900">₹{(leg.priceINR || 0).toLocaleString()}</p>
                          </div>
                        </div>
                        
                        {/* Additional Details */}
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600 mt-2">
                          {leg.operator && <span>• {leg.operator}</span>}
                          {leg.airline && <span>• {leg.airline}</span>}
                          {leg.flightNumber && <span>• {leg.flightNumber}</span>}
                          {leg.trainNumber && <span>• {leg.trainNumber}</span>}
                          {leg.durationMinutes && <span>• {formatDuration(leg.durationMinutes)}</span>}
                          {leg.distanceKm && <span>• {leg.distanceKm} km</span>}
                        </div>
                        
                        {/* Timing */}
                        {(leg.departAt || leg.arriveAt) && (
                          <div className="flex items-center gap-2 mt-2 text-xs">
                            {leg.departAt && (
                              <span className="bg-white bg-opacity-70 px-2 py-1 rounded">
                                🛫 {formatDateTime(leg.departAt)}
                              </span>
                            )}
                            {leg.arriveAt && (
                              <span className="bg-white bg-opacity-70 px-2 py-1 rounded">
                                🛬 {formatDateTime(leg.arriveAt)}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Day-by-Day Itinerary - Beautiful Redesign */}
      {itinerary.length > 0 && (
        <div className="relative overflow-hidden">
          {/* Header with Gradient */}
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 rounded-t-3xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <span className="text-2xl">📅</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Your Journey Timeline</h3>
                  <p className="text-sm text-white text-opacity-90 mt-1">
                    {itinerary.length} amazing {itinerary.length === 1 ? 'day' : 'days'} planned for you
                  </p>
                </div>
              </div>
              <div className="hidden md:flex gap-2">
                <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-4 py-2 text-xs font-semibold">
                  ✨ AI Curated
                </div>
              </div>
            </div>
          </div>

          {/* Days Timeline */}
          <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-b-3xl p-6 shadow-lg">
            <div className="space-y-6">
              {itinerary.map((day, idx) => (
                <div 
                  key={idx} 
                  className="group relative animate-fadeInUp"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  {/* Connecting Line (except for last day) */}
                  {idx < itinerary.length - 1 && (
                    <div className="absolute left-[26px] top-16 bottom-0 w-1 bg-gradient-to-b from-purple-400 via-pink-400 to-orange-400 opacity-30 z-0"></div>
                  )}

                  {/* Day Card */}
                  <div className="relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group-hover:scale-[1.02] border border-slate-200">
                    {/* Gradient Accent Bar */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500"></div>
                    
                    <div className="p-6">
                      {/* Day Header */}
                      <div className="flex items-start gap-4 mb-4">
                        {/* Day Number Badge */}
                        <div className="relative flex-shrink-0 z-10">
                          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform duration-300">
                            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                              <span className="text-xl font-bold bg-gradient-to-br from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                {idx + 1}
                              </span>
                            </div>
                          </div>
                          {/* Decorative Ring */}
                          <div className="absolute inset-0 rounded-full border-4 border-purple-300 opacity-0 group-hover:opacity-100 animate-ping-slow"></div>
                        </div>

                        {/* Day Info */}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-2xl font-bold text-slate-800">
                              Day {idx + 1}
                            </h4>
                            {day.date && (
                              <div className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                                <span>🗓️</span>
                                {new Date(day.date).toLocaleDateString('en-IN', { 
                                  weekday: 'short',
                                  month: 'short', 
                                  day: 'numeric' 
                                })}
                              </div>
                            )}
                          </div>
                          
                          {/* Location Badge (if available) */}
                          {day.location && (
                            <div className="inline-flex items-center gap-1 text-sm text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                              <span>📍</span>
                              <span>{day.location}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Activities Section */}
                      {day.activities && Array.isArray(day.activities) && day.activities.length > 0 && (
                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-sm">
                              ✓
                            </div>
                            <h5 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">
                              Activities
                            </h5>
                          </div>
                          
                          <div className="grid gap-3">
                            {day.activities.map((activity, actIdx) => (
                              <div 
                                key={actIdx}
                                className="group/activity flex items-start gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 transition-all duration-200 border border-blue-100 hover:border-blue-300 cursor-default"
                              >
                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white text-xs font-bold mt-0.5 shadow-sm">
                                  {actIdx + 1}
                                </div>
                                <p className="flex-1 text-slate-700 leading-relaxed group-hover/activity:text-slate-900 font-medium">
                                  {activity}
                                </p>
                                <div className="flex-shrink-0 opacity-0 group-hover/activity:opacity-100 transition-opacity">
                                  <span className="text-xs text-blue-500">✨</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Transfers Section */}
                      {day.transfers && Array.isArray(day.transfers) && day.transfers.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-slate-200">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white text-sm">
                              🚗
                            </div>
                            <h5 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">
                              Travel
                            </h5>
                          </div>
                          
                          <div className="space-y-2">
                            {day.transfers.map((t, tIdx) => (
                              <div 
                                key={tIdx} 
                                className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-orange-50 to-red-50 border border-orange-100"
                              >
                                <div className="flex-shrink-0 text-2xl">
                                  {getModeIcon(t.mode)}
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-semibold text-slate-800">
                                    {t.from} → {t.to}
                                  </p>
                                  {t.duration && (
                                    <p className="text-xs text-slate-600 mt-1">
                                      ⏱️ {t.duration}
                                    </p>
                                  )}
                                </div>
                                {t.mode && (
                                  <div className="flex-shrink-0">
                                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getModeColor(t.mode)}`}>
                                      {t.mode.toUpperCase()}
                                    </span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Accommodation (if available) */}
                      {day.accommodation && (
                        <div className="mt-4 pt-4 border-t border-slate-200">
                          <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100">
                            <span className="text-2xl">🏨</span>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-slate-800">{day.accommodation}</p>
                              <p className="text-xs text-slate-600 mt-1">Overnight stay</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Notes (if available) */}
                      {day.notes && (
                        <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200">
                          <div className="flex gap-2">
                            <span className="text-sm flex-shrink-0">💡</span>
                            <p className="text-sm text-amber-800 italic">{day.notes}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bottom Decorative Accent */}
                    <div className="h-2 bg-gradient-to-r from-purple-100 via-pink-100 to-orange-100 opacity-50"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Journey Complete Badge */}
            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-full shadow-lg">
                <span className="text-2xl">🎉</span>
                <span className="font-bold">Journey Complete!</span>
                <span className="text-2xl">✨</span>
              </div>
            </div>
          </div>

          <style jsx>{`
            @keyframes fadeInUp {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            @keyframes ping-slow {
              75%, 100% {
                transform: scale(1.5);
                opacity: 0;
              }
            }
            .animate-fadeInUp {
              animation: fadeInUp 0.6s ease-out forwards;
              opacity: 0;
            }
            .animate-ping-slow {
              animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
            }
          `}</style>
        </div>
      )}

      {/* Alternative Routes */}
      {alternatives.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <p className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
            <span>🔄</span>
            Alternative Options
          </p>
          <div className="space-y-2">
            {alternatives.slice(0, 2).map((alt, idx) => (
              <div key={idx} className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                <p className="text-sm font-semibold text-slate-800 mb-1">{alt.label || `Option ${idx + 1}`}</p>
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>
                    {alt.legs?.length || 0} leg{alt.legs?.length !== 1 ? 's' : ''}
                    {alt.totalDurationMinutes && <> • {formatDuration(alt.totalDurationMinutes)}</>}
                  </span>
                  {alt.totalPriceINR && (
                    <span className="font-semibold text-teal-600">₹{alt.totalPriceINR.toLocaleString()}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cost Breakdown */}
      {costs && Object.keys(costs).length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <p className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
            <span>💰</span>
            Cost Breakdown
          </p>
          <div className="space-y-2 text-sm">
            {costs.transportTotalINR && (
              <div className="flex justify-between">
                <span className="text-slate-600">Transport</span>
                <span className="font-semibold text-slate-900">₹{costs.transportTotalINR.toLocaleString()}</span>
              </div>
            )}
            {costs.accommodationPerNightINR && (
              <div className="flex justify-between">
                <span className="text-slate-600">Accommodation (per night)</span>
                <span className="font-semibold text-slate-900">₹{costs.accommodationPerNightINR.toLocaleString()}</span>
              </div>
            )}
            {costs.totalINR && (
              <div className="flex justify-between pt-2 border-t-2 border-teal-500 mt-2">
                <span className="text-slate-800 font-bold">Total Estimate</span>
                <span className="font-bold text-teal-600 text-lg">₹{costs.totalINR.toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Notes */}
      {notes && (
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-4">
          <p className="text-xs font-bold text-amber-900 mb-2 flex items-center gap-2">
            <span>📝</span>
            Travel Tips
          </p>
          <p className="text-sm text-amber-800 whitespace-pre-wrap">{notes}</p>
        </div>
      )}

      {/* Hotel Recommendations */}
      {plan.recommendedBookings?.hotel && (
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <p className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
            <span>🏨</span>
            Recommended Stay
          </p>
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
            <p className="font-semibold text-slate-900">{plan.recommendedBookings.hotel.name}</p>
            <p className="text-xs text-slate-600 mt-1">
              {plan.recommendedBookings.hotel.city}
              {plan.recommendedBookings.hotel.pricePerNightINR && (
                <span className="ml-2 text-teal-600 font-semibold">
                  ₹{plan.recommendedBookings.hotel.pricePerNightINR}/night
                </span>
              )}
            </p>
          </div>
        </div>
      )}

      {/* Booking Section */}
      <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-3xl border-2 border-indigo-200 p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-2xl">🎫</span>
          </div>
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Ready to Book?
            </h3>
            <p className="text-sm text-slate-600 mt-0.5">
              Secure your flights and hotels now
            </p>
          </div>
        </div>

        {/* Booking Options Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Flight Bookings */}
          {legs.some(leg => leg.mode === 'flight') && (
            <div className="bg-white rounded-2xl p-5 shadow-md border border-slate-200 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">✈️</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Flight Tickets</h4>
                    <p className="text-xs text-slate-600">
                      {legs.filter(leg => leg.mode === 'flight').length} flight{legs.filter(leg => leg.mode === 'flight').length > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">Starting from</p>
                  <p className="font-bold text-sky-600">
                    ₹{legs
                      .filter(leg => leg.mode === 'flight')
                      .reduce((sum, leg) => sum + (leg.priceINR || 0), 0)
                      .toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Flight Details */}
              <div className="space-y-2 mb-4">
                {legs.filter(leg => leg.mode === 'flight').map((leg, idx) => (
                  <div key={idx} className="bg-sky-50 rounded-lg p-3 border border-sky-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-sky-900">
                          {getCityName(leg.from)} → {getCityName(leg.to)}
                        </p>
                        <p className="text-xs text-slate-600 mt-1">
                          {leg.airline} {leg.flightNumber}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-sky-700">₹{(leg.priceINR || 0).toLocaleString()}</p>
                        <p className="text-xs text-slate-500">{leg.class || 'Economy'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Book Flight Button */}
              <button 
                onClick={() => {
                  // Collect flight details for booking
                  const flightLegs = legs.filter(leg => leg.mode === 'flight');
                  const bookingData = {
                    type: 'flights',
                    flights: flightLegs.map(leg => ({
                      from: getCityName(leg.from),
                      to: getCityName(leg.to),
                      airline: leg.airline,
                      flightNumber: leg.flightNumber,
                      departAt: leg.departAt,
                      arriveAt: leg.arriveAt,
                      price: leg.priceINR,
                      class: leg.class,
                      id: leg.id
                    })),
                    totalPrice: flightLegs.reduce((sum, leg) => sum + (leg.priceINR || 0), 0)
                  };
                  
                  setCurrentBookingData(bookingData);
                  setBookingModalOpen(true);
                }}
                className="w-full bg-gradient-to-r from-sky-600 to-blue-600 text-white font-bold py-3 px-4 rounded-xl hover:from-sky-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
              >
                <span>Book Flights</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>
          )}

          {/* Hotel Bookings */}
          {(plan.recommendedBookings?.hotel || plan.hotels?.length > 0) && (
            <div className="bg-white rounded-2xl p-5 shadow-md border border-slate-200 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">🏨</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Hotel Stay</h4>
                    <p className="text-xs text-slate-600">
                      {destination || 'Your destination'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">Per night</p>
                  <p className="font-bold text-amber-600">
                    ₹{(plan.recommendedBookings?.hotel?.pricePerNightINR || 
                       plan.hotels?.[0]?.pricePerNightINR || 
                       costs.accommodationPerNightINR || 
                       0).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Hotel Details */}
              <div className="bg-amber-50 rounded-lg p-3 border border-amber-200 mb-4">
                <p className="font-semibold text-slate-900">
                  {plan.recommendedBookings?.hotel?.name || plan.hotels?.[0]?.name || 'Premium Hotel'}
                </p>
                <div className="flex items-center gap-4 mt-2 text-xs text-slate-600">
                  {(plan.recommendedBookings?.hotel?.rating || plan.hotels?.[0]?.rating) && (
                    <span className="flex items-center gap-1">
                      <span className="text-yellow-500">⭐</span>
                      {plan.recommendedBookings?.hotel?.rating || plan.hotels?.[0]?.rating}
                    </span>
                  )}
                  <span>📍 {plan.recommendedBookings?.hotel?.city || destination}</span>
                </div>
                {(plan.recommendedBookings?.hotel?.amenities || plan.hotels?.[0]?.amenities) && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(plan.recommendedBookings?.hotel?.amenities?.wifi || plan.hotels?.[0]?.amenities?.wifi) && (
                      <span className="text-xs bg-white px-2 py-1 rounded-full">📶 WiFi</span>
                    )}
                    {(plan.recommendedBookings?.hotel?.amenities?.pool || plan.hotels?.[0]?.amenities?.pool) && (
                      <span className="text-xs bg-white px-2 py-1 rounded-full">🏊 Pool</span>
                    )}
                    {(plan.recommendedBookings?.hotel?.amenities?.breakfastIncluded || plan.hotels?.[0]?.amenities?.breakfastIncluded) && (
                      <span className="text-xs bg-white px-2 py-1 rounded-full">🍳 Breakfast</span>
                    )}
                  </div>
                )}
              </div>

              {/* Book Hotel Button */}
              <button 
                onClick={() => {
                  const hotel = plan.recommendedBookings?.hotel || plan.hotels?.[0];
                  const bookingData = {
                    type: 'hotel',
                    hotel: {
                      name: hotel?.name || 'Premium Hotel',
                      city: hotel?.city || destination,
                      rating: hotel?.rating,
                      pricePerNight: hotel?.pricePerNightINR || costs.accommodationPerNightINR,
                      amenities: hotel?.amenities,
                      id: hotel?.id
                    },
                    checkIn: plan.startDate || new Date().toISOString(),
                    checkOut: plan.endDate || new Date().toISOString(),
                    totalPrice: hotel?.pricePerNightINR || costs.accommodationPerNightINR || 0
                  };
                  
                  setCurrentBookingData(bookingData);
                  setBookingModalOpen(true);
                }}
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold py-3 px-4 rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
              >
                <span>Book Hotel</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>
          )}
        </div>

        {/* Train Bookings (if any) */}
        {legs.some(leg => leg.mode === 'train') && (
          <div className="mt-4 bg-white rounded-2xl p-5 shadow-md border border-slate-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🚆</span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Train Tickets</h4>
                  <p className="text-xs text-slate-600">
                    {legs.filter(leg => leg.mode === 'train').length} train{legs.filter(leg => leg.mode === 'train').length > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">Total</p>
                <p className="font-bold text-emerald-600">
                  ₹{legs
                    .filter(leg => leg.mode === 'train')
                    .reduce((sum, leg) => sum + (leg.priceINR || 0), 0)
                    .toLocaleString()}
                </p>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              {legs.filter(leg => leg.mode === 'train').map((leg, idx) => (
                <div key={idx} className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-emerald-900">
                        {getCityName(leg.from)} → {getCityName(leg.to)}
                      </p>
                      <p className="text-xs text-slate-600 mt-1">
                        {leg.trainNumber} • {formatDuration(leg.durationMinutes)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-emerald-700">₹{(leg.priceINR || 0).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={() => {
                const trainLegs = legs.filter(leg => leg.mode === 'train');
                const bookingData = {
                  type: 'trains',
                  trains: trainLegs.map(leg => ({
                    from: getCityName(leg.from),
                    to: getCityName(leg.to),
                    trainNumber: leg.trainNumber,
                    departAt: leg.departAt,
                    arriveAt: leg.arriveAt,
                    price: leg.priceINR,
                    id: leg.id
                  })),
                  totalPrice: trainLegs.reduce((sum, leg) => sum + (leg.priceINR || 0), 0)
                };
                
                setCurrentBookingData(bookingData);
                setBookingModalOpen(true);
              }}
              className="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold py-3 px-4 rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
            >
              <span>Book Trains</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        )}

        {/* Book Everything */}
        <div className="mt-6 pt-6 border-t-2 border-indigo-200">
          <button 
            onClick={() => {
              const flightLegs = legs.filter(leg => leg.mode === 'flight');
              const trainLegs = legs.filter(leg => leg.mode === 'train');
              const hotel = plan.recommendedBookings?.hotel || plan.hotels?.[0];
              
              const completeBooking = {
                type: 'complete',
                flights: flightLegs.map(leg => ({
                  from: getCityName(leg.from),
                  to: getCityName(leg.to),
                  airline: leg.airline,
                  flightNumber: leg.flightNumber,
                  price: leg.priceINR,
                  id: leg.id
                })),
                trains: trainLegs.map(leg => ({
                  from: getCityName(leg.from),
                  to: getCityName(leg.to),
                  trainNumber: leg.trainNumber,
                  price: leg.priceINR,
                  id: leg.id
                })),
                hotel: hotel ? {
                  name: hotel.name,
                  city: hotel.city,
                  pricePerNight: hotel.pricePerNightINR,
                  id: hotel.id
                } : null,
                totalPrice: totalPrice,
                origin,
                destination,
                startDate: plan.startDate,
                endDate: plan.endDate
              };
              
              setCurrentBookingData(completeBooking);
              setBookingModalOpen(true);
            }}
            className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold py-4 px-6 rounded-2xl hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center justify-center gap-3 group text-lg"
          >
            <span>🎁</span>
            <span>Book Complete Package</span>
            <span className="font-bold">₹{totalPrice.toLocaleString()}</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
          <p className="text-xs text-center text-slate-500 mt-3">
            💳 Secure payment • 🔒 100% safe • ✅ Instant confirmation
          </p>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => {
          setBookingModalOpen(false);
          setCurrentBookingData(null);
        }}
        bookingData={currentBookingData}
        onConfirm={(completeBooking) => {
          console.log('Booking Confirmed:', completeBooking);
          
          // Save the complete AI trip to history
          const tripData = {
            origin: origin,
            destination: destination,
            startDate: plan.startDate || currentBookingData?.startDate,
            endDate: plan.endDate || currentBookingData?.endDate,
            plan: plan
          };
          
          const saveResult = saveAITrip(tripData);
          if (saveResult.success) {
            console.log('Trip saved to history:', saveResult.trip);
          }
          
          // Show success message
          alert(`✅ Booking Confirmed!\n\nBooking ID: ${completeBooking.bookingId}\nTotal: ₹${(completeBooking.totalPrice || 0).toLocaleString()}\n\nConfirmation email sent to ${completeBooking.userDetails.email}\n\n📋 Check your History page to view this trip!`);
          
          // Here you would typically:
          // 1. Send booking data to your backend API
          // 2. Process payment
          // 3. Send confirmation emails
          // 4. Redirect to booking confirmation page
        }}
      />
    </div>
  )
}

export default TripPlanDisplay
