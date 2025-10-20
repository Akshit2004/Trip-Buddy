import { apiFetch } from '../utils/apiClient'

/**
 * Send a trip planning request to the backend AI planner.
 * Uses the new intermodal routing logic with Gemini AI.
 */
export async function planTrip(payload) {
  return apiFetch('/api/ai/plan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
}

export default { planTrip }
