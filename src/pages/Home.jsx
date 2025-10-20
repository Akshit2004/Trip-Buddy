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
  
  // Flights
  const [flights, setFlights] = useState([])
  const [loadingFlights, setLoadingFlights] = useState(false)
  const [flightsError, setFlightsError] = useState(null)

  // Trains
  const [trains, setTrains] = useState([])
  const [loadingTrains, setLoadingTrains] = useState(false)
  const [trainsError, setTrainsError] = useState(null)

  // Taxis
  const [taxis, setTaxis] = useState([])
  const [loadingTaxis, setLoadingTaxis] = useState(false)
  const [taxisError, setTaxisError] = useState(null)
  // Pagination
  const PAGE_SIZE = 10
  const [flightsPage, setFlightsPage] = useState(1)
  const [hotelsPage, setHotelsPage] = useState(1)
  const [trainsPage, setTrainsPage] = useState(1)
  const [taxisPage, setTaxisPage] = useState(1)
  const [ridesPage, setRidesPage] = useState(1)
  // no explicit cityCode required anymore; hotels endpoint will return a sample list when absent
  
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
        const data = await mod.fetchHotelsByCity()
        const list = Array.isArray(data.data) ? data.data : []
        setHotels(list)
        setHotelsPage(1)
      } catch (e) {
        setHotelError(e.message)
      } finally {
        setLoadingHotels(false)
      }
    }

    async function loadFlights() {
      if (activeTab !== 'flights') return
      setLoadingFlights(true)
      setFlightsError(null)
      try {
        const mod = await import('../utils/apiClient')
        const data = await mod.apiFetch('/api/flights?limit=200')
        const list = Array.isArray(data.data) ? data.data : []
        setFlights(list)
        setFlightsPage(1)
      } catch (e) {
        setFlightsError(e.message)
      } finally {
        setLoadingFlights(false)
      }
    }

    async function loadTrains() {
      if (activeTab !== 'trains') return
      setLoadingTrains(true)
      setTrainsError(null)
      try {
        const mod = await import('../utils/apiClient')
        const data = await mod.apiFetch('/api/trains?limit=200')
        const list = Array.isArray(data.data) ? data.data : []
        setTrains(list)
        setTrainsPage(1)
      } catch (e) {
        setTrainsError(e.message)
      } finally {
        setLoadingTrains(false)
      }
    }

    async function loadTaxis() {
      if (activeTab !== 'taxis') return
      setLoadingTaxis(true)
      setTaxisError(null)
      try {
        const mod = await import('../utils/apiClient')
        const data = await mod.apiFetch('/api/taxis?limit=200')
        const list = Array.isArray(data.data) ? data.data : []
        setTaxis(list)
        setTaxisPage(1)
      } catch (e) {
        setTaxisError(e.message)
      } finally {
        setLoadingTaxis(false)
      }
    }

    loadHotels()
    loadFlights()
    loadTrains()
    loadTaxis()
  }, [activeTab])

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
    
    // If a location has IATA code we can still auto-switch to hotels tab
    if (location.iataCode) {
      if (activeTab !== 'hotels') setActiveTab('hotels')
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
                {activeTab === 'flights' && (
                  <>
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-500">Recent Trips</span>
                      </div>

                      {loadingFlights && <div className="text-sm text-gray-500 animate-pulse">Loading flights...</div>}
                      {flightsError && <div className="text-sm text-red-600">{flightsError}</div>}
                      {!loadingFlights && !flightsError && flights.length === 0 && (
                        <div className="text-sm text-gray-500">No flights found.</div>
                      )}

                      <ul className="space-y-3">
                        {(() => {
                          const start = (flightsPage - 1) * PAGE_SIZE
                          const pageItems = flights.slice(start, start + PAGE_SIZE)
                          return pageItems.map(f => (
                            <li key={f.id} className="bg-white rounded-xl shadow border border-gray-100 p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="font-semibold text-sm text-slate-800">{f.airline} — {f.flightNumber}</div>
                                  <div className="text-xs text-gray-500">{f.from?.city || f.from?.code} → {f.to?.city || f.to?.code}</div>
                                  <div className="text-[11px] text-gray-400 mt-1">Depart: {new Date(f.departAt).toLocaleString()}</div>
                                </div>
                                <div className="text-sm font-semibold text-teal-600">₹{f.priceINR}</div>
                              </div>
                            </li>
                          ))
                        })()}
                      </ul>

                      {flights.length > PAGE_SIZE && (
                        <div className="flex items-center justify-between mt-3">
                          <button
                            className="px-3 py-1 rounded bg-white border text-sm"
                            onClick={() => setFlightsPage(p => Math.max(1, p - 1))}
                            disabled={flightsPage === 1}
                          >Prev</button>
                          <div className="text-xs text-gray-500">Page {flightsPage} of {Math.ceil(flights.length / PAGE_SIZE)}</div>
                          <button
                            className="px-3 py-1 rounded bg-white border text-sm"
                            onClick={() => setFlightsPage(p => Math.min(Math.ceil(flights.length / PAGE_SIZE), p + 1))}
                            disabled={flightsPage === Math.ceil(flights.length / PAGE_SIZE)}
                          >Next</button>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {activeTab === 'trains' && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-500">Recent Trains</span>
                    </div>

                    {loadingTrains && <div className="text-sm text-gray-500 animate-pulse">Loading trains...</div>}
                    {trainsError && <div className="text-sm text-red-600">{trainsError}</div>}
                    {!loadingTrains && !trainsError && trains.length === 0 && (
                      <div className="text-sm text-gray-500">No trains found.</div>
                    )}

                    <ul className="space-y-3">
                      {(() => {
                        const start = (trainsPage - 1) * PAGE_SIZE
                        const pageItems = trains.slice(start, start + PAGE_SIZE)
                        return pageItems.map(t => (
                          <li key={t.id} className="bg-white rounded-xl shadow border border-gray-100 p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-semibold text-sm text-slate-800">{t.operator} — {t.trainNumber}</div>
                                <div className="text-xs text-gray-500">{t.from} → {t.to}</div>
                                <div className="text-[11px] text-gray-400 mt-1">Depart: {new Date(t.departAt).toLocaleString()}</div>
                              </div>
                              <div className="text-sm font-semibold text-teal-600">₹{t.priceINR}</div>
                            </div>
                          </li>
                        ))
                      })()}
                    </ul>

                    {trains.length > PAGE_SIZE && (
                      <div className="flex items-center justify-between mt-3">
                        <button
                          className="px-3 py-1 rounded bg-white border text-sm"
                          onClick={() => setTrainsPage(p => Math.max(1, p - 1))}
                          disabled={trainsPage === 1}
                        >Prev</button>
                        <div className="text-xs text-gray-500">Page {trainsPage} of {Math.ceil(trains.length / PAGE_SIZE)}</div>
                        <button
                          className="px-3 py-1 rounded bg-white border text-sm"
                          onClick={() => setTrainsPage(p => Math.min(Math.ceil(trains.length / PAGE_SIZE), p + 1))}
                          disabled={trainsPage === Math.ceil(trains.length / PAGE_SIZE)}
                        >Next</button>
                      </div>
                    )}
                  </div>
                )}

              {activeTab === 'hotels' && (
                <div>
                  <div className="mb-3">
                    <span className="text-xs text-gray-500">Showing hotels from the dataset</span>
                  </div>
                  {loadingHotels && <div className="text-sm text-gray-500 animate-pulse">Loading hotels...</div>}
                  {hotelError && <div className="text-sm text-red-600">{hotelError}</div>}
                  {!loadingHotels && !hotelError && hotels.length === 0 && (
                    <div className="text-sm text-gray-500">No hotels found.</div>
                  )}
                  <ul className="space-y-3">
                    {(() => {
                      const start = (hotelsPage - 1) * PAGE_SIZE
                      const pageItems = hotels.slice(start, start + PAGE_SIZE)
                      return pageItems.map(h => (
                        <li key={h.id || h.hotelId} className="bg-white rounded-xl shadow border border-gray-100 p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-semibold text-sm text-slate-800">{h.name}</div>
                              <div className="text-xs text-gray-500">{[h.city, h.country].filter(Boolean).join(', ')}{h.nearestAirport ? ` ({h.nearestAirport})` : ''}</div>
                              {h.chain && <div className="text-[10px] text-gray-400 mt-1">Chain: {h.chain}</div>}
                              {typeof h.pricePerNightINR !== 'undefined' && (
                                <div className="text-[11px] text-gray-600 mt-1">From ₹{h.pricePerNightINR}</div>
                              )}
                            </div>
                            {h.rating && <span className="text-xs bg-teal-600 text-white px-2 py-1 rounded">{h.rating}★</span>}
                          </div>
                        </li>
                      ))
                    })()}
                  </ul>

                  {hotels.length > PAGE_SIZE && (
                    <div className="flex items-center justify-between mt-3">
                      <button
                        className="px-3 py-1 rounded bg-white border text-sm"
                        onClick={() => setHotelsPage(p => Math.max(1, p - 1))}
                        disabled={hotelsPage === 1}
                      >Prev</button>
                      <div className="text-xs text-gray-500">Page {hotelsPage} of {Math.ceil(hotels.length / PAGE_SIZE)}</div>
                      <button
                        className="px-3 py-1 rounded bg-white border text-sm"
                        onClick={() => setHotelsPage(p => Math.min(Math.ceil(hotels.length / PAGE_SIZE), p + 1))}
                        disabled={hotelsPage === Math.ceil(hotels.length / PAGE_SIZE)}
                      >Next</button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'taxis' && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Drivers</h3>

                  {loadingTaxis && <div className="text-sm text-gray-500 animate-pulse">Loading drivers...</div>}
                  {taxisError && <div className="text-sm text-red-600">{taxisError}</div>}
                  {!loadingTaxis && !taxisError && taxis.length === 0 && (
                    <div className="text-sm text-gray-500">No drivers found.</div>
                  )}

                  <ul className="space-y-3 mt-2">
                    {(() => {
                      const start = (taxisPage - 1) * PAGE_SIZE
                      const pageItems = taxis.slice(start, start + PAGE_SIZE)
                      return pageItems.map(t => (
                        <li key={t.id} className="bg-white rounded-xl shadow border border-gray-100 p-3 flex justify-between items-center">
                          <div>
                            <div className="font-medium text-sm">{t.provider} — {t.driver}</div>
                            <div className="text-xs text-gray-500">Est: ₹{t.estimatedPriceINR} • {t.distanceKm} km</div>
                          </div>
                          <div className="text-xs text-gray-400">{t.vehicle?.make || ''}</div>
                        </li>
                      ))
                    })()}
                  </ul>

                  {taxis.length > PAGE_SIZE && (
                    <div className="flex items-center justify-between mt-3">
                      <button
                        className="px-3 py-1 rounded bg-white border text-sm"
                        onClick={() => setTaxisPage(p => Math.max(1, p - 1))}
                        disabled={taxisPage === 1}
                      >Prev</button>
                      <div className="text-xs text-gray-500">Page {taxisPage} of {Math.ceil(taxis.length / PAGE_SIZE)}</div>
                      <button
                        className="px-3 py-1 rounded bg-white border text-sm"
                        onClick={() => setTaxisPage(p => Math.min(Math.ceil(taxis.length / PAGE_SIZE), p + 1))}
                        disabled={taxisPage === Math.ceil(taxis.length / PAGE_SIZE)}
                      >Next</button>
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
