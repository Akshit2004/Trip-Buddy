import fetch from 'node-fetch';
import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

// Helper to read local dataset as fallback
function readLocalData(dirname, filename) {
  const full = path.join(dirname, '..', 'data', filename);
  if (!fs.existsSync(full)) return null;
  return JSON.parse(fs.readFileSync(full, 'utf8'));
}

// --- Simple hub model and helpers for intermodal routing ---
const HUBS = [
  { code: 'DEL', city: 'New Delhi', lat: 28.5562, lon: 77.1000 },
  { code: 'BOM', city: 'Mumbai', lat: 19.0896, lon: 72.8656 },
  { code: 'GOI', city: 'Goa', lat: 15.3800, lon: 73.8313 },
  { code: 'IXC', city: 'Chandigarh', lat: 30.6743, lon: 76.7885 },
  { code: 'PNQ', city: 'Pune', lat: 18.5800, lon: 73.9200 },
  { code: 'HYD', city: 'Hyderabad', lat: 17.2403, lon: 78.4294 },
  { code: 'BLR', city: 'Bengaluru', lat: 13.1986, lon: 77.7066 },
  { code: 'MAA', city: 'Chennai', lat: 12.9941, lon: 80.1709 },
  { code: 'TRV', city: 'Thiruvananthapuram', lat: 8.4821, lon: 76.9201 },
  { code: 'CCU', city: 'Kolkata', lat: 22.6547, lon: 88.4467 },
  { code: 'AMD', city: 'Ahmedabad', lat: 23.0746, lon: 72.6347 },
  { code: 'JAI', city: 'Jaipur', lat: 26.8240, lon: 75.8122 },
  { code: 'NAG', city: 'Nagpur', lat: 21.0933, lon: 79.0560 }
];

const HUB_BY_CODE = Object.fromEntries(HUBS.map(h => [h.code, h]));

function normalize(s) { return (s || '').toString().trim(); }
function normLower(s) { return normalize(s).toLowerCase(); }

function resolveCityToHub(cityOrCode) {
  const s = normalize(cityOrCode);
  if (!s) return HUB_BY_CODE['DEL'];
  const up = s.toUpperCase();
  // exact 3-letter match first
  if (/^[A-Z]{3}$/.test(up) && HUB_BY_CODE[up]) return HUB_BY_CODE[up];
  // direct city match
  const byCity = HUBS.find(h => normLower(h.city) === normLower(s));
  if (byCity) return byCity;
  // includes match
  const incl = HUBS.find(h => normLower(h.city).includes(normLower(s)) || normLower(s).includes(normLower(h.city)));
  if (incl) return incl;
  // heuristic mapping for a few non-hub towns
  const SPECIAL = {
    'solan': 'IXC', // Solan -> Chandigarh
    'panaji': 'GOI', 'panjim': 'GOI', 'goa': 'GOI',
  };
  const m = SPECIAL[normLower(s)];
  if (m && HUB_BY_CODE[m]) return HUB_BY_CODE[m];
  // default to Delhi as a well-connected super hub
  return HUB_BY_CODE['DEL'];
}

// Trains dataset uses values like "VTZ47"; derive IATA-like code from leading letters
function iataFromTrainCode(val) {
  const letters = (val || '').toString().toUpperCase().replace(/[^A-Z]/g, '');
  if (letters.length >= 3) return letters.slice(0,3);
  return letters || null;
}

// Very rough ground leg estimator when moving between city and hub
function estimateGroundLeg(fromName, toName, mode = 'bus') {
  // If we know both are hubs, use haversine distance; otherwise default ~60km
  const A = HUBS.find(h => normLower(h.city) === normLower(fromName) || h.code === fromName);
  const B = HUBS.find(h => normLower(h.city) === normLower(toName) || h.code === toName);
  let km = 60; // default short transfer
  if (A && B) {
    const R = 6371; // km
    const dLat = (Math.PI/180) * (B.lat - A.lat);
    const dLon = (Math.PI/180) * (B.lon - A.lon);
    const a = Math.sin(dLat/2)**2 + Math.cos(A.lat*Math.PI/180)*Math.cos(B.lat*Math.PI/180)*Math.sin(dLon/2)**2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    km = Math.max(10, Math.round(R * c));
  }
  const speedKmh = mode === 'bus' ? 40 : 30; // bus faster than generic local transit
  const pricePerKm = mode === 'bus' ? 8 : 15; // INR per km heuristics
  const durationMinutes = Math.round((km / speedKmh) * 60);
  const priceINR = Math.round(km * pricePerKm);
  return { mode, from: fromName, to: toName, distanceKm: km, durationMinutes, priceINR };
}

