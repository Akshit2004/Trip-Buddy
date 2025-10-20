import React, { useState } from 'react'
import { requestPlan } from './agentClient'

export default function AIPlanner() {
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [resp, setResp] = useState(null)
  const [loading, setLoading] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setLoading(true)
    setResp(null)
    try {
      const data = await requestPlan({ origin, destination })
      setResp(data)
    } catch (err) {
      setResp({ error: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: 12 }}>
      <h3>AI Trip Planner</h3>
      <form onSubmit={submit}>
        <div>
          <label>Origin</label>
          <input value={origin} onChange={e=>setOrigin(e.target.value)} />
        </div>
        <div>
          <label>Destination</label>
          <input value={destination} onChange={e=>setDestination(e.target.value)} />
        </div>
        <button type="submit" disabled={loading}>Plan</button>
      </form>
      <pre style={{ whiteSpace: 'pre-wrap', marginTop: 12 }}>{JSON.stringify(resp, null, 2)}</pre>
    </div>
  )
}
