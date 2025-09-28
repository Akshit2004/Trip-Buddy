import React from 'react'
import { Link } from 'react-router-dom'
import AnimatedBlob from '../../Components/AnimatedBlob'

export default function Welcome() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-16 bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-100">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/50 text-center">
          {/* Logo (animated blob) */}
          <AnimatedBlob />

          {/* App title */}
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-800 mt-4">TravelEase</h1>
          <p className="text-sm text-slate-500 mb-6">Your seamless travel companion.</p>

          {/* Language selection buttons to mimic screenshot */}
          <div className="flex justify-center gap-4">
            <button className="px-6 py-3 bg-white border rounded-lg shadow-sm">English</button>
            <button className="px-6 py-3 bg-white border rounded-lg shadow-sm">हिंदी</button>
          </div>

          {/* Spacer to match visual layout */}
          <div className="mt-8 h-6" />
        </div>
      </div>
    </main>
  )
}