function pickCheapest(items, n = 1, getPrice = x => x.priceINR || Infinity) {
  return [...items].sort((a,b)=> getPrice(a) - getPrice(b)).slice(0, n);
}

function legsSummaryPrice(legs) { return legs.reduce((sum,l)=> sum + (l.priceINR || 0), 0); }
function legsSummaryDuration(legs) { return legs.reduce((sum,l)=> sum + (l.durationMinutes || 0), 0); }

// Build intermodal route candidates using hubs + available flights/trains
function buildIntermodalRoutes(origin, destination, datasets = {}) {
  const { flights = [], trains = [] } = datasets || {};
  const originHub = resolveCityToHub(origin);
  const destHub = resolveCityToHub(destination);

  // Index flights by from->to
  const flightsFT = new Map(); // key `${from}-${to}` -> array
  for (const f of flights) {
    if (!f?.from?.code || !f?.to?.code) continue;
    const key = `${f.from.code}-${f.to.code}`;
    if (!flightsFT.has(key)) flightsFT.set(key, []);
    flightsFT.get(key).push(f);
  }
  // Index trains similarly using derived codes
  const trainsFT = new Map();
  for (const t of trains) {
    const fromCode = iataFromTrainCode(t.from);
    const toCode = iataFromTrainCode(t.to);
    if (!fromCode || !toCode) continue;
    const key = `${fromCode}-${toCode}`;
    if (!trainsFT.has(key)) trainsFT.set(key, []);
    trainsFT.get(key).push({ ...t, fromCode, toCode });
  }

  function getFlights(fromCode, toCode) { return flightsFT.get(`${fromCode}-${toCode}`) || []; }
  function getTrains(fromCode, toCode) { return trainsFT.get(`${fromCode}-${toCode}`) || []; }

  const routes = [];

  // Helper to compose a route with optional ground legs to/from hubs
  function addRoute(innerLegs, label) {
    const preLegs = normLower(origin) === normLower(originHub.city) || origin.toUpperCase() === originHub.code
      ? [] : [estimateGroundLeg(origin, originHub.city, 'bus')];
    const postLegs = normLower(destination) === normLower(destHub.city) || destination.toUpperCase() === destHub.code
      ? [] : [estimateGroundLeg(destHub.city, destination, 'bus')];
    const legs = [...preLegs, ...innerLegs, ...postLegs];
    routes.push({ label, legs, totalPriceINR: legsSummaryPrice(legs), totalDurationMinutes: legsSummaryDuration(legs) });
  }

  // 1) Direct flight
  const directFlights = pickCheapest(getFlights(originHub.code, destHub.code), 1, f=>f.priceINR);
  if (directFlights.length) {
    addRoute([
      { mode: 'flight', from: originHub.code, to: destHub.code, ...directFlights[0] }
    ], 'Direct flight');
  }

  // 2) Direct train
  const directTrains = pickCheapest(getTrains(originHub.code, destHub.code), 1, t=>t.priceINR);
  if (directTrains.length) {
    const t = directTrains[0];
    addRoute([
      { 
        mode: 'train', 
        from: originHub.code, 
        to: destHub.code,
        operator: t.operator,
        trainNumber: t.trainNumber,
        departAt: t.departAt,
        arriveAt: t.arriveAt,
        durationMinutes: t.durationMinutes,
        priceINR: t.priceINR
      }
    ], 'Direct train');
  }

  // 3) One-stop via hub (flight + flight)
  for (const mid of HUBS) {
    if (mid.code === originHub.code || mid.code === destHub.code) continue;
    const leg1 = pickCheapest(getFlights(originHub.code, mid.code), 1, f=>f.priceINR);
    const leg2 = pickCheapest(getFlights(mid.code, destHub.code), 1, f=>f.priceINR);
    if (leg1.length && leg2.length) {
      addRoute([
        { mode: 'flight', from: originHub.code, to: mid.code, ...leg1[0] },
        { mode: 'flight', from: mid.code, to: destHub.code, ...leg2[0] },
      ], `1-stop via ${mid.city}`);
    }
  }

  // 4) Mixed (train then flight) via mid hub
  for (const mid of HUBS) {
    if (mid.code === originHub.code || mid.code === destHub.code) continue;
    const t1 = pickCheapest(getTrains(originHub.code, mid.code), 1, x=>x.priceINR);
    const f2 = pickCheapest(getFlights(mid.code, destHub.code), 1, x=>x.priceINR);
    if (t1.length && f2.length) {
      const t = t1[0];
      addRoute([
        { 
          mode: 'train', 
          from: originHub.code, 
          to: mid.code,
          operator: t.operator,
          trainNumber: t.trainNumber,
          departAt: t.departAt,
          arriveAt: t.arriveAt,
          durationMinutes: t.durationMinutes,
          priceINR: t.priceINR
        },
        { mode: 'flight', from: mid.code, to: destHub.code, ...f2[0] },
      ], `Train to ${mid.city}, then flight`);
    }
  }

  // 5) Mixed (flight then train)
  for (const mid of HUBS) {
    if (mid.code === originHub.code || mid.code === destHub.code) continue;
    const f1 = pickCheapest(getFlights(originHub.code, mid.code), 1, x=>x.priceINR);
    const t2 = pickCheapest(getTrains(mid.code, destHub.code), 1, x=>x.priceINR);
    if (f1.length && t2.length) {
      const t = t2[0];
      addRoute([
        { mode: 'flight', from: originHub.code, to: mid.code, ...f1[0] },
        { 
          mode: 'train', 
          from: mid.code, 
          to: destHub.code,
          operator: t.operator,
          trainNumber: t.trainNumber,
          departAt: t.departAt,
          arriveAt: t.arriveAt,
          durationMinutes: t.durationMinutes,
          priceINR: t.priceINR
        },
      ], `Flight to ${mid.city}, then train`);
    }
  }

  // If nothing found, at least offer a pure ground transfer as a placeholder
  if (routes.length === 0) {
    addRoute([], 'Ground-only (no air/rail match)');
  }

  // De-duplicate by leg signatures and pick top few by total price
  const unique = new Map();
  for (const r of routes) {
    const key = r.legs.map(l=>`${l.mode}:${l.from}-${l.to}`).join('|');
    if (!unique.has(key)) unique.set(key, r);
    else if (r.totalPriceINR < unique.get(key).totalPriceINR) unique.set(key, r);
  }
  return [...unique.values()].sort((a,b)=> a.totalPriceINR - b.totalPriceINR).slice(0, 5);
}

