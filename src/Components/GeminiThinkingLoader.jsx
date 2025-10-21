import React, { useState, useEffect } from 'react'

const GeminiThinkingLoader = () => {
  const [currentPhase, setCurrentPhase] = useState(0)
  const [particles, setParticles] = useState([])
  const [ripples, setRipples] = useState([])

  const thinkingPhases = [
    { icon: '🌍', text: 'Analyzing destinations...', color: 'from-blue-500 to-cyan-500', emoji: '🗺️' },
    { icon: '🚀', text: 'Finding best routes...', color: 'from-purple-500 to-pink-500', emoji: '✈️' },
    { icon: '🎯', text: 'Optimizing your journey...', color: 'from-orange-500 to-red-500', emoji: '🧭' },
    { icon: '✨', text: 'Creating magic...', color: 'from-green-500 to-teal-500', emoji: '🪄' },
    { icon: '🎨', text: 'Personalizing experience...', color: 'from-indigo-500 to-purple-500', emoji: '🎭' },
    { icon: '💡', text: 'Finalizing your perfect trip...', color: 'from-yellow-500 to-orange-500', emoji: '🌟' }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhase((prev) => (prev + 1) % thinkingPhases.length)
      
      // Add ripple effect on phase change
      setRipples(prev => [...prev, { id: Date.now() }])
      setTimeout(() => {
        setRipples(prev => prev.slice(1))
      }, 1000)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Generate random particles with various properties
    const newParticles = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 8 + 2,
      duration: Math.random() * 4 + 2,
      delay: Math.random() * 3,
      opacity: Math.random() * 0.5 + 0.2
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 z-50 overflow-hidden">
      {/* Animated Background Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-6000"></div>
      </div>

      {/* Floating Particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            animation: `float ${particle.duration}s infinite ease-in-out ${particle.delay}s, twinkle ${particle.duration * 1.5}s infinite ease-in-out ${particle.delay}s`
          }}
        />
      ))}

      {/* Shooting Stars */}
      <div className="absolute top-20 left-20 w-1 h-1 bg-white rounded-full animate-shootingStar"></div>
      <div className="absolute top-40 right-40 w-1 h-1 bg-white rounded-full animate-shootingStar animation-delay-3000"></div>
      <div className="absolute bottom-32 left-1/3 w-1 h-1 bg-white rounded-full animate-shootingStar animation-delay-5000"></div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-6 max-w-2xl">
        {/* Rotating Icon Circle with Ripples */}
        <div className="relative w-52 h-52 mx-auto mb-8">
          {/* Ripple Effects */}
          {ripples.map((ripple) => (
            <div
              key={ripple.id}
              className="absolute inset-0 rounded-full border-2 border-purple-400 animate-rippleOut"
            />
          ))}
          
          {/* Outer rotating ring with gradient */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 animate-spin-slow opacity-75"
               style={{ 
                 clipPath: 'polygon(0 0, 100% 0, 100% 5%, 0 5%, 0 20%, 100% 20%, 100% 25%, 0 25%, 0 40%, 100% 40%, 100% 45%, 0 45%, 0 60%, 100% 60%, 100% 65%, 0 65%, 0 80%, 100% 80%, 100% 85%, 0 85%, 0 100%, 100% 100%)',
                 filter: 'blur(1px)'
               }}>
          </div>
          
          {/* Middle pulsing ring */}
          <div className="absolute inset-4 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-40 animate-pulse-slow"></div>
          
          {/* Inner glow */}
          <div className="absolute inset-6 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 opacity-30 blur-md animate-pulse"></div>
          
          {/* Center circle with icon */}
          <div className="absolute inset-8 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center shadow-2xl border-4 border-purple-500 border-opacity-30">
            <div className="text-7xl animate-bounce-slow filter drop-shadow-2xl">
              {thinkingPhases[currentPhase].icon}
            </div>
          </div>
          
          {/* Orbiting dots with trails */}
          <div className="absolute inset-0 animate-spin-reverse">
            <div className="absolute top-0 left-1/2 -ml-2">
              <div className="w-4 h-4 bg-cyan-400 rounded-full shadow-lg shadow-cyan-500/50 animate-pulse"></div>
              <div className="w-2 h-8 bg-gradient-to-b from-cyan-400 to-transparent absolute top-4 left-1"></div>
            </div>
          </div>
          <div className="absolute inset-0 animate-spin-slow">
            <div className="absolute bottom-0 left-1/2 -ml-2">
              <div className="w-4 h-4 bg-pink-400 rounded-full shadow-lg shadow-pink-500/50 animate-pulse"></div>
              <div className="w-2 h-8 bg-gradient-to-t from-pink-400 to-transparent absolute bottom-4 left-1"></div>
            </div>
          </div>
          <div className="absolute inset-0 animate-spin-reverse" style={{ animationDelay: '0.5s' }}>
            <div className="absolute top-1/2 right-0 -mt-2">
              <div className="w-4 h-4 bg-purple-400 rounded-full shadow-lg shadow-purple-500/50 animate-pulse"></div>
              <div className="h-2 w-8 bg-gradient-to-l from-purple-400 to-transparent absolute right-4 top-1"></div>
            </div>
          </div>
          <div className="absolute inset-0 animate-spin-slow" style={{ animationDelay: '0.5s' }}>
            <div className="absolute top-1/2 left-0 -mt-2">
              <div className="w-4 h-4 bg-yellow-400 rounded-full shadow-lg shadow-yellow-500/50 animate-pulse"></div>
              <div className="h-2 w-8 bg-gradient-to-r from-yellow-400 to-transparent absolute left-4 top-1"></div>
            </div>
          </div>

          {/* Small floating icons around main circle */}
          <div className="absolute -top-6 left-1/2 -ml-4 text-2xl animate-float" style={{ animationDelay: '0s' }}>
            {thinkingPhases[currentPhase].emoji}
          </div>
        </div>

        {/* Gemini AI Badge with glow */}
        <div className="inline-block mb-6 animate-fade-in">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-full blur-xl opacity-50 animate-pulse"></div>
            <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white px-6 py-2 rounded-full font-bold text-sm shadow-2xl flex items-center gap-2">
              <span className="animate-pulse text-yellow-300">✨</span>
              <span className="bg-gradient-to-r from-white to-yellow-100 bg-clip-text text-transparent">Powered by Gemini AI</span>
              <span className="animate-pulse text-yellow-300">✨</span>
            </div>
          </div>
        </div>

        {/* Phase Text with Gradient and Animation */}
        <div className="mb-8 h-28 flex flex-col items-center justify-center">
          <h2 className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${thinkingPhases[currentPhase].color} bg-clip-text text-transparent animate-fade-in mb-4 drop-shadow-lg`}>
            {thinkingPhases[currentPhase].text}
          </h2>
          
          {/* Animated Progress Bar */}
          <div className="w-80 max-w-full">
            <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden shadow-inner">
              <div 
                className={`h-full bg-gradient-to-r ${thinkingPhases[currentPhase].color} rounded-full transition-all duration-500 relative overflow-hidden`}
                style={{ width: `${((currentPhase + 1) / thinkingPhases.length) * 100}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></div>
              </div>
            </div>
            <div className="flex justify-between mt-2 px-1">
              <span className="text-xs text-slate-400">0%</span>
              <span className="text-xs font-bold text-purple-400">{Math.round(((currentPhase + 1) / thinkingPhases.length) * 100)}%</span>
              <span className="text-xs text-slate-400">100%</span>
            </div>
          </div>
        </div>

        {/* Enhanced Loading Dots */}
        <div className="flex justify-center gap-3 mb-8">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="relative"
            >
              <div
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  i === currentPhase % 6
                    ? `bg-gradient-to-r ${thinkingPhases[currentPhase].color} scale-150 shadow-xl`
                    : i < currentPhase % 6
                    ? 'bg-gradient-to-r from-purple-400 to-pink-400 scale-110'
                    : 'bg-slate-600 scale-100'
                }`}
              />
              {i === currentPhase % 6 && (
                <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${thinkingPhases[currentPhase].color} animate-ping opacity-75`}></div>
              )}
            </div>
          ))}
        </div>

        {/* Animated Thinking Text */}
        <div className="flex justify-center items-center gap-2 text-slate-300 text-base font-medium mb-8">
          <span className="animate-pulse">✨ AI is thinking</span>
          <span className="animate-bounce inline-block" style={{ animationDelay: '0s' }}>.</span>
          <span className="animate-bounce inline-block" style={{ animationDelay: '0.2s' }}>.</span>
          <span className="animate-bounce inline-block" style={{ animationDelay: '0.4s' }}>.</span>
        </div>

        {/* Fun Dynamic Facts */}
        <div className="mt-8 space-y-3">
          <div className="text-slate-300 text-sm max-w-md mx-auto p-4 bg-slate-800 bg-opacity-50 backdrop-blur-sm rounded-2xl border border-slate-700 animate-fade-in">
            <p className="flex items-center gap-2 justify-center">
              <span className="text-lg">🚀</span>
              <span className="italic">Analyzing thousands of routes to craft your perfect journey</span>
            </p>
          </div>
          
          <div className="flex justify-center gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Connected</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span>Processing</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <span>Optimizing</span>
            </div>
          </div>
        </div>
      </div>

      {/* Corner Decorations with Animation */}
      <div className="absolute top-10 left-10 w-24 h-24 border-t-4 border-l-4 border-purple-500 rounded-tl-3xl opacity-40 animate-pulse"></div>
      <div className="absolute top-12 left-12 w-20 h-20 border-t-2 border-l-2 border-pink-400 rounded-tl-3xl opacity-30 animate-pulse animation-delay-1000"></div>
      
      <div className="absolute bottom-10 right-10 w-24 h-24 border-b-4 border-r-4 border-cyan-500 rounded-br-3xl opacity-40 animate-pulse"></div>
      <div className="absolute bottom-12 right-12 w-20 h-20 border-b-2 border-r-2 border-blue-400 rounded-br-3xl opacity-30 animate-pulse animation-delay-1000"></div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0) rotate(0deg); }
          50% { transform: translateY(-20px) translateX(10px) rotate(10deg); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
        @keyframes shootingStar {
          0% { transform: translateX(0) translateY(0); opacity: 1; }
          100% { transform: translateX(300px) translateY(300px); opacity: 0; }
        }
        @keyframes rippleOut {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-3000 { animation-delay: 3s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animation-delay-5000 { animation-delay: 5s; }
        .animation-delay-6000 { animation-delay: 6s; }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
        .animate-shootingStar { animation: shootingStar 3s ease-out infinite; }
        .animate-rippleOut { animation: rippleOut 1s ease-out forwards; }
        .animate-shimmer { animation: shimmer 2s ease-in-out infinite; }
      `}</style>
    </div>
  )
}

export default GeminiThinkingLoader
