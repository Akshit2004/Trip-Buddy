import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { auth } from '../../firebase/config'
import { setUserLanguage, setProfileComplete } from '../../firebase/userService'
import AnimatedBlob from '../../Components/AnimatedBlob'

export default function Welcome() {
  const navigate = useNavigate()
  const [selectedLanguage, setSelectedLanguage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

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
      
      // Small delay for UX, then navigate to home page
      setTimeout(() => {
        navigate('/home')
      }, 800)
    } catch (err) {
      console.error('Error setting language:', err)
      setIsLoading(false)
    }
  }

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col">
      {/* Header */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          
          {/* Logo and branding */}
          <div className="text-center mb-12">
            <AnimatedBlob />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">TripBuddy</h1>
            <p className="text-gray-600">Your journey starts here</p>
          </div>

          {/* Language selection */}
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Choose your language</h2>
              <p className="text-sm text-gray-500">Select your preferred language to continue</p>
            </div>

            <div className="space-y-3">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleSetLanguage(lang.code)}
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

          {/* Footer note */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              You can change this later in settings
            </p>
          </div>
        </div>
      </div>

      {/* Bottom decoration */}
      <div className="h-24 bg-gradient-to-t from-white/20 to-transparent" />
    </div>
  )
}
