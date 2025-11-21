import React from 'react'

export default function AnimatedBlob({ size = 40 }) {
  // Calculate dimensions based on size prop (in pixels)
  const sizeClass = size <= 12 ? 'w-12 h-12' : size <= 20 ? 'w-20 h-20' : size <= 28 ? 'w-28 h-28' : 'w-40 h-40'
  
  return (
    <div className={`relative ${sizeClass} mx-auto animate-float rounded-full overflow-hidden pointer-events-none z-0`}>
      {/* Ripple effect layers with staggered timing for fluidity */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-300/30 via-teal-400/30 to-blue-500/30 animate-blob animate-ripple opacity-60 pointer-events-none blur-sm" style={{animationDelay: '0s'}}></div>
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-300/25 via-teal-400/25 to-blue-500/25 animate-blob animate-ripple opacity-50 pointer-events-none blur-sm" style={{animationDelay: '1.2s'}}></div>
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-300/15 via-teal-400/15 to-blue-500/15 animate-blob animate-ripple opacity-30 pointer-events-none blur-sm" style={{animationDelay: '2.4s'}}></div>

      {/* Main blob layers with enhanced gradients and timing */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400 via-teal-500 to-blue-600 animate-blob opacity-90 pointer-events-none blur-[1px]" style={{animationDuration: '10s'}}></div>
      <div className="absolute inset-1 rounded-full bg-gradient-to-tl from-blue-500 via-cyan-400 to-teal-500 animate-blob-reverse opacity-85 pointer-events-none" style={{animationDuration: '14s', animationDelay: '1s'}}></div>
      <div className="absolute inset-2 rounded-full bg-gradient-to-r from-teal-400 via-cyan-300 to-blue-400 animate-blob opacity-75 pointer-events-none" style={{animationDuration: '12s', animationDelay: '2.5s'}}></div>

      {/* Multiple shimmer overlays for enhanced fluidity */}
      <div className="absolute inset-2 rounded-full animate-shimmer pointer-events-none" style={{
        background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)',
        animationDuration: '3s'
      }}></div>
      <div className="absolute inset-3 rounded-full animate-shimmer pointer-events-none" style={{
        background: 'linear-gradient(135deg, transparent 20%, rgba(255,255,255,0.3) 50%, transparent 80%)',
        animationDuration: '4s',
        animationDelay: '1.5s'
      }}></div>

      {/* Floating particles with enhanced animation - only show on larger sizes */}
      {size > 20 && (
        <>
          <div className="absolute top-2 right-4 w-1.5 h-1.5 bg-cyan-300 rounded-full opacity-70 animate-float pointer-events-none" style={{animationDuration: '4s', animationDelay: '0.5s'}}></div>
          <div className="absolute bottom-3 left-5 w-1 h-1 bg-teal-300 rounded-full opacity-50 animate-float pointer-events-none" style={{animationDuration: '5s', animationDelay: '1.5s'}}></div>
          <div className="absolute top-5 left-3 w-1 h-1 bg-blue-300 rounded-full opacity-60 animate-float pointer-events-none" style={{animationDuration: '4.5s', animationDelay: '2.8s'}}></div>
          {size > 28 && (
            <>
              <div className="absolute top-1/2 right-2 w-0.5 h-0.5 bg-cyan-200 rounded-full opacity-40 animate-float pointer-events-none" style={{animationDuration: '3.5s', animationDelay: '0.8s'}}></div>
              <div className="absolute bottom-1/3 right-1/3 w-0.5 h-0.5 bg-teal-200 rounded-full opacity-50 animate-float pointer-events-none" style={{animationDuration: '4.2s', animationDelay: '1.9s'}}></div>
            </>
          )}
        </>
      )}

      {/* Subtle glow effect for depth */}
      <div className="absolute inset-0 rounded-full bg-gradient-radial from-white/10 via-transparent to-transparent opacity-40 pointer-events-none"></div>
    </div>
  )
}