/**
 * planTrip: assemble data from Firestore (if available) or local files,
 * then call Gemini to produce a human-friendly itinerary JSON.
 *
 * Input: { origin, destination, startDate, endDate, preferences }
 * Output: { source: 'ai', plan: {...}, rawGeminiResponse }
 */
export async function planTrip(payload, options = {}) {
  const { origin, destination, startDate, endDate, preferences } = payload || {};
  const geminiKey = process.env.VITE_GEMINI_API_KEY;
  const dirname = path.resolve(path.dirname(''));

  // Gather datasets: prefer Firestore when admin initialized
  let flights = [];
  let trains = [];
  let hotels = [];
  try {
    if (admin.apps && admin.apps.length > 0) {
      const db = admin.firestore();
      const flightsSnap = await db.collection('flights').limit(500).get().catch(()=>null);
      const trainsSnap = await db.collection('trains').limit(500).get().catch(()=>null);
      const hotelsSnap = await db.collection('hotels').limit(500).get().catch(()=>null);
      if (flightsSnap && !flightsSnap.empty) flights = flightsSnap.docs.map(d=>({id:d.id,...d.data()}));
      if (trainsSnap && !trainsSnap.empty) trains = trainsSnap.docs.map(d=>({id:d.id,...d.data()}));
      if (hotelsSnap && !hotelsSnap.empty) hotels = hotelsSnap.docs.map(d=>({id:d.id,...d.data()}));
    }
  } catch (e) {
    // ignore and fallback to local data
  }

  // Fallback to local JSON files if empty
  // Fix path for Windows: import.meta.url gives file:///d:/... on Windows
  const fileUrl = new URL(import.meta.url);
  let serverDir;
  if (fileUrl.protocol === 'file:') {
    // Decode URL-encoded characters and fix Windows path
    serverDir = decodeURIComponent(fileUrl.pathname);
    // Remove leading slash on Windows (turns /d:/path into d:/path)
    if (process.platform === 'win32' && serverDir.startsWith('/')) {
      serverDir = serverDir.substring(1);
    }
    serverDir = path.dirname(serverDir);
  } else {
    serverDir = process.cwd();
  }
  
  if (!flights || flights.length === 0) {
    flights = readLocalData(serverDir, 'flights.json') || [];
  }
  if (!trains || trains.length === 0) {
    trains = readLocalData(serverDir, 'trains.json') || [];
  }
  if (!hotels || hotels.length === 0) {
    hotels = readLocalData(serverDir, 'hotels.json') || [];
  }

  // Build intermodal candidates via hubs (multi-leg: ground + flight/train combinations)
  const matchHotels = hotels.filter(h => normLower(h.city)===normLower(destination) || normLower(h.name)===normLower(destination) || normLower(h.nearestAirport)===normLower(destination));
  const routeCandidates = buildIntermodalRoutes(origin, destination, { flights, trains });

  // Build prompt for Gemini
  const prompt = `You are a travel planning assistant. Plan a realistic point-to-point trip using MULTI-LEG, INTERMODAL routing when needed.

Constraints and behavior:
- If origin isn't a major hub, add a ground transfer (prefer bus; taxi if needed) to the nearest hub.
- Prefer 0–1 stop flight/train combos between hubs; include sensible layovers (≥90 min for flight–flight, ≥45 min train–flight).
- If no direct option exists, propose 1-stop via a well-connected hub (e.g., Delhi, Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata, Jaipur, Ahmedabad, Chandigarh).
- Keep total travel time and cost reasonable; do not invent airlines or times not provided.

Input:
origin: ${origin}
destination: ${destination}
startDate: ${startDate}
endDate: ${endDate}
preferences: ${JSON.stringify(preferences || {})}

Available route candidates (ranked by estimated total price):
${JSON.stringify(routeCandidates, null, 2)}

Hotel options near destination (top few):
${JSON.stringify(matchHotels.slice(0,5), null, 2)}

Task:
1) Choose the best route (or two alternatives) from the candidates and construct an itinerary with these legs in order (include mode, from, to, departAt, arriveAt, priceINR when available; for ground legs, use the provided estimates).
2) Build a day-by-day itinerary from startDate to endDate with activities and transfers.
3) Output strictly valid JSON with keys:
   - itinerary: array of days (date, activities, transfers[])
   - route: the selected legs in order
   - alternatives: up to 2 other route options (summary only)
   - recommendedBookings: { flights:[], trains:[], ground:[], hotel:{...} }
   - estimatedCosts: { transportTotalINR, accommodationPerNightINR, totalINR }
   - notes: string
Return ONLY JSON.`;

  // If no Gemini key, return the best local candidate route and hotel suggestions
  if (!geminiKey) {
    const best = routeCandidates[0] || { legs: [], totalPriceINR: 0, totalDurationMinutes: 0 };
    return { 
      source: 'local', 
      plan: { 
        origin, destination, startDate, endDate, preferences,
        route: best,
        hotels: matchHotels.slice(0,5)
      }, 
      rawGeminiResponse: null 
    };
  }

  // Call Gemini
  const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
  });

  if (!resp.ok) {
    const t = await resp.text().catch(()=>null);
    throw new Error('Gemini API failed: ' + (t || resp.statusText));
  }

  const data = await resp.json();
  const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  let jsonText = textResponse.trim();
  if (jsonText.startsWith('```json')) jsonText = jsonText.replace(/```json\n?/, '').replace(/```$/, '').trim();
  else if (jsonText.startsWith('```')) jsonText = jsonText.replace(/```\n?/, '').replace(/```$/, '').trim();

  let parsed = null;
  try { parsed = JSON.parse(jsonText); } catch (e) { parsed = { error: 'Failed to parse Gemini response', raw: jsonText }; }

  return { source: 'ai', plan: parsed, rawGeminiResponse: data };
}
