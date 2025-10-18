import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

// Initialize firebase-admin if service account is available via GOOGLE_APPLICATION_CREDENTIALS
try {
  const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (keyPath) {
    const serviceAccount = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    console.log('Firebase Admin initialized using', keyPath);
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

    if (!admin.apps || admin.apps.length === 0) {
      return res.status(500).json({ error: 'Firebase admin not initialized on server' });
    }

    const db = admin.firestore();
    let snapshot;
    if (cityCode && cityCode.length === 3) {
      const code = cityCode.toUpperCase();
      // Query hotels where nearestAirport matches the IATA code, fallback to city field
      let query = db.collection('hotels').where('nearestAirport', '==', code).limit(500);
      snapshot = await query.get();
      if (snapshot.empty) {
        query = db.collection('hotels').where('city', '==', code).limit(500);
        snapshot = await query.get();
      }
    } else {
      // No cityCode provided: return a sample/list of hotels (limit to 500)
      snapshot = await db.collection('hotels').limit(500).get();
    }

    const items = [];
    snapshot.forEach(doc => items.push({ id: doc.id, ...doc.data() }));
    res.json({ cityCode: cityCode ? cityCode.toUpperCase() : null, count: items.length, data: items });
  } catch (err) {
    console.error('Hotels (Firestore) API error:', err);
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
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${geminiKey}`,
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
  console.log(`📍 Endpoints available:`);
  console.log(`   - GET /api/locations/search?keyword=<location>`);
  console.log(`   - GET /api/locations/gemini?query=<location>`);
  console.log(`   - GET /api/hotels?cityCode=<IATA>`);
  console.log(`   - GET /api/uber/estimates?start_latitude=<lat>&start_longitude=<lng>&end_latitude=<lat>&end_longitude=<lng>`);
  console.log(`   - GET /api/uber/products?latitude=<lat>&longitude=<lng>`);
  console.log(`   - GET /api/uber/time?start_latitude=<lat>&start_longitude=<lng>`);
  console.log(`   - GET /api/health`);
});
