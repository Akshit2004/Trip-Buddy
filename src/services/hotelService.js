// Frontend service to fetch locations and hotels from Node backend

import { apiFetch } from '../utils/apiClient';

export async function searchLocations(keyword) {
  if (!keyword || keyword.trim().length < 2) {
    return [];
  }
  const data = await apiFetch(`/api/locations/search?keyword=${encodeURIComponent(keyword)}`);
  return data.data || [];
}

export async function fetchHotelsByCity(cityCode) {
  const code = (cityCode || 'PAR').toUpperCase();
  return apiFetch(`/api/hotels?cityCode=${encodeURIComponent(code)}`);
}
