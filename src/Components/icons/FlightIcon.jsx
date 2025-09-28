import React from 'react'

// Improved airplane silhouette icon
export default function FlightIcon({ className = 'w-7 h-7', active }) {
  const colorClass = active ? 'text-teal-600' : 'text-gray-500'
  return <i className={`fas fa-plane ${className} ${colorClass}`} aria-hidden="true" />
}
