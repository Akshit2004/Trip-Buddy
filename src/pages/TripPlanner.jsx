import React, { useState } from 'react'
import TopNav from '../Components/TopNav'
import BottomNav from '../Components/BottomNav'
import TripPlanDisplay from '../Components/TripPlanDisplay'
import { planTrip } from '../services/plannerService'

export default function TripPlanner() {
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [preferences, setPreferences] = useState({ prioritize: 'balanced' })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    setError(null)
    setResult(null)
    setLoading(true)
    try {
      const payload = { origin, destination, startDate, endDate, preferences }
      const res = await planTrip(payload)
      setResult(res)
    } catch (err) {
      setError(err.message || String(err))
    } finally {
      setLoading(false)
    }
  }

  const getPreferenceIcon = (preference) => {
    switch (preference) {
      case 'cheapest':
        return '💰'
      case 'fastest':
        return '⚡'
      default:
        return '⚖️'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <TopNav title="Trip Planner" />
      
      <div className="max-w-md mx-auto px-4 pb-28 pt-4">
        <main>
          {/* Header Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Plan Your Journey</h2>
            <p className="text-sm text-slate-500">Enter your details to get personalized travel recommendations</p>
          </div>

          {/* Form Card */}
          <form onSubmit={submit} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-5">
            
            {/* Origin Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 flex items-center gap-2">
                <span className="text-lg">📍</span>
                From
              </label>
              <input 
                value={origin} 
                onChange={(e) => setOrigin(e.target.value)} 
                placeholder="Enter departure city" 
                className="w-full rounded-xl px-4 py-3 border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Destination Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 flex items-center gap-2">
                <span className="text-lg">🎯</span>
                To
              </label>
              <input 
                value={destination} 
                onChange={(e) => setDestination(e.target.value)} 
                placeholder="Enter destination city" 
                className="w-full rounded-xl px-4 py-3 border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Date Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <span className="text-lg">📅</span>
                  Start
                </label>
                <input 
                  type="date" 
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)} 
                  className="w-full rounded-xl px-3 py-3 border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <span className="text-lg">📅</span>
                  End
                </label>
                <input 
                  type="date" 
                  value={endDate} 
                  onChange={(e) => setEndDate(e.target.value)} 
                  className="w-full rounded-xl px-3 py-3 border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm"
                />
              </div>
            </div>

            {/* Preference Section */}
            <div className="space-y-3 pt-2">
              <label className="block text-sm font-semibold text-slate-700 flex items-center gap-2">
                <span className="text-lg">✨</span>
                Travel Preference
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['balanced', 'cheapest', 'fastest'].map((pref) => (
                  <button
                    key={pref}
                    type="button"
                    onClick={() => setPreferences({ ...preferences, prioritize: pref })}
                    className={`py-3 px-3 rounded-xl font-semibold text-xs transition-all duration-200 flex flex-col items-center gap-1.5 ${
                      preferences.prioritize === pref
                        ? 'bg-teal-600 text-white shadow-lg shadow-teal-200'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    <span className="text-lg">{getPreferenceIcon(pref)}</span>
                    <span className="capitalize">{pref}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button 
              disabled={loading} 
              className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:bg-slate-400 text-white font-semibold transition-all duration-200 flex items-center justify-center gap-2 mt-6 shadow-lg shadow-teal-200 hover:shadow-teal-300"
            >
              {loading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Planning...
                </>
              ) : (
                <>
                  <span>✈️</span>
                  Plan My Trip
                </>
              )}
            </button>
          </form>

          {/* Results Section */}
          <div className="mt-8">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3">
                <span className="text-xl">❌</span>
                <div>
                  <p className="font-semibold text-red-900 text-sm">Error</p>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            )}
            
            {result && result.plan && (
              <>
                <TripPlanDisplay 
                  plan={result.plan} 
                  origin={origin} 
                  destination={destination} 
                />

                <button 
                  onClick={() => {
                    setResult(null)
                    setOrigin('')
                    setDestination('')
                    setStartDate('')
                    setEndDate('')
                  }}
                  className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-all mt-4 shadow-sm"
                >
                  Plan Another Trip
                </button>
              </>
            )}
          </div>
        </main>
      </div>
      
      <BottomNav />

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
