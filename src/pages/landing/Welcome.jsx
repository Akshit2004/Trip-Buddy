import React from 'react'
import { Link } from 'react-router-dom'
import { auth } from '../../firebase/config'
import { setUserLanguage } from '../../firebase/userService'
import AnimatedBlob from '../../Components/AnimatedBlob'

export default function Welcome() {
  const handleSetLanguage = async (lang) => {
    try {
      // If user is authenticated, write to Firestore; otherwise use localStorage
      const user = auth.currentUser
      if (user && user.uid) {
        const res = await setUserLanguage(user.uid, lang)
        if (!res.success) console.error('Failed to save language:', res.error)
      } else {
        localStorage.setItem('preferredLanguage', lang)
      }
      // Optionally update UI or redirect — keeping it simple for now
      console.log('Language set to', lang)
    } catch (err) {
      console.error('Error setting language:', err)
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-16 bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-100">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/50 text-center relative z-10">
          {/* Logo (animated blob) */}
          <AnimatedBlob />

          {/* App title */}
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-800 mt-4">TripBuddy</h1>
          <p className="text-sm text-slate-500 mb-6">Your seamless travel companion.</p>

          {/* Language selection buttons to mimic screenshot */}
          <div className="flex justify-center gap-4">
            <button type="button" onClick={() => handleSetLanguage('en')} className="px-6 py-3 bg-white border rounded-lg shadow-sm">English</button>
            <button type="button" onClick={() => handleSetLanguage('hi')} className="px-6 py-3 bg-white border rounded-lg shadow-sm">हिंदी</button>
          </div>

          {/* Spacer to match visual layout */}
          <div className="mt-8 h-6" />
        </div>
      </div>
    </main>
  )
}
