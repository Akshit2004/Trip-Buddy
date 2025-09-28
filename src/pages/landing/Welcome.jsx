import React from 'react'
import { Link } from 'react-router-dom'

export default function Welcome() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-16 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950">
      <div className="max-w-3xl text-center space-y-8">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight gradient-text">
          Trip Buddy
        </h1>
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
          Plan smarter journeys, compare routes in real time, and personalize every trip
          with intelligent recommendations tailored to what matters most to you—saving
          time, money, or discovering something new.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg shadow-sm hover:shadow transition text-center">
            Sign In
          </Link>
          <a href="#features" className="border border-slate-300 dark:border-slate-600 hover:border-blue-500 text-slate-700 dark:text-slate-200 px-6 py-3 rounded-lg transition text-center">
            Learn More
          </a>
        </div>
        <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-500 dark:text-slate-400">
          <div className="p-3 rounded-md bg-white/60 dark:bg-slate-800/40 backdrop-blur shadow-sm">Live Routes</div>
            <div className="p-3 rounded-md bg-white/60 dark:bg-slate-800/40 backdrop-blur shadow-sm">Smart Filters</div>
            <div className="p-3 rounded-md bg-white/60 dark:bg-slate-800/40 backdrop-blur shadow-sm">Cost Insights</div>
            <div className="p-3 rounded-md bg-white/60 dark:bg-slate-800/40 backdrop-blur shadow-sm">Disruption Alerts</div>
        </div>
      </div>
    </main>
  )
}
