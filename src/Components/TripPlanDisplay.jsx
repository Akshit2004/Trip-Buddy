import React from 'react'

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
    <div className="space-y-4 animate-fadeIn">
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

      {/* Day-by-Day Itinerary */}
      {itinerary.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <p className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span>📅</span>
            Day-by-Day Plan
          </p>
          <div className="space-y-4">
            {itinerary.map((day, idx) => (
              <div key={idx} className="border-l-4 border-teal-500 pl-4 py-2">
                <p className="text-sm font-bold text-slate-800 mb-2">
                  Day {idx + 1}
                  {day.date && <span className="text-xs text-slate-500 ml-2">({new Date(day.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })})</span>}
                </p>
                {day.activities && Array.isArray(day.activities) && (
                  <ul className="space-y-1 text-sm text-slate-600">
                    {day.activities.map((activity, actIdx) => (
                      <li key={actIdx} className="flex gap-2">
                        <span className="text-slate-400">•</span>
                        <span>{activity}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {day.transfers && Array.isArray(day.transfers) && day.transfers.length > 0 && (
                  <div className="mt-2 bg-slate-50 rounded p-2 text-xs">
                    <p className="font-semibold text-slate-700 mb-1">Travel:</p>
                    {day.transfers.map((t, tIdx) => (
                      <p key={tIdx} className="text-slate-600">
                        {getModeIcon(t.mode)} {t.from} → {t.to}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
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
    </div>
  )
}

export default TripPlanDisplay
