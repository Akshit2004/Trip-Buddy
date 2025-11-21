// Frontend service to fetch locations and hotels from Node backend

import { apiFetch } from '../utils/apiClient';

// Build location suggestions from demo data (hotels + flights) instead of Amadeus.
export async function searchLocations(keyword) {
  if (!keyword || keyword.trim().length < 2) return [];
  const q = keyword.trim().toLowerCase();

  try {
    // Fetch demo data in parallel
    const [hotelsResp, flightsResp] = await Promise.all([
      apiFetch('/api/hotels?limit=1000').catch(() => ({ data: [] })),
      apiFetch('/api/flights?limit=1000').catch(() => ({ data: [] }))
    ]);

    const hotels = Array.isArray(hotelsResp.data) ? hotelsResp.data : [];
    const flights = Array.isArray(flightsResp.data) ? flightsResp.data : [];

    const suggestionsMap = new Map();

    // From hotels: use city & country, include nearestAirport as iataCode
    for (const h of hotels) {
      const city = (h.city || '').toString().trim();
      const country = (h.country || '').toString().trim();
      if (!city) continue;
      const key = `${city.toLowerCase()}|${country.toLowerCase()}`;
      if (!suggestionsMap.has(key)) {
        suggestionsMap.set(key, {
          id: `hotel-${h.id || city}`,
          name: country ? `${city}, ${country}` : city,
          address: { cityName: city, countryName: country },
          iataCode: h.nearestAirport || null
        });
      }
    }

    // From flights: use from/to city or code
    for (const f of flights) {
      const fromCity = f.from?.city || f.from?.code || '';
      const toCity = f.to?.city || f.to?.code || '';
      const candidates = [fromCity, toCity].filter(Boolean);
      for (const c of candidates) {
        const city = c.toString().trim();
        if (!city) continue;
        const key = `${city.toLowerCase()}|`;
        if (!suggestionsMap.has(key)) {
          suggestionsMap.set(key, {
            id: `flight-${city}`,
            name: city,
            address: { cityName: city, countryName: '' },
            iataCode: (city.length === 3 ? city.toUpperCase() : null)
          });
        }
      }
    }

    // Convert to array and filter by keyword
    const all = Array.from(suggestionsMap.values());
    const filtered = all.filter(s => {
      const name = (s.name || '').toLowerCase();
      const city = (s.address?.cityName || '').toLowerCase();
      const code = (s.iataCode || '').toLowerCase();
      return name.includes(q) || city.includes(q) || code.includes(q) || city.startsWith(q);
    });

    // Return up to 10 suggestions
    return filtered.slice(0, 10);
  } catch (e) {
    console.error('Demo searchLocations error:', e);
    return [];
  }
}

export async function fetchHotelsByCity(cityCode) {
  if (!cityCode) {
    return apiFetch(`/api/hotels`);
  }
  const code = String(cityCode).toUpperCase();
  return apiFetch(`/api/hotels?cityCode=${encodeURIComponent(code)}`);
}
