import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createUserAccount, signInUser, setUserLanguage } from '../../firebase/userService'
import AnimatedBlob from '../../Components/AnimatedBlob'

export default function Login() {
  const navigate = useNavigate()
  const [isSignUp, setIsSignUp] = useState(false)
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '', name: '' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  function validate(values) {
    const e = {}
    if (!values.email.trim()) e.email = 'Email is required'
    if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      e.email = 'Enter a valid email'
    }
    if (!values.password) e.password = 'Password is required'
    if (values.password && values.password.length < 6) e.password = 'Min 6 characters'
    
    if (isSignUp) {
      if (!values.name.trim()) e.name = 'Name is required'
      if (!values.confirmPassword) e.confirmPassword = 'Please confirm password'
      if (values.confirmPassword && values.confirmPassword !== values.password) {
        e.confirmPassword = 'Passwords do not match'
      }
    }
    
    return e
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const v = validate(form)
    setErrors(v)
    if (Object.keys(v).length) return
    
    setSubmitting(true)
    
    try {
      if (isSignUp) {
        // Handle signup with Firebase
        const result = await createUserAccount({
          name: form.name,
          email: form.email,
          password: form.password
        })
        
        if (result.success) {
          console.log('Signup successful:', result.user)
          // Show success message or switch to login
          alert(result.message)
          // Switch to login mode after successful signup
          setIsSignUp(false)
          setForm({ email: form.email, password: '', confirmPassword: '', name: '' })
        } else {
          // Show error message
          setErrors({ submit: result.error })
        }
      } else {
        // Handle login with Firebase
        const result = await signInUser(form.email, form.password)
        
        if (result.success) {
          console.log('Login successful:', result.user)
            // Persist any user language preference locally
            try {
              const prefs = result.user.preferences || {}
              if (prefs.language) {
                localStorage.setItem('preferredLanguage', prefs.language)
              }

              // If user had selected a language before login (stored locally), push it to Firestore
              const preLang = localStorage.getItem('preferredLanguage')
              if (preLang && result.user.uid) {
                // If Firestore doesn't already have it or differs, update server
                if (!prefs.language || prefs.language !== preLang) {
                  await setUserLanguage(result.user.uid, preLang)
                }
              }
            } catch (err) {
              console.error('Error applying language preference after login:', err)
            }

            // Navigate to welcome page on successful login
            navigate('/welcome')
        } else {
          // Show error message (include error code in DEV for easier debugging)
          const message = result.error || 'Login failed.'
          const debugSuffix = import.meta.env.DEV && result.code ? ` (${result.code})` : ''
          setErrors({ submit: `${message}${debugSuffix}` })
        }
      }
    } catch (error) {
      console.error('Authentication error:', error)
      setErrors({ submit: 'An unexpected error occurred. Please try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  const toggleMode = () => {
    setIsSignUp(!isSignUp)
    setErrors({})
    setForm({ email: '', password: '', confirmPassword: '', name: '' })
  }

  const handleGoogleLogin = () => {
    // Google login logic here
    console.log('Google login clicked')
  }

  const disabled = submitting

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-6 sm:py-10 bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-100">
      <div className="w-full max-w-md space-y-6">
        {/* Animated Blob */}
        <AnimatedBlob />
        
        {/* Login/Signup Form */}
  <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-6 sm:p-8 border border-white/50 transition-all duration-500">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 transition-all duration-300">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              {isSignUp ? 'Join Trip Buddy today' : 'Sign in to your account'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {/* Display submit errors */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                <p className="text-red-600 text-sm text-center">{errors.submit}</p>
              </div>
            )}

            {/* Name Field - Only for Sign Up */}
            <div className={`space-y-2 transition-all duration-500 overflow-hidden ${isSignUp ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                value={form.name}
                onChange={handleChange}
                className={`w-full rounded-2xl px-4 py-3 sm:px-6 sm:py-4 bg-white/70 border-2 text-gray-800 placeholder:text-gray-500 focus:ring-4 focus:ring-cyan-200 focus:border-cyan-400 outline-none transition-all duration-300 ${errors.name ? 'border-red-400' : 'border-gray-200'}`}
                placeholder="Full Name"
                disabled={disabled}
              />
              {errors.name && <p className="text-xs text-red-500 ml-2">{errors.name}</p>}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                className={`w-full rounded-2xl px-4 py-3 sm:px-6 sm:py-4 bg-white/70 border-2 text-gray-800 placeholder:text-gray-500 focus:ring-4 focus:ring-cyan-200 focus:border-cyan-400 outline-none transition-all duration-300 ${errors.email ? 'border-red-400' : 'border-gray-200'}`}
                placeholder="Email"
                disabled={disabled}
              />
              {errors.email && <p className="text-xs text-red-500 ml-2">{errors.email}</p>}
            </div>
            
            {/* Password Field */}
            <div className="space-y-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={isSignUp ? "new-password" : "current-password"}
                value={form.password}
                onChange={handleChange}
                className={`w-full rounded-2xl px-4 py-3 sm:px-6 sm:py-4 bg-white/70 border-2 text-gray-800 placeholder:text-gray-500 focus:ring-4 focus:ring-cyan-200 focus:border-cyan-400 outline-none transition-all duration-300 ${errors.password ? 'border-red-400' : 'border-gray-200'}`}
                placeholder="Password"
                disabled={disabled}
              />
              {errors.password && <p className="text-xs text-red-500 ml-2">{errors.password}</p>}
            </div>

            {/* Confirm Password Field - Only for Sign Up */}
            <div className={`space-y-2 transition-all duration-500 overflow-hidden ${isSignUp ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={form.confirmPassword}
                onChange={handleChange}
                className={`w-full rounded-2xl px-4 py-3 sm:px-6 sm:py-4 bg-white/70 border-2 text-gray-800 placeholder:text-gray-500 focus:ring-4 focus:ring-cyan-200 focus:border-cyan-400 outline-none transition-all duration-300 ${errors.confirmPassword ? 'border-red-400' : 'border-gray-200'}`}
                placeholder="Confirm Password"
                disabled={disabled}
              />
              {errors.confirmPassword && <p className="text-xs text-red-500 ml-2">{errors.confirmPassword}</p>}
            </div>
            
            {/* Submit Button */}
            <button
              type="submit"
              disabled={disabled}
              className="relative w-full bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-600 hover:from-cyan-600 hover:via-teal-600 hover:to-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 sm:px-8 sm:py-4 rounded-2xl shadow-lg hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-200 transition-all duration-300 transform hover:scale-105"
            >
              {submitting && <span className="absolute left-4 h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
              <span>
                {submitting 
                  ? (isSignUp ? 'Creating Account...' : 'Signing in...') 
                  : (isSignUp ? 'Create Account' : 'Login')
                }
              </span>
            </button>
          </form>
          
          {/* Toggle Sign Up/Login */}
          <div className="text-center mt-6">
            <span className="text-gray-600">
              {isSignUp ? 'Already have an account? ' : 'Not a user? '}
            </span>
            <button 
              onClick={toggleMode}
              className="font-semibold text-teal-600 hover:text-teal-700 hover:underline transition-colors"
              disabled={disabled}
            >
              {isSignUp ? 'Sign in' : 'Sign up'}
            </button>
          </div>
          
          {/* Divider - Only show for login */}
          <div className={`transition-all duration-500 overflow-hidden ${!isSignUp ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="mx-4 text-gray-500 text-sm">or</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>
          </div>
          
          {/* Google Login - Only show for login */}
          <div className={`transition-all duration-500 overflow-hidden ${!isSignUp ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={disabled}
              className="w-full bg-white border-2 border-gray-200 hover:border-gray-300 hover:shadow-md text-gray-700 font-medium px-4 py-3 sm:px-8 sm:py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-60"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </div>
        </div>
        
        {/* Debug helpers removed */}
      </div>
    </div>
  )
}
