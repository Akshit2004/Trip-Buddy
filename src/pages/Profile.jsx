import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { auth } from '../firebase/config'
import { signOut } from 'firebase/auth'
import { getUserPreferences, setUserLanguage } from '../firebase/userService'
import { submitSupportRequest } from '../firebase/supportService'
import TopNav from '../Components/TopNav'
import BottomNav from '../Components/BottomNav'
import boyAvatar from '../assets/Profile Picture/Boy.png'
import girlAvatar from '../assets/Profile Picture/Girl.png'

export default function Profile() {
  const navigate = useNavigate()
  // translation logic removed — app uses static UI labels
  const currentLanguage = localStorage.getItem('preferredLanguage') || 'en'
  const [user, setUser] = useState(null)
  const [userPreferences, setUserPreferences] = useState(null)
  const [userName, setUserName] = useState('')
  const [loading, setLoading] = useState(true)
  const [showLanguageModal, setShowLanguageModal] = useState(false)
  const [showSupportModal, setShowSupportModal] = useState(false)
  const [supportForm, setSupportForm] = useState({ subject: '', message: '' })
  const [supportSubmitting, setSupportSubmitting] = useState(false)
  const [supportResult, setSupportResult] = useState(null)

  // Language options
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
  ]

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const currentUser = auth.currentUser
        if (!currentUser) {
          navigate('/') // Redirect to login if not authenticated
          return
        }

        setUser(currentUser)
        
        // Load user preferences from Firestore
        const preferences = await getUserPreferences(currentUser.uid)
        if (preferences.success) {
          setUserPreferences(preferences.data)
          // If Firestore has a name field, prefer it for display
          if (preferences.name) {
            setUserName(preferences.name)
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [navigate])

  // Auto-close support modal on successful submission
  useEffect(() => {
    if (supportResult?.success) {
      const t = setTimeout(() => {
        setShowSupportModal(false)
        setSupportResult(null)
      }, 1400)
      return () => clearTimeout(t)
    }
  }, [supportResult])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      localStorage.removeItem('preferredLanguage') // Clear local storage
      navigate('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const handleLanguageChange = async (langCode) => {
    try {
      const currentUser = auth.currentUser
      if (currentUser) {
        const result = await setUserLanguage(currentUser.uid, langCode)
        if (result.success) {
          // Update local preferences
          setUserPreferences(prev => ({
            ...prev,
            language: langCode
          }))
          // Also update localStorage for immediate use
          localStorage.setItem('preferredLanguage', langCode)
        }
      }
      setShowLanguageModal(false)
    } catch (error) {
      console.error('Error updating language:', error)
    }
  }

  const handleSupportInput = (e) => {
    const { name, value } = e.target
    setSupportForm(prev => ({ ...prev, [name]: value }))
  }

  const submitSupport = async () => {
    try {
      setSupportSubmitting(true)
      setSupportResult(null)

      const currentUser = auth.currentUser
      const payload = {
        uid: currentUser?.uid || null,
        name: userName || userPreferences?.name || currentUser?.displayName || null,
        email: currentUser?.email || null,
        subject: supportForm.subject || 'General',
        message: supportForm.message || ''
      }

  const res = await submitSupportRequest(payload)

  if (res.success) {
        setSupportResult({ success: true, id: res.id })
        setSupportForm({ subject: '', message: '' })
      } else {
        setSupportResult({ success: false, error: res.error || 'Failed to submit' })
      }
    } catch (error) {
      console.error('Support submit error:', error)
      setSupportResult({ success: false, error: error.message })
    } finally {
      setSupportSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  const currentLang = languages.find(lang => lang.code === (userPreferences?.language || currentLanguage || 'en'))

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-100">
      <TopNav />
      
      {/* Main Content */}
      <div className="pt-20 pb-28 px-4 max-w-md mx-auto">
        {/* Profile Header */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-6 border border-white/50 mb-6">
          <div className="text-center">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden border-4 border-white/60" style={{ background: 'linear-gradient(135deg,#60a5fa,#06b6d4)' }}>
              <img
                src={
                  user?.photoURL
                    ? user.photoURL
                    : ((localStorage.getItem('preferredGender') || '').toLowerCase().startsWith('f') || (localStorage.getItem('preferredGender') || '').toLowerCase().includes('female') ? girlAvatar : boyAvatar)
                }
                alt="profile"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* User Info */}
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
              {userName || userPreferences?.name || user.displayName || 'User'}
            </h2>
            <p className="text-gray-600 text-sm mb-4">
              {user.email}
            </p>
            
            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 py-4 border-t border-gray-200">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">0</p>
                <p className="text-xs text-gray-600">Trips</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">0</p>
                  <p className="text-xs text-gray-600">Countries</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">0</p>
                  <p className="text-xs text-gray-600">Reviews</p>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Section */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-6 border border-white/50 mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Settings</h3>
          
          {/* Language Setting */}
          <button 
            onClick={() => setShowLanguageModal(true)}
            className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors duration-200"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <i className="fas fa-globe text-blue-600" aria-hidden="true" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-800">Language</p>
                <p className="text-sm text-gray-600">{currentLang?.flag} {currentLang?.name}</p>
              </div>
            </div>
            <i className="fas fa-chevron-right text-gray-400" aria-hidden="true" />
          </button>

          {/* Notifications Setting */}
          <div className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors duration-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <i className="fas fa-bell text-yellow-600" aria-hidden="true" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-800">Notifications</p>
                <p className="text-sm text-gray-600">Push notifications & updates</p>
              </div>
            </div>
            <div className="w-12 h-6 bg-blue-500 rounded-full p-1 transition-colors duration-200">
              <div className="w-4 h-4 bg-white rounded-full transform translate-x-6 transition-transform duration-200"></div>
            </div>
          </div>

          {/* Theme Setting */}
          <div className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors duration-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <i className="fas fa-palette text-purple-600" aria-hidden="true" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-800">Theme</p>
                <p className="text-sm text-gray-600">Light mode</p>
              </div>
            </div>
            <i className="fas fa-chevron-right text-gray-400" aria-hidden="true" />
          </div>
        </div>

        {/* Account Section */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-6 border border-white/50 mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Account</h3>
          
          {/* Privacy */}
          <div className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors duration-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <i className="fas fa-shield-alt text-green-600" aria-hidden="true" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-800">Privacy & Security</p>
                <p className="text-sm text-gray-600">Manage your privacy settings</p>
              </div>
            </div>
            <i className="fas fa-chevron-right text-gray-400" aria-hidden="true" />
          </div>

          {/* Help & Support */}
          <div className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors duration-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center">
                <i className="fas fa-question-circle text-cyan-600" aria-hidden="true" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-800">Help & Support</p>
                <p className="text-sm text-gray-600">Get help and contact support</p>
              </div>
            </div>
            <button onClick={() => setShowSupportModal(true)} className="text-gray-400">
              <i className="fas fa-chevron-right" aria-hidden="true" />
            </button>
          </div>

          {/* About */}
          <div className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors duration-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <i className="fas fa-info-circle text-gray-600" aria-hidden="true" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-800">About</p>
                <p className="text-sm text-gray-600">Trip Buddy v1.0.0</p>
              </div>
            </div>
            <i className="fas fa-chevron-right text-gray-400" aria-hidden="true" />
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-6 rounded-2xl transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <i className="fas fa-sign-out-alt" aria-hidden="true" />
          <span>Logout</span>
        </button>
      </div>

      {/* Language Selection Modal */}
      {showLanguageModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-6 w-full max-w-sm border border-white/50">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Select Language</h3>
              <p className="text-gray-600 text-sm mt-1">Choose your preferred language</p>
            </div>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`w-full flex items-center space-x-3 p-4 rounded-2xl transition-colors duration-200 ${
                    (userPreferences?.language || currentLanguage) === lang.code
                      ? 'bg-blue-100 border-2 border-blue-500'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <span className="text-2xl">{lang.flag}</span>
                  <span className="font-semibold text-gray-800 flex-1 text-left">{lang.name}</span>
                  {(userPreferences?.language || currentLanguage) === lang.code && (
                    <i className="fas fa-check text-blue-500" aria-hidden="true" />
                  )}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setShowLanguageModal(false)}
              className="w-full mt-6 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-2xl transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Support Modal */}
      {showSupportModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-6 w-full max-w-md border border-white/50">
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Contact Support</h3>
              <p className="text-gray-600 text-sm mt-1">Describe your issue and our team will get back to you.</p>
            </div>

            <div className="space-y-3">
              <input
                name="subject"
                value={supportForm.subject}
                onChange={handleSupportInput}
                placeholder="Subject (optional)"
                className="w-full p-3 border rounded-xl focus:outline-none"
              />
              <textarea
                name="message"
                value={supportForm.message}
                onChange={handleSupportInput}
                placeholder="How can we help you?"
                rows={5}
                className="w-full p-3 border rounded-xl focus:outline-none"
              />

              {supportResult?.success && (
                <div className="text-green-600 text-sm">Thanks — your request was submitted.</div>
              )}
              {supportResult?.success === false && (
                <div className="text-red-600 text-sm">Error: {supportResult.error}</div>
              )}

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowSupportModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-2xl"
                  disabled={supportSubmitting}
                >
                  Cancel
                </button>
                <button
                  onClick={submitSupport}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-2xl"
                  disabled={supportSubmitting || !supportForm.message}
                >
                  {supportSubmitting ? 'Sending...' : 'Submit'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}