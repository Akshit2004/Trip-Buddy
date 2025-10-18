// Small helper to centralize API base URL for frontend fetches
const API_BASE = (import.meta && import.meta.env && import.meta.env.VITE_API_BASE_URL) || '';

export function apiUrl(path) {
  // allow absolute paths and paths starting with /api
  if (!path) return API_BASE || '';
  // if path already contains protocol, return as-is
  if (/^https?:\/\//i.test(path)) return path;
  // ensure leading slash
  const p = path.startsWith('/') ? path : `/${path}`;
  return API_BASE ? `${API_BASE}${p}` : p;
}

export async function apiFetch(path, opts = {}) {
  const url = apiUrl(path);
  const resp = await fetch(url, opts);
  if (!resp.ok) {
    const text = await resp.text();
    const err = new Error(`${resp.status} - ${text}`);
    err.status = resp.status;
    throw err;
  }
  return resp.json();
}

export default { apiUrl, apiFetch };
