export async function requestPlan(payload) {
  const resp = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/ai/plan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  if (!resp.ok) {
    const t = await resp.text().catch(()=>null)
    throw new Error('AI plan request failed: ' + (t || resp.statusText))
  }
  return resp.json()
}
