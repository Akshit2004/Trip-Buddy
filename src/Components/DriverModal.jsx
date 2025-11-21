import React from 'react'

export default function DriverModal({ isOpen, onClose, driver, onBook }) {
  if (!isOpen || !driver) return null

  const { driver: name, provider, phone, vehicle, rating, estimatedPriceINR, distanceKm } = driver

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-5 z-[10000]">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold">{name || 'Driver'}</h3>
            <p className="text-sm text-gray-500">{provider}</p>
          </div>
          <button onClick={onClose} className="text-gray-500">✕</button>
        </div>

        <div className="mt-4 space-y-3 text-sm text-gray-700">
          {rating !== undefined && <div>⭐ Rating: <span className="font-semibold">{rating}</span></div>}
          {phone && <div>📞 Contact: <a href={`tel:${phone}`} className="text-teal-600">{phone}</a></div>}
          {vehicle && (
            <div>🚗 Vehicle: <span className="font-medium">{vehicle.make || ''} {vehicle.model || ''} {vehicle.plate ? `• ${vehicle.plate}` : ''}</span></div>
          )}
          <div>🧾 Estimate: <span className="font-semibold">₹{(estimatedPriceINR || 0).toLocaleString()}</span></div>
          <div>📏 Distance: <span className="font-semibold">{distanceKm} km</span></div>
        </div>

        <div className="mt-5 flex gap-3">
          <button
            onClick={() => onBook && onBook(driver)}
            className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 text-white py-2 rounded-lg font-semibold"
          >
            Book Ride
          </button>
          <button onClick={onClose} className="px-4 py-2 rounded-lg border">Close</button>
        </div>
      </div>
    </div>
  )
}
