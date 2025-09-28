import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

// Animated Blob Component
const AnimatedBlob = () => {
  return (
    <div className="relative w-32 h-32 mx-auto mb-8">
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-teal-500 to-blue-600 rounded-full animate-pulse opacity-75"></div>
      <div className="absolute inset-2 bg-gradient-to-br from-blue-400 via-cyan-500 to-teal-600 rounded-full animate-bounce opacity-80"></div>
      <div className="absolute inset-6 bg-white rounded-full flex items-center justify-center shadow-inner">
        <div className="text-2xl">✈️</div>
      </div>
    </div>
  )
}

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
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
    await new Promise(r => setTimeout(r, 900))
    navigate('/welcome')
  }

  const handleGoogleLogin = () => {
    // Google login logic here
    console.log('Google login clicked')
  }

  const disabled = submitting

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-10 bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-100">
      <div className="w-full max-w-md space-y-6">
        {/* Animated Blob */}
        <AnimatedBlob />
        
        {/* Login Form */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/50">
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {/* Email Field */}
            <div className="space-y-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                className={`w-full rounded-2xl px-6 py-4 bg-white/70 border-2 text-gray-800 placeholder:text-gray-500 focus:ring-4 focus:ring-cyan-200 focus:border-cyan-400 outline-none transition-all duration-300 ${errors.email ? 'border-red-400' : 'border-gray-200'}`}
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
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange}
                className={`w-full rounded-2xl px-6 py-4 bg-white/70 border-2 text-gray-800 placeholder:text-gray-500 focus:ring-4 focus:ring-cyan-200 focus:border-cyan-400 outline-none transition-all duration-300 ${errors.password ? 'border-red-400' : 'border-gray-200'}`}
                placeholder="Password"
                disabled={disabled}
              />
              {errors.password && <p className="text-xs text-red-500 ml-2">{errors.password}</p>}
            </div>
            
            {/* Login Button */}
            <button
              type="submit"
              disabled={disabled}
              className="relative w-full bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-600 hover:from-cyan-600 hover:via-teal-600 hover:to-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-200 transition-all duration-300 transform hover:scale-105"
            >
              {submitting && <span className="absolute left-4 h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
              <span>{submitting ? 'Signing in...' : 'Login'}</span>
            </button>
          </form>
          
          {/* Sign Up Link */}
          <div className="text-center mt-6">
            <span className="text-gray-600">Not a user? </span>
            <Link to="/signup" className="font-semibold text-teal-600 hover:text-teal-700 hover:underline transition-colors">
              Sign up
            </Link>
          </div>
          
          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="mx-4 text-gray-500 text-sm">or</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>
          
          {/* Google Login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={disabled}
            className="w-full bg-white border-2 border-gray-200 hover:border-gray-300 hover:shadow-md text-gray-700 font-medium px-8 py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-60"
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
    </div>
  )
}
