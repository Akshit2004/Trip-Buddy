import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { planTrip } from './tripAgent.js';

dotenv.config();

// Initialize firebase-admin if service account is available via GOOGLE_APPLICATION_CREDENTIALS
try {
  const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (keyPath) {
    // Resolve relative paths against the current working directory to avoid issues
    const resolvedPath = path.isAbsolute(keyPath) ? keyPath : path.join(process.cwd(), keyPath);
    if (fs.existsSync(resolvedPath)) {
      const serviceAccount = JSON.parse(fs.readFileSync(resolvedPath, 'utf8'));
      admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
      console.log('Firebase Admin initialized using', resolvedPath);
    } else {
      console.warn('GOOGLE_APPLICATION_CREDENTIALS is set but file not found at', resolvedPath);
    }
  } else {
    console.log('GOOGLE_APPLICATION_CREDENTIALS not set — hotels endpoint will be unavailable');
  }
} catch (e) {
  console.error('Failed to initialize Firebase Admin:', e.message || e);
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Token cache for Amadeus OAuth2
const TOKEN_CACHE = { token: null, expiresAt: 0 };

// Get Amadeus access token with caching
async function getAccessToken() {
  const now = Date.now();
  if (TOKEN_CACHE.token && now < TOKEN_CACHE.expiresAt) {
    return TOKEN_CACHE.token;
  }

  const clientId = process.env.AMADEUS_CLIENT_ID;
  const clientSecret = process.env.AMADEUS_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Amadeus credentials are missing');
  }

  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret
  });

  const resp = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error('Failed to obtain token: ' + text);
  }

  const data = await resp.json();
  TOKEN_CACHE.token = data.access_token;
  TOKEN_CACHE.expiresAt = now + (data.expires_in - 30) * 1000; // 30s safety margin

  return TOKEN_CACHE.token;
}

