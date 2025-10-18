
const TOKEN_CACHE = { token: null, expiresAt: 0 };

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
  TOKEN_CACHE.expiresAt = now + (data.expires_in - 30) * 1000; // subtract 30s safety margin
  return TOKEN_CACHE.token;
}

async function fetchHotels(cityCode) {
  const token = await getAccessToken();
  // Using Hotel List by City endpoint (Hotel Name & Basic info)
  const url = new URL('https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city');
  url.searchParams.set('cityCode', cityCode);
  url.searchParams.set('radius', '20'); // optional: radius in km
  const resp = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error('Hotel fetch failed: ' + text);
  }
  const json = await resp.json();
  return json;
}

export default async function handler(req, res) {
  try {
    const { cityCode = 'PAR' } = req.query || {};
    if (!cityCode || cityCode.length !== 3) {
      return res.status(400).json({ error: 'cityCode query param (IATA 3-letter) is required' });
    }
    const data = await fetchHotels(cityCode.toUpperCase());
    return res.status(200).json({ cityCode: cityCode.toUpperCase(), ...data });
  } catch (err) {
    console.error('Hotels API error', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}

export const config = {
  runtime: 'edge'
};
