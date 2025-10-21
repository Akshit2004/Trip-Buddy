import React, { useState } from 'react'
import { requestPlan } from './agentClient'
import GeminiThinkingLoader from '../Components/GeminiThinkingLoader'
import TripPlanDisplay from '../Components/TripPlanDisplay'
import { mockTripPlan, mockOrigin, mockDestination } from './mockData'

export default function AIPlanner() {
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [resp, setResp] = useState(null)
  const [loading, setLoading] = useState(false)
  const [demoMode, setDemoMode] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setLoading(true)
    setResp(null)
    
    try {
      if (demoMode) {
        // Demo mode: Show loader for 8 seconds then display mock data
        await new Promise(resolve => setTimeout(resolve, 8000))
        setResp(mockTripPlan)
      } else {
        // Real mode: Make actual API call
        const data = await requestPlan({ origin, destination })
        setResp(data)
      }
    } catch (err) {
      setResp({ error: err.message })
    } finally {
      setLoading(false)
    }
  }

  const loadDemo = () => {
    setOrigin(mockOrigin)
    setDestination(mockDestination)
    setDemoMode(true)
    setResp(null)
  }

  return (
    <>
      {/* Show Beautiful Loader when planning with smooth transition */}
      <div className={`transition-opacity duration-500 ${loading ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {loading && <GeminiThinkingLoader />}
      </div>
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Demo Mode Toggle */}
          <div className="flex justify-end mb-4">
            <button
              onClick={loadDemo}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full hover:shadow-lg transition-all text-sm font-semibold"
            >
              <span>🎨</span>
              <span>Try Demo</span>
            </button>
          </div>

          {/* Header */}
          <div className="text-center mb-8 animate-fadeIn">
            <div className="inline-block mb-4">
              <div className="text-6xl md:text-7xl mb-4 animate-bounce-slow">✈️</div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent mb-3 drop-shadow-lg">
              AI Trip Planner
            </h1>
            <p className="text-slate-600 text-base md:text-lg font-medium">
              Let Gemini AI craft your perfect journey ✨
            </p>
            <div className="mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span>{demoMode ? 'Demo Mode' : 'AI Powered'}</span>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 mb-8 border border-slate-200 backdrop-blur-sm bg-opacity-95 transform transition-all hover:shadow-3xl hover:scale-[1.01]">
            <form onSubmit={submit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <span className="text-xl">📍</span>
                  <span>Starting Point</span>
                </label>
                <input 
                  value={origin} 
                  onChange={e=>setOrigin(e.target.value)}
                  placeholder="Enter your starting location (e.g., Mumbai, Delhi)"
                  className="w-full px-4 py-4 rounded-xl border-2 border-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 focus:outline-none transition-all text-slate-800 font-medium placeholder:text-slate-400"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <span className="text-xl">🎯</span>
                  <span>Destination</span>
                </label>
                <input 
                  value={destination} 
                  onChange={e=>setDestination(e.target.value)}
                  placeholder="Where do you want to go? (e.g., Goa, Jaipur)"
                  className="w-full px-4 py-4 rounded-xl border-2 border-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 focus:outline-none transition-all text-slate-800 font-medium placeholder:text-slate-400"
                  required
                />
              </div>
              
              <button 
                type="submit" 
                disabled={loading}
                className="relative w-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white font-bold py-4 px-6 rounded-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-pink-700 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="relative flex items-center gap-2">
                  {loading ? (
                    <>
                      <span className="animate-spin">⚡</span>
                      <span>Planning Your Journey...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-xl">✨</span>
                      <span className="text-lg">Plan My Trip</span>
                      <span className="text-xl">🚀</span>
                    </>
                  )}
                </span>
              </button>
            </form>
            
            {/* Quick Tips */}
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
              <p className="text-xs text-blue-800 flex items-start gap-2">
                <span className="text-sm">💡</span>
                <span className="flex-1">
                  <strong>Pro Tip:</strong> {demoMode 
                    ? 'Demo mode shows a sample trip to Goa. Click "Try Demo" to see the beautiful loader and planner design!' 
                    : 'Enter city names in English for best results. The AI will analyze multiple routes and suggest the most optimal journey for you!'}
                </span>
              </p>
            </div>
          </div>

          {/* Results with Fade In Animation */}
          {resp && !resp.error && (
            <div className="animate-fadeInScale">
              <TripPlanDisplay 
                plan={resp} 
                origin={demoMode ? mockOrigin : origin} 
                destination={demoMode ? mockDestination : destination} 
              />
            </div>
          )}
          
          {/* Error State */}
          {resp && resp.error && (
            <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-3xl p-8 text-center shadow-xl animate-fadeIn">
              <div className="mb-4">
                <span className="text-6xl mb-3 block animate-bounce">😕</span>
              </div>
              <p className="text-red-800 font-bold text-xl mb-3">Oops! Something went wrong</p>
              <p className="text-red-600 text-sm mb-4">{resp.error}</p>
              <button 
                onClick={() => setResp(null)}
                className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-colors font-semibold"
              >
                <span>🔄</span>
                <span>Try Again</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
