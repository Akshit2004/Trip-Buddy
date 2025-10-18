// Frontend service to fetch Uber ride information from Node backend

/**
 * Get price estimates for rides between two locations
 * @param {number} startLat - Starting latitude
 * @param {number} startLng - Starting longitude
 * @param {number} endLat - Ending latitude
 * @param {number} endLng - Ending longitude
 * @returns {Promise<Object>} Uber price estimates
 */
import { apiFetch, apiUrl } from '../utils/apiClient';

export async function getUberPriceEstimates(startLat, startLng, endLat, endLng) {
  const params = new URLSearchParams({
    start_latitude: startLat,
    start_longitude: startLng,
    end_latitude: endLat,
    end_longitude: endLng
  });

  return apiFetch(`/api/uber/estimates?${params}`);
}

/**
 * Get available Uber products at a location
 * @param {number} latitude - Location latitude
 * @param {number} longitude - Location longitude
 * @returns {Promise<Object>} Available Uber products
 */
export async function getUberProducts(latitude, longitude) {
  const params = new URLSearchParams({ latitude, longitude });
  return apiFetch(`/api/uber/products?${params}`);
}

/**
 * Get time estimates for Uber rides from a location
 * @param {number} startLat - Starting latitude
 * @param {number} startLng - Starting longitude
 * @returns {Promise<Object>} Uber time estimates
 */
export async function getUberTimeEstimates(startLat, startLng) {
  const params = new URLSearchParams({
    start_latitude: startLat,
    start_longitude: startLng
  });
  return apiFetch(`/api/uber/time?${params}`);
}
