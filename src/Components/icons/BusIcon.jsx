import React from 'react'

export default function BusIcon({ className = 'w-7 h-7', active }) {
  const colorClass = active ? 'text-teal-600' : 'text-gray-500'
  return <i className={`fas fa-bus ${className} ${colorClass}`} aria-hidden="true" />
}
