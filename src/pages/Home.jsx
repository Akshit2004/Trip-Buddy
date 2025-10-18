import React, { useState, useEffect } from 'react'
import TopNav from '../Components/TopNav'
import BottomNav from '../Components/BottomNav'
// ...existing code...
import FlightIcon from '../Components/icons/FlightIcon'
import TrainIcon from '../Components/icons/TrainIcon'
import HotelIcon from '../Components/icons/HotelIcon'
import TaxiIcon from '../Components/icons/TaxiIcon'

export default function Home() {
  const [activeTab, setActiveTab] = useState('flights')
  const [hotels, setHotels] = useState([])
  const [loadingHotels, setLoadingHotels] = useState(false)
  const [hotelError, setHotelError] = useState(null)
  const [cityCode, setCityCode] = useState('PAR') // default Paris; TODO: bind to search input
  
  // Search/autocomplete state
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [showSearchDropdown, setShowSearchDropdown] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)

  // Taxi/Uber state
  const [rides, setRides] = useState([])
  const [loadingRides, setLoadingRides] = useState(false)
  const [rideError, setRideError] = useState(null)
  const [pickupLocation, setPickupLocation] = useState(null)
  const [dropoffLocation, setDropoffLocation] = useState(null)
  const [gettingLocation, setGettingLocation] = useState(false)
  
  // Pickup/Dropoff input and autocomplete state
  const [pickupInput, setPickupInput] = useState('')
  const [pickupSuggestions, setPickupSuggestions] = useState([])
  const [showPickupDropdown, setShowPickupDropdown] = useState(false)
  const [pickupLoading, setPickupLoading] = useState(false)
  
  const [dropoffInput, setDropoffInput] = useState('')
  const [dropoffSuggestions, setDropoffSuggestions] = useState([])
  const [showDropoffDropdown, setShowDropoffDropdown] = useState(false)
  const [dropoffLoading, setDropoffLoading] = useState(false)

  // Debounced location search
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSearchResults([])
      setShowSearchDropdown(false)
      return
    }

    const timer = setTimeout(async () => {
      setSearchLoading(true)
      try {
        const mod = await import('../services/hotelService')
        const locations = await mod.searchLocations(searchQuery)
        setSearchResults(locations)
        setShowSearchDropdown(locations.length > 0)
      } catch (e) {
        console.error('Search error:', e)
        setSearchResults([])
      } finally {
        setSearchLoading(false)
      }
    }, 400) // 400ms debounce

    return () => clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    async function loadHotels() {
      if (activeTab !== 'hotels') return
      setLoadingHotels(true)
      setHotelError(null)
      try {
        const mod = await import('../services/hotelService')
        const data = await mod.fetchHotelsByCity(cityCode)
        setHotels(Array.isArray(data.data) ? data.data : [])
      } catch (e) {
        setHotelError(e.message)
      } finally {
        setLoadingHotels(false)
      }
    }
    loadHotels()
  }, [activeTab, cityCode])

  // Handler for selecting a location from dropdown
  const handleLocationSelect = (location) => {
    setSearchQuery(location.address.cityName || location.name)
    setShowSearchDropdown(false)
    
    // If on taxis tab and location has coordinates, set as dropoff
    if (activeTab === 'taxis' && location.geoCode) {
      setDropoffLocation({
        latitude: location.geoCode.latitude,
        longitude: location.geoCode.longitude,
        name: location.address?.cityName || location.name
      })
      return
    }
    
    // Extract IATA code if available for hotels
    if (location.iataCode) {
      setCityCode(location.iataCode)
      // Auto-switch to hotels tab if not already there
      if (activeTab !== 'hotels') {
        setActiveTab('hotels')
      }
    }
  }

  // Get user's current location
  const getCurrentLocation = () => {
    setGettingLocation(true)
    setRideError(null)
    
    if (!navigator.geolocation) {
      setRideError('Geolocation is not supported by your browser')
      setGettingLocation(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          name: 'Current Location'
        }
        setPickupLocation(location)
        setPickupInput('Current Location')
        setShowPickupDropdown(false)
        setGettingLocation(false)
      },
      (error) => {
        setRideError(`Error getting location: ${error.message}`)
        setGettingLocation(false)
      }
    )
  }

  // Handle selecting a pickup location from suggestions
  const handlePickupSelect = (location) => {
    setPickupLocation({
      latitude: location.latitude,
      longitude: location.longitude,
      name: location.name
    })
    setPickupInput(location.name)
    setShowPickupDropdown(false)
  }

  // Handle selecting a dropoff location from suggestions
  const handleDropoffSelect = (location) => {
    setDropoffLocation({
      latitude: location.latitude,
      longitude: location.longitude,
      name: location.name
    })
    setDropoffInput(location.name)
    setShowDropoffDropdown(false)
  }

  // Fetch Uber rides when both pickup and dropoff are set
  useEffect(() => {
    async function loadRides() {
      if (activeTab !== 'taxis' || !pickupLocation || !dropoffLocation) return
      
      setLoadingRides(true)
      setRideError(null)
      try {
        const mod = await import('../services/taxiService')
        const data = await mod.getUberPriceEstimates(
          pickupLocation.latitude,
          pickupLocation.longitude,
          dropoffLocation.latitude,
          dropoffLocation.longitude
        )
        setRides(Array.isArray(data.prices) ? data.prices : [])
      } catch (e) {
        setRideError(e.message)
        setRides([])
      } finally {
        setLoadingRides(false)
      }
    }
    loadRides()
  }, [activeTab, pickupLocation, dropoffLocation])

  // Debounced pickup location autocomplete
  useEffect(() => {
    if (!pickupInput || pickupInput.trim().length < 2) {
      setPickupSuggestions([])
      setShowPickupDropdown(false)
      return
    }

    const timer = setTimeout(async () => {
      setPickupLoading(true)
      try {
        const mod = await import('../services/locationService')
        const locations = await mod.searchLocationsByGemini(pickupInput)
        setPickupSuggestions(locations)
        setShowPickupDropdown(locations.length > 0)
      } catch (e) {
        console.error('Pickup autocomplete error:', e)
        setPickupSuggestions([])
      } finally {
        setPickupLoading(false)
      }
    }, 600) // 600ms debounce

    return () => clearTimeout(timer)
  }, [pickupInput])

  // Debounced dropoff location autocomplete
  useEffect(() => {
    if (!dropoffInput || dropoffInput.trim().length < 2) {
      setDropoffSuggestions([])
      setShowDropoffDropdown(false)
      return
    }

    const timer = setTimeout(async () => {
      setDropoffLoading(true)
      try {
        const mod = await import('../services/locationService')
        const locations = await mod.searchLocationsByGemini(dropoffInput)
        setDropoffSuggestions(locations)
        setShowDropoffDropdown(locations.length > 0)
      } catch (e) {
        console.error('Dropoff autocomplete error:', e)
        setDropoffSuggestions([])
      } finally {
        setDropoffLoading(false)
      }
    }, 600) // 600ms debounce

    return () => clearTimeout(timer)
  }, [dropoffInput])

  return (
    <div className="min-h-screen bg-white">
      <TopNav />
      <div className="max-w-md mx-auto">
        <main className="px-4 pb-28 pt-6">{/* pb to avoid bottom nav overlap, pt for TopNav spacing */}
          <div className="mt-3">
            <div className="relative">
              <input
                type="search"
                placeholder="Where to?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchResults.length > 0 && setShowSearchDropdown(true)}
                className="w-full rounded-xl pl-4 pr-12 py-3 border border-gray-200 shadow-sm bg-gray-50"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {searchLoading ? (
                  <div className="animate-spin w-5 h-5 border-2 border-gray-300 border-t-teal-600 rounded-full" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                )}
              </div>
              
              {/* Search Results Dropdown */}
              {showSearchDropdown && searchResults.length > 0 && (
                <div className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-200 max-h-64 overflow-y-auto">
                  {searchResults.map((location) => (
                    <button
                      key={location.id}
                      onClick={() => handleLocationSelect(location)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="font-medium text-sm text-gray-800">
                        {location.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {location.address?.cityName && `${location.address.cityName}, `}
                        {location.address?.countryName}
                        {location.iataCode && ` (${location.iataCode})`}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 bg-white rounded-xl shadow-sm p-2 flex items-center justify-around">
              <button onClick={() => setActiveTab('flights')} className={`flex flex-col items-center gap-1 text-sm ${activeTab==='flights' ? 'text-teal-600' : 'text-gray-500'}`}>
                <FlightIcon active={activeTab==='flights'} />
                <span className="text-xs">Flights</span>
              </button>
              <button onClick={() => setActiveTab('trains')} className={`flex flex-col items-center gap-1 text-sm ${activeTab==='trains' ? 'text-teal-600' : 'text-gray-500'}`}>
                <TrainIcon active={activeTab==='trains'} />
                <span className="text-xs">Trains</span>
              </button>
              <button onClick={() => setActiveTab('hotels')} className={`flex flex-col items-center gap-1 text-sm ${activeTab==='hotels' ? 'text-teal-600' : 'text-gray-500'}`}>
                <HotelIcon active={activeTab==='hotels'} />
                <span className="text-xs">Hotels</span>
              </button>
              <button onClick={() => setActiveTab('taxis')} className={`flex flex-col items-center gap-1 text-sm ${activeTab==='taxis' ? 'text-teal-600' : 'text-gray-500'}`}>
                <TaxiIcon active={activeTab==='taxis'} />
                <span className="text-xs">Taxis</span>
              </button>
            </div>

            <div className="mt-5">
              {activeTab !== 'hotels' && activeTab !== 'taxis' && (
                <>
                  <span className="text-sm text-gray-500 mb-3">Recent Trip</span>
                  <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                    <div className="p-4 flex items-center gap-4">
                      <div className="w-16 h-12 rounded-md bg-gradient-to-br from-sky-300 to-cyan-300 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-slate-800">Mumbai to Goa</div>
                        <div className="text-xs text-gray-500">20 - 22 Dec</div>
                      </div>
                      <button className="bg-sky-500 text-white px-3 py-2 rounded-lg text-sm">View Details</button>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'hotels' && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <input
                      value={cityCode}
                      onChange={e => setCityCode(e.target.value.toUpperCase().slice(0,3))}
                      className="w-24 text-sm border rounded px-2 py-1"
                      placeholder="IATA"
                    />
                    <span className="text-xs text-gray-500">Enter 3-letter city code</span>
                  </div>
                  {loadingHotels && <div className="text-sm text-gray-500 animate-pulse">Loading hotels...</div>}
                  {hotelError && <div className="text-sm text-red-600">{hotelError}</div>}
                  {!loadingHotels && !hotelError && hotels.length === 0 && (
                    <div className="text-sm text-gray-500">No hotels found.</div>
                  )}
                  <ul className="space-y-3">
                    {hotels.map(h => (
                      <li key={h.hotelId} className="bg-white rounded-xl shadow border border-gray-100 p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-semibold text-sm text-slate-800">{h.name}</div>
                            {h.address && (
                              <div className="text-xs text-gray-500">{[h.address.lines?.[0], h.address.cityName].filter(Boolean).join(', ')}</div>
                            )}
                            {h.chainCode && <div className="text-[10px] text-gray-400 mt-1">Chain: {h.chainCode}</div>}
                          </div>
                          {h.rating && <span className="text-xs bg-teal-600 text-white px-2 py-1 rounded">{h.rating}★</span>}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === 'taxis' && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Book an Uber</h3>
                  
                  {/* Location Selection */}
                  <div className="space-y-3 mb-4">
                    {/* Pickup Location */}
                    <div className="relative">
                      <div className="bg-white rounded-xl border border-gray-200 p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-teal-600 flex-shrink-0"></div>
                          <div className="flex-1">
                            <input
                              type="text"
                              value={pickupInput}
                              onChange={(e) => {
                                setPickupInput(e.target.value)
                                if (!e.target.value) setPickupLocation(null)
                              }}
                              onFocus={() => pickupSuggestions.length > 0 && setShowPickupDropdown(true)}
                              placeholder="Enter pickup location..."
                              className="w-full text-sm border-none outline-none bg-transparent"
                            />
                            {pickupLocation && (
                              <div className="text-[10px] text-gray-400 mt-1">
                                {pickupLocation.latitude.toFixed(4)}, {pickupLocation.longitude.toFixed(4)}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {pickupLoading && (
                              <div className="animate-spin w-4 h-4 border-2 border-teal-600 border-t-transparent rounded-full"></div>
                            )}
                            <button
                              onClick={getCurrentLocation}
                              disabled={gettingLocation}
                              className="text-teal-600 hover:text-teal-700 disabled:text-gray-400"
                              title="Use current location"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            </button>
                            {pickupLocation && (
                              <button
                                onClick={() => {
                                  setPickupLocation(null)
                                  setPickupInput('')
                                }}
                                className="text-gray-400 hover:text-red-500"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Pickup Autocomplete Dropdown */}
                      {showPickupDropdown && pickupSuggestions.length > 0 && (
                        <div className="absolute z-20 w-full mt-1 bg-white rounded-xl shadow-lg border border-gray-200 max-h-64 overflow-y-auto">
                          {pickupSuggestions.map((location, index) => (
                            <button
                              key={index}
                              onClick={() => handlePickupSelect(location)}
                              className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                            >
                              <div className="font-medium text-sm text-gray-800">{location.name}</div>
                              <div className="text-xs text-gray-500 mt-1">
                                {location.type && <span className="capitalize">{location.type}</span>}
                                {location.country && <span> • {location.country}</span>}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Dropoff Location */}
                    <div className="relative">
                      <div className="bg-white rounded-xl border border-gray-200 p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0"></div>
                          <div className="flex-1">
                            <input
                              type="text"
                              value={dropoffInput}
                              onChange={(e) => {
                                setDropoffInput(e.target.value)
                                if (!e.target.value) setDropoffLocation(null)
                              }}
                              onFocus={() => dropoffSuggestions.length > 0 && setShowDropoffDropdown(true)}
                              placeholder="Enter destination..."
                              className="w-full text-sm border-none outline-none bg-transparent"
                            />
                            {dropoffLocation && (
                              <div className="text-[10px] text-gray-400 mt-1">
                                {dropoffLocation.latitude.toFixed(4)}, {dropoffLocation.longitude.toFixed(4)}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {dropoffLoading && (
                              <div className="animate-spin w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full"></div>
                            )}
                            {dropoffLocation && (
                              <button
                                onClick={() => {
                                  setDropoffLocation(null)
                                  setDropoffInput('')
                                }}
                                className="text-gray-400 hover:text-red-500"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Dropoff Autocomplete Dropdown */}
                      {showDropoffDropdown && dropoffSuggestions.length > 0 && (
                        <div className="absolute z-20 w-full mt-1 bg-white rounded-xl shadow-lg border border-gray-200 max-h-64 overflow-y-auto">
                          {dropoffSuggestions.map((location, index) => (
                            <button
                              key={index}
                              onClick={() => handleDropoffSelect(location)}
                              className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                            >
                              <div className="font-medium text-sm text-gray-800">{location.name}</div>
                              <div className="text-xs text-gray-500 mt-1">
                                {location.type && <span className="capitalize">{location.type}</span>}
                                {location.country && <span> • {location.country}</span>}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* AI Helper Note */}
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-2 text-xs text-purple-800">
                      <span className="font-semibold">✨ AI-Powered:</span> Type any location and Gemini will suggest places with coordinates
                    </div>
                  </div>

                  {/* Loading State */}
                  {loadingRides && (
                    <div className="text-center py-8">
                      <div className="animate-spin w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                      <div className="text-sm text-gray-500">Finding rides...</div>
                    </div>
                  )}

                  {/* Error State */}
                  {rideError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                      <div className="text-sm text-red-700">⚠️ {rideError}</div>
                    </div>
                  )}

                  {/* No locations set */}
                  {!pickupLocation && !loadingRides && !rideError && (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-2">🚕</div>
                      <div className="text-sm text-gray-500">Set your pickup location to get started</div>
                    </div>
                  )}

                  {/* Waiting for dropoff */}
                  {pickupLocation && !dropoffLocation && !loadingRides && (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-2">📍</div>
                      <div className="text-sm text-gray-500">Now set your destination</div>
                    </div>
                  )}

                  {/* Ride Options */}
                  {!loadingRides && !rideError && rides.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Available Rides</h4>
                      <ul className="space-y-3">
                        {rides.map((ride, index) => (
                          <li key={ride.product_id || index} className="bg-white rounded-xl shadow border border-gray-100 p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <div className="font-semibold text-sm text-gray-800">
                                    {ride.display_name || ride.localized_display_name}
                                  </div>
                                  {ride.capacity && (
                                    <span className="text-xs text-gray-500">👤 {ride.capacity}</span>
                                  )}
                                </div>
                                
                                <div className="flex items-center gap-3 text-xs text-gray-600">
                                  {ride.duration && (
                                    <span>⏱️ {Math.round(ride.duration / 60)} min</span>
                                  )}
                                  {ride.distance && (
                                    <span>📏 {ride.distance.toFixed(1)} mi</span>
                                  )}
                                </div>
                              </div>
                              
                              <div className="text-right">
                                <div className="text-lg font-bold text-teal-600">
                                  {ride.estimate || `$${ride.low_estimate}-${ride.high_estimate}`}
                                </div>
                                {ride.surge_multiplier && ride.surge_multiplier > 1 && (
                                  <div className="text-xs text-orange-600">
                                    {ride.surge_multiplier}x surge
                                  </div>
                                )}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                      
                      <div className="mt-4 bg-gray-50 rounded-lg p-3 text-xs text-gray-600">
                        <p className="mb-1">💡 <strong>Note:</strong> These are test estimates from Uber's API.</p>
                        <p>To book a ride, you'll need to integrate OAuth and use the Uber mobile app.</p>
                      </div>
                    </div>
                  )}

                  {/* No rides found */}
                  {!loadingRides && !rideError && pickupLocation && dropoffLocation && rides.length === 0 && (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-2">🚫</div>
                      <div className="text-sm text-gray-500">No rides available for this route</div>
                      <div className="text-xs text-gray-400 mt-1">Try different locations or check your coordinates</div>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        </main>

        <BottomNav />
      </div>
    </div>
  )
}
