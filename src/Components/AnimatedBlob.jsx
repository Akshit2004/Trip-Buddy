import React from 'react'

export default function AnimatedBlob({ size = 40}) {
  const px = `${size}0` // keep tailwind sizing via w-40/h-40 default if not passed
  return (
    // use smaller size on very small screens to avoid vertical overflow
    // pointer-events-none prevents the decorative layers from capturing clicks
    <div className={`relative w-28 h-28 sm:w-40 sm:h-40 mx-auto mb-6 sm:mb-8 animate-float rounded-full overflow-hidden pointer-events-none z-0`}>
      {/* Ripple effect layers (circular) */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-300/30 via-teal-400/30 to-blue-500/30 animate-blob animate-ripple opacity-60 pointer-events-none" style={{animationDelay: '0s'}}></div>
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-300/20 via-teal-400/20 to-blue-500/20 animate-blob animate-ripple opacity-40 pointer-events-none" style={{animationDelay: '1s'}}></div>
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-300/10 via-teal-400/10 to-blue-500/10 animate-blob animate-ripple opacity-20 pointer-events-none" style={{animationDelay: '2s'}}></div>

      {/* Main blob layers (circular) */}
  <div className="absolute inset-3 rounded-full bg-gradient-to-br from-cyan-400 via-teal-500 to-blue-600 animate-blob opacity-90 pointer-events-none" style={{animationDuration: '8s'}}></div>
  <div className="absolute inset-4 rounded-full bg-gradient-to-tl from-blue-500 via-cyan-400 to-teal-500 animate-blob-reverse opacity-80 pointer-events-none" style={{animationDuration: '12s'}}></div>
  <div className="absolute inset-6 rounded-full bg-gradient-to-r from-teal-400 via-cyan-300 to-blue-400 animate-blob opacity-70 pointer-events-none" style={{animationDuration: '10s', animationDelay: '2s'}}></div>

      {/* Shimmer overlay (circular) */}
      <div className="absolute inset-8 rounded-full animate-blob animate-shimmer pointer-events-none" style={{
        background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)',
        animationDuration: '6s'
      }}></div>

      {/* Floating particles (subtle, non-pulsing) */}
      <div className="absolute top-3 right-7 w-2 h-2 bg-cyan-300 rounded-full opacity-60 transform animate-float pointer-events-none" style={{animationDuration: '3s', animationDelay: '0.5s'}}></div>
      <div className="absolute bottom-5 left-9 w-1.5 h-1.5 bg-teal-300 rounded-full opacity-40 transform animate-float pointer-events-none" style={{animationDuration: '4s', animationDelay: '1.2s'}}></div>
      <div className="absolute top-9 left-5 w-1 h-1 bg-blue-300 rounded-full opacity-50 transform animate-float pointer-events-none" style={{animationDuration: '3.5s', animationDelay: '2.1s'}}></div>
    </div>
  )
}