// Search for locations (cities/airports) by keyword
app.get('/api/locations/search', async (req, res) => {
  try {
    const { keyword } = req.query;

    if (!keyword || keyword.trim().length < 2) {
      return res.status(400).json({ error: 'keyword query param (min 2 chars) is required' });
    }

    const token = await getAccessToken();
    const url = new URL('https://test.api.amadeus.com/v1/reference-data/locations');
    url.searchParams.set('keyword', keyword);
    url.searchParams.set('subType', 'CITY,AIRPORT');
    url.searchParams.set('page[limit]', '10');

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error('Location search failed: ' + text);
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Location search error:', err);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
});

// Get hotels by city code (from Firestore collection 'hotels')
app.get('/api/hotels', async (req, res) => {
  try {
    const { cityCode } = req.query;

    const items = readLocalData('hotels.json');
    if (!items) return res.status(404).json({ error: 'hotels data not found' });

    const normalize = (s) => (s || '').toString().toLowerCase();
    let filtered = items;

    if (cityCode && cityCode.trim().length > 0) {
      const c = cityCode.toString().toLowerCase();
      // If user passed a 3-letter IATA code, match nearestAirport or code fields. Otherwise match city or name.
      if (c.length === 3) {
        filtered = items.filter(h => normalize(h.nearestAirport) === c || normalize(h.city) === c || normalize(h.code) === c || normalize(h.name) === c);
      } else {
        filtered = items.filter(h => normalize(h.city).includes(c) || normalize(h.name).includes(c));
      }
    }

    const limit = Math.max(0, Math.min(1000, Number(req.query.limit) || filtered.length));
    res.json({ cityCode: cityCode ? cityCode.toUpperCase() : null, count: filtered.length, data: filtered.slice(0, limit) });
  } catch (err) {
    console.error('Hotels (local) API error:', err);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
});

// Get Uber ride estimates
app.get('/api/uber/estimates', async (req, res) => {
  try {
    const { start_latitude, start_longitude, end_latitude, end_longitude } = req.query;

    if (!start_latitude || !start_longitude || !end_latitude || !end_longitude) {
      return res.status(400).json({ 
        error: 'start_latitude, start_longitude, end_latitude, end_longitude are required' 
      });
    }

    const serverToken = process.env.UBER_SERVER_TOKEN;
    if (!serverToken) {
      throw new Error('Uber server token is missing');
    }

    const url = new URL('https://api.uber.com/v1.2/estimates/price');
    url.searchParams.set('start_latitude', start_latitude);
    url.searchParams.set('start_longitude', start_longitude);
    url.searchParams.set('end_latitude', end_latitude);
    url.searchParams.set('end_longitude', end_longitude);

    const response = await fetch(url, {
      headers: { 
        Authorization: `Token ${serverToken}`,
        'Accept-Language': 'en_US',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error('Uber API failed: ' + text);
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Uber estimates error:', err);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
});

// Get Uber products available at location
app.get('/api/uber/products', async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'latitude and longitude are required' });
    }

    const serverToken = process.env.UBER_SERVER_TOKEN;
    if (!serverToken) {
      throw new Error('Uber server token is missing');
    }

    const url = new URL('https://api.uber.com/v1.2/products');
    url.searchParams.set('latitude', latitude);
    url.searchParams.set('longitude', longitude);

    const response = await fetch(url, {
      headers: { 
        Authorization: `Token ${serverToken}`,
        'Accept-Language': 'en_US',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error('Uber products API failed: ' + text);
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Uber products error:', err);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
});

// Get Uber time estimates
app.get('/api/uber/time', async (req, res) => {
  try {
    const { start_latitude, start_longitude } = req.query;

    if (!start_latitude || !start_longitude) {
      return res.status(400).json({ error: 'start_latitude and start_longitude are required' });
    }

    const serverToken = process.env.UBER_SERVER_TOKEN;
    if (!serverToken) {
      throw new Error('Uber server token is missing');
    }

    const url = new URL('https://api.uber.com/v1.2/estimates/time');
    url.searchParams.set('start_latitude', start_latitude);
    url.searchParams.set('start_longitude', start_longitude);

    const response = await fetch(url, {
      headers: { 
        Authorization: `Token ${serverToken}`,
        'Accept-Language': 'en_US',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error('Uber time API failed: ' + text);
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Uber time estimates error:', err);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
});

// Gemini-powered location autocomplete and geocoding
app.get('/api/locations/gemini', async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({ error: 'query param (min 2 chars) is required' });
    }

    const geminiKey = process.env.VITE_GEMINI_API_KEY;
    if (!geminiKey) {
      throw new Error('Gemini API key is missing');
    }

    const prompt = `Given the location query: "${query}"
    
Please provide a JSON response with location suggestions. For each suggestion, include:
- name: Full location name
- latitude: Approximate latitude coordinate
- longitude: Approximate longitude coordinate
- type: Type of location (city, airport, landmark, address)
- country: Country name

Return up to 5 relevant location suggestions as a JSON array.

Example format:
[
  {
    "name": "San Francisco, California, USA",
    "latitude": 37.7749,
    "longitude": -122.4194,
    "type": "city",
    "country": "USA"
  }
]

Return ONLY the JSON array, no other text.`;

    const response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        })
      }
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error('Gemini API failed: ' + text);
    }

    const data = await response.json();
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
    
    // Extract JSON from response (remove markdown code blocks if present)
    let jsonText = textResponse.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/, '').replace(/```$/, '').trim();
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/, '').replace(/```$/, '').trim();
    }
    
    const locations = JSON.parse(jsonText);
    res.json({ locations: Array.isArray(locations) ? locations : [] });
  } catch (err) {
    console.error('Gemini location error:', err);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Plan trip endpoint - accepts origin, destination, dates, preferences
app.post('/api/plan-trip', async (req, res) => {
  try {
    const body = req.body || {}
    const { origin, destination, startDate, endDate, preferences } = body

    // Basic validation
    if (!origin || !destination) {
      return res.status(400).json({ error: 'origin and destination are required' })
    }

    // If an N8N webhook is configured, forward the request there and return the response
    const n8nUrl = process.env.N8N_WEBHOOK_URL
    if (n8nUrl) {
      const forwardResp = await fetch(n8nUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ origin, destination, startDate, endDate, preferences })
      })

      if (!forwardResp.ok) {
        const text = await forwardResp.text()
        throw new Error('n8n webhook failed: ' + text)
      }

      const data = await forwardResp.json()
      return res.json({ source: 'n8n', plan: data })
    }

    // No n8n configured: run a simple local planner using existing datasets
    // Read local datasets
    const flights = readLocalData('flights.json') || []
    const trains = readLocalData('trains.json') || []
    const taxis = readLocalData('taxis.json') || []
    const hotelsSnapshot = readLocalData('hotels.json') || []

    // Very simple matching: find cheapest flight/trains between origin/destination (match by code or city)
    const normalize = (s) => (s || '').toString().toLowerCase()
    const o = normalize(origin)
    const d = normalize(destination)

    const matchFlight = flights.filter(f => (normalize(f.from?.city) === o || normalize(f.from?.code) === o) && (normalize(f.to?.city) === d || normalize(f.to?.code) === d))
    const matchTrain = trains.filter(t => (normalize(t.from?.city) === o || normalize(t.from?.code) === o) && (normalize(t.to?.city) === d || normalize(t.to?.code) === d))
    const matchHotels = hotelsSnapshot.filter(h => normalize(h.city) === d || normalize(h.name) === d)

    const cheapestFlight = matchFlight.sort((a,b)=> (a.priceINR||Infinity)-(b.priceINR||Infinity))[0] || null
    const fastestFlight = matchFlight.sort((a,b)=> new Date(a.departAt) - new Date(b.departAt))[0] || null

    const cheapestTrain = matchTrain.sort((a,b)=> (a.priceINR||Infinity)-(b.priceINR||Infinity))[0] || null

    const taxiOptions = taxis.slice(0,3)

    const plan = {
      origin,
      destination,
      startDate,
      endDate,
      preferences,
      flights: {
        cheapest: cheapestFlight,
        fastest: fastestFlight,
        matchesCount: matchFlight.length
      },
      trains: {
        cheapest: cheapestTrain,
        matchesCount: matchTrain.length
      },
      hotels: {
        suggestions: matchHotels.slice(0,5),
        count: matchHotels.length
      },
      taxis: taxiOptions
    }

    return res.json({ source: 'local', plan })
  } catch (err) {
    console.error('Plan trip error:', err)
    res.status(500).json({ error: err.message || 'Internal Server Error' })
  }
})

