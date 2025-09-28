import React from 'react'

export default function HotelIcon({ className = 'w-7 h-7', active }) {
  const colorClass = active ? 'text-teal-600' : 'text-gray-500'
  // Font Awesome uses fa-bed / fa-hotel; fa-bed tends to be widely supported
  return <i className={`fas fa-bed ${className} ${colorClass}`} aria-hidden="true" />
}
