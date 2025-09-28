import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { auth } from '../../firebase/config'
import { setUserLanguage, setProfileComplete, setUserDetails, getUserPreferences } from '../../firebase/userService'
import AnimatedBlob from '../../Components/AnimatedBlob'
import BoyImg from '../../assets/Profile Picture/Boy.png'
import GirlImg from '../../assets/Profile Picture/Girl.png'

export default function Welcome() {
  const navigate = useNavigate()
  const [selectedLanguage, setSelectedLanguage] = useState(null)
  const [selectedGender, setSelectedGender] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(0) // 0 = language, 1 = avatar
  const [details, setDetails] = useState({ name: '', email: '', phone: '' })
  const [errors, setErrors] = useState({})

  const handleSetLanguage = async (lang) => {
    try {
      setIsLoading(true)
      setSelectedLanguage(lang)
      
      // If user is authenticated, write to Firestore; otherwise use localStorage
      const user = auth.currentUser
      if (user && user.uid) {
        const res = await setUserLanguage(user.uid, lang)
        if (!res.success) console.error('Failed to save language:', res.error)
        
        // Mark profile as complete after language selection
        const profileRes = await setProfileComplete(user.uid)
        if (!profileRes.success) console.error('Failed to mark profile complete:', profileRes.error)
      } else {
        localStorage.setItem('preferredLanguage', lang)
      }
      
      // After saving language, move to gender selection step instead of directly navigating
      setTimeout(() => {
        // stop loading but keep language selected for next step
        setIsLoading(false)
      }, 500)
    } catch (err) {
      console.error('Error setting language:', err)
      setIsLoading(false)
    }
  }

  const finalizeProfile = async (gender) => {
    try {
      setIsLoading(true)
      const user = auth.currentUser
      if (user && user.uid) {
        // Save language again (defensive) and gender to user doc
        if (selectedLanguage) await setUserLanguage(user.uid, selectedLanguage)
        // Merge gender into user document
        await setProfileComplete(user.uid)
        // Use setDoc merge in userService if needed - here we'll attempt a quick update via setDoc inside userService
        // For simplicity, store gender in preferences via setUserLanguage (not ideal). Ideally add setUserGender API.
      } else {
        localStorage.setItem('preferredGender', gender)
      }

      // Move to details step to collect name/email/phone
      setTimeout(() => setStep(2), 400)
    } catch (err) {
      console.error('Error finalizing profile:', err)
      setIsLoading(false)
    }
  }

  const validateDetails = (d) => {
    const e = {}
    if (!d.name || !d.name.trim()) e.name = 'Name is required'
    if (!d.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) e.email = 'Valid email is required'
    // Phone is optional. If provided, require 7-15 digits (allow spaces, dashes, and optional leading +)
    if (d.phone && d.phone.trim()) {
      if (!/^\+?[0-9\s-]{7,15}$/.test(d.phone)) e.phone = 'Valid phone is required (7-15 digits)'
    }
    return e
  }

  const submitDetails = async () => {
    const e = validateDetails(details)
    setErrors(e)
    if (Object.keys(e).length) return

    try {
      setIsLoading(true)
      const user = auth.currentUser
      if (user && user.uid) {
        const res = await setUserDetails(user.uid, { name: details.name, email: details.email, phone: details.phone, preferences: { gender: selectedGender, language: selectedLanguage } })
        if (!res.success) console.error('Failed to save details:', res.error)
      } else {
        localStorage.setItem('preferredName', details.name)
        localStorage.setItem('preferredEmail', details.email)
        localStorage.setItem('preferredPhone', details.phone)
      }

      // Mark profile complete and navigate home
      const userObj = auth.currentUser
      if (userObj && userObj.uid) await setProfileComplete(userObj.uid)
      setTimeout(() => navigate('/home'), 400)
    } catch (err) {
      console.error('Error submitting details:', err)
      setIsLoading(false)
    }
  }

  // Prefill details when we reach step 2 from authenticated user or Firestore
  React.useEffect(() => {
    const prefill = async () => {
      if (step !== 2) return

      // First try auth.currentUser (Google profile)
      const user = auth.currentUser
      if (user) {
        setDetails(prev => ({
          name: prev.name || user.displayName || '',
          email: prev.email || user.email || '',
          phone: prev.phone || ''
        }))

        // Try to get phone/name from Firestore preferences if available
        try {
          const prefs = await getUserPreferences(user.uid)
          if (prefs && prefs.success) {
            setDetails(prev => ({
              name: prev.name || prefs.name || prev.name,
              email: prev.email || prefs.email || prev.email,
              phone: prev.phone || ''
            }))
          }
        } catch (err) {
          // ignore
        }
      } else {
        // fallback to localStorage values when unauthenticated
        const name = localStorage.getItem('preferredName') || ''
        const email = localStorage.getItem('preferredEmail') || ''
        const phone = localStorage.getItem('preferredPhone') || ''
        setDetails(prev => ({ name: prev.name || name, email: prev.email || email, phone: prev.phone || phone }))
      }
    }

    prefill()
  }, [step])

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-6 sm:p-10">
        {/* Top Branding */}
        <div className="text-center mb-6">
          <AnimatedBlob />
          <h1 className="text-3xl font-bold text-gray-800 mb-1">TripBuddy</h1>
          <p className="text-gray-600">Your journey starts here</p>
        </div>

        {/* Step container */}
        <div className="min-h-[380px] flex flex-col items-center justify-center">
          {step === 0 && (
            <div className="w-full max-w-md">
              <div className="text-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Choose your language</h2>
                <p className="text-sm text-gray-500">Select your preferred language to continue</p>
              </div>
              <div className="space-y-3">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => { handleSetLanguage(lang.code); setSelectedLanguage(lang.code); setTimeout(() => setStep(1), 400) }}
                    disabled={isLoading}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 ${
                      selectedLanguage === lang.code
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                    } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{lang.flag}</span>
                      <span className="font-medium text-gray-800">{lang.name}</span>
                    </div>
                    {selectedLanguage === lang.code && isLoading && (
                      <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    )}
                    {selectedLanguage !== lang.code && !isLoading && (
                      <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none">
                        <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="w-full max-w-md text-center">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Select your profile avatar</h2>
                <p className="text-sm text-gray-500">Choose who represents you</p>
              </div>
              <div className="flex flex-col items-center gap-4">
                <div className="flex gap-6 justify-center items-center">
                  <button onClick={async () => { setSelectedGender('boy'); await finalizeProfile('boy') }} className={`p-2 rounded-xl ${selectedGender === 'boy' ? 'ring-4 ring-blue-200' : 'hover:ring-2 hover:ring-gray-200'}`}>
                    <img src={BoyImg} alt="Boy" className="w-28 h-28 rounded-full object-cover" />
                    <div className="mt-2 text-sm text-gray-700">Boy</div>
                  </button>

                  <button onClick={async () => { setSelectedGender('girl'); await finalizeProfile('girl') }} className={`p-2 rounded-xl ${selectedGender === 'girl' ? 'ring-4 ring-pink-200' : 'hover:ring-2 hover:ring-gray-200'}`}>
                    <img src={GirlImg} alt="Girl" className="w-28 h-28 rounded-full object-cover" />
                    <div className="mt-2 text-sm text-gray-700">Girl</div>
                  </button>
                </div>

                <div className="flex gap-4">
                  <button onClick={async () => { setSelectedGender('other'); await finalizeProfile('other') }} className={`px-4 py-2 rounded-full text-sm ${selectedGender === 'other' ? 'bg-yellow-100 ring-2 ring-yellow-200' : 'bg-gray-100 hover:bg-gray-200'}`}>
                    Other
                  </button>

                  <button onClick={async () => { setSelectedGender('prefer_not_say'); await finalizeProfile('prefer_not_say') }} className={`px-4 py-2 rounded-full text-sm ${selectedGender === 'prefer_not_say' ? 'bg-gray-200 ring-2 ring-gray-300' : 'bg-gray-100 hover:bg-gray-200'}`}>
                    Prefer not to say
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="w-full max-w-md">
              <div className="text-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Tell us about yourself</h2>
                <p className="text-sm text-gray-500">We use this to personalize your profile</p>
              </div>

              <div className="space-y-3">
                <div>
                  <input
                    name="name"
                    value={details.name}
                    onChange={(e) => setDetails(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Full name"
                    className={`w-full p-3 rounded-xl border ${errors.name ? 'border-red-400' : 'border-gray-200'}`}
                  />
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <input
                    name="email"
                    value={details.email}
                    onChange={(e) => setDetails(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Email"
                    className={`w-full p-3 rounded-xl border ${errors.email ? 'border-red-400' : 'border-gray-200'}`}
                  />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>

                <div>
                  <input
                    name="phone"
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9+\-\s]*"
                    value={details.phone}
                    onChange={(e) => setDetails(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Phone number (optional)"
                    className={`w-full p-3 rounded-xl border ${errors.phone ? 'border-red-400' : 'border-gray-200'}`}
                  />
                  {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-xl bg-gray-200">Back</button>
                  <button onClick={submitDetails} className="flex-1 py-3 rounded-xl bg-blue-500 text-white">Finish</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div className="mt-6 flex items-center justify-between">
          <button onClick={() => setStep(s => Math.max(0, s - 1))} className="text-sm text-gray-600 hover:underline">Back</button>
          <div className="flex-1" />
          <div className="w-16" />
        </div>
      </div>
    </div>
  )
}