// AI-powered planning endpoint using Gemini and Firestore/local data
app.post('/api/ai/plan', async (req, res) => {
  try {
    const payload = req.body || {};
    const result = await planTrip(payload);
    res.json(result);
  } catch (err) {
    console.error('AI plan error:', err);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
});

// Serve local dataset files (generated in /data)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function readLocalData(filename) {
  const full = path.join(__dirname, '..', 'data', filename);
  if (!fs.existsSync(full)) return null;
  return JSON.parse(fs.readFileSync(full, 'utf8'));
}

// GET /api/flights?limit=100
app.get('/api/flights', (req, res) => {
  try {
    const items = readLocalData('flights.json');
    if (!items) return res.status(404).json({ error: 'flights data not found' });
    const limit = Math.max(0, Math.min(1000, Number(req.query.limit) || items.length));
    res.json({ count: items.length, data: items.slice(0, limit) });
  } catch (err) {
    console.error('Flights API error:', err);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
});

// GET /api/trains?limit=100
app.get('/api/trains', (req, res) => {
  try {
    const items = readLocalData('trains.json');
    if (!items) return res.status(404).json({ error: 'trains data not found' });
    const limit = Math.max(0, Math.min(1000, Number(req.query.limit) || items.length));
    res.json({ count: items.length, data: items.slice(0, limit) });
  } catch (err) {
    console.error('Trains API error:', err);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
});

// GET /api/taxis?limit=100
app.get('/api/taxis', (req, res) => {
  try {
    const items = readLocalData('taxis.json');
    if (!items) return res.status(404).json({ error: 'taxis data not found' });
    const limit = Math.max(0, Math.min(1000, Number(req.query.limit) || items.length));
    res.json({ count: items.length, data: items.slice(0, limit) });
  } catch (err) {
    console.error('Taxis API error:', err);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});
