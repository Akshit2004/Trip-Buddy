import React from 'react'
import { NavLink } from 'react-router-dom'
// ...existing code...

export default function BottomNav({ className = '' }) {
  const navItems = [
    { 
      to: '/home', 
      label: 'Home', 
      icon: 'fas fa-home',
    },
    { 
      to: '/trips', 
      label: 'Trips', 
      icon: 'fas fa-suitcase',
      svg: true
    },
    { 
      to: '/history', 
      label: 'History', 
      icon: 'fas fa-clock',
    },
    { 
      to: '/profile', 
      label: 'Profile', 
      icon: 'fas fa-user',
    }
  ]

  return (
    <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 ${className}`}>
      {/* Dynamic Island Container */}
      <div className="relative">
        {/* Main Island Background */}
        <div className="bg-white backdrop-blur-xl rounded-full px-6 py-3 shadow-2xl border border-gray-200">
          <nav className="flex items-center justify-center space-x-8">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => 
                  `group relative flex flex-col items-center justify-center transition-all duration-300 ${
                    isActive 
                      ? 'scale-110' 
                      : 'hover:scale-105'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Active Background Glow */}
                    {isActive && (
                      <div className="absolute -inset-3 bg-gray-200 rounded-full blur-sm" />
                    )}
                    
                    {/* Icon Container */}
                    <div className={`relative flex flex-col items-center space-y-1 px-3 py-2 rounded-2xl transition-all duration-300 ${
                      isActive 
                        ? 'bg-gray-100 text-black shadow-lg' 
                        : 'text-gray-600 group-hover:text-black group-hover:bg-gray-50'
                    }`}>
                      {item.svg ? (
                        // Inline suitcase SVG fallback to ensure the icon always renders
                        <svg className={`w-5 h-5`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7" />
                          <rect x="7" y="3" width="10" height="4" rx="1" />
                        </svg>
                      ) : (
                        <i 
                          className={`${item.icon} text-lg transition-all duration-300 ${
                            isActive ? 'drop-shadow-sm font-black' : ''
                          }`}
                          style={{ fontWeight: isActive ? '900' : 'normal' }}
                          aria-hidden="true"
                        />
                      )}
                      <span className={`text-[9px] font-sans font-medium leading-none text-center whitespace-nowrap transition-all duration-300 ${
                        isActive ? 'text-black font-bold' : 'text-gray-500 group-hover:text-gray-700'
                      }`}>{item.label}</span>
                    </div>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
        
        {/* Subtle outer shadow */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-200/20 to-transparent rounded-full blur-xl -z-10" />
      </div>
    </div>
  )
}
