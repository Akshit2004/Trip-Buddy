// Frontend service for Gemini-powered location autocomplete

/**
 * Search for location suggestions using Gemini AI
 * @param {string} query - Location search query
 * @returns {Promise<Array>} Array of location suggestions
 */
import { apiFetch } from '../utils/apiClient';

export async function searchLocationsByGemini(query) {
  if (!query || query.trim().length < 2) {
    return [];
  }
  
  const data = await apiFetch(`/api/locations/gemini?query=${encodeURIComponent(query)}`);
  return data.locations || [];
}
