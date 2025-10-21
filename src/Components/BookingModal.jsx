import React, { useState } from 'react'

function BookingModal({ isOpen, onClose, bookingData, onConfirm }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    passengers: 1,
    specialRequests: ''
  })

  const [step, setStep] = useState(1) // 1: Details, 2: Review, 3: Payment

  if (!isOpen || !bookingData) return null

  const { type, totalPrice } = bookingData

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleNext = () => {
    if (step === 1 && (!formData.fullName || !formData.email || !formData.phone)) {
      alert('Please fill in all required fields')
      return
    }
    setStep(step + 1)
  }

  const handleBack = () => {
    setStep(step - 1)
  }

  const handleConfirmBooking = () => {
    const completeBooking = {
      ...bookingData,
      userDetails: formData,
      bookingDate: new Date().toISOString(),
      bookingId: 'BK' + Date.now()
    }
    
    console.log('Final Booking:', completeBooking)
    
    if (onConfirm) {
      onConfirm(completeBooking)
    }
    
    // Reset and close
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      passengers: 1,
      specialRequests: ''
    })
    setStep(1)
    onClose()
  }

  const getIcon = () => {
    if (type === 'flights') return '✈️'
    if (type === 'hotel') return '🏨'
    if (type === 'trains') return '🚆'
    if (type === 'complete') return '🎁'
    return '🎫'
  }

  const getTitle = () => {
    if (type === 'flights') return 'Book Flights'
    if (type === 'hotel') return 'Book Hotel'
    if (type === 'trains') return 'Book Trains'
    if (type === 'complete') return 'Book Complete Package'
    return 'Book Now'
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-fadeInScale z-[10000]">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <span className="text-2xl">{getIcon()}</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold">{getTitle()}</h2>
                <p className="text-sm text-white text-opacity-90">
                  Step {step} of 3
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all"
            >
              <span className="text-xl">✕</span>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 flex gap-2">
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className={`flex-1 h-2 rounded-full transition-all ${
                  i <= step ? 'bg-white' : 'bg-white bg-opacity-30'
                }`}
              ></div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Step 1: User Details */}
          {step === 1 && (
            <div className="space-y-4 animate-fadeInUp">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">
                  Traveler Information
                </h3>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:outline-none transition-all"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Number of Passengers
                </label>
                <input
                  type="number"
                  name="passengers"
                  value={formData.passengers}
                  onChange={handleInputChange}
                  min="1"
                  max="10"
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Special Requests (Optional)
                </label>
                <textarea
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleInputChange}
                  placeholder="Any special requirements or preferences..."
                  rows="3"
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:outline-none transition-all resize-none"
                ></textarea>
              </div>
            </div>
          )}

          {/* Step 2: Review Booking */}
          {step === 2 && (
            <div className="space-y-4 animate-fadeInUp">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">
                  Review Your Booking
                </h3>
              </div>

              {/* User Details Summary */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <p className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-3">
                  Traveler Details
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Name</span>
                    <span className="text-sm font-semibold text-slate-900">{formData.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Email</span>
                    <span className="text-sm font-semibold text-slate-900">{formData.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Phone</span>
                    <span className="text-sm font-semibold text-slate-900">{formData.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Passengers</span>
                    <span className="text-sm font-semibold text-slate-900">{formData.passengers}</span>
                  </div>
                </div>
              </div>

              {/* Booking Details */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border-2 border-indigo-200">
                <p className="text-xs font-bold text-indigo-900 uppercase tracking-wide mb-3">
                  Booking Summary
                </p>
                
                {/* Flights */}
                {bookingData.flights && bookingData.flights.length > 0 && (
                  <div className="mb-3">
                    <p className="text-sm font-semibold text-slate-800 mb-2">✈️ Flights ({bookingData.flights.length})</p>
                    <div className="space-y-2">
                      {bookingData.flights.map((flight, idx) => (
                        <div key={idx} className="bg-white rounded-lg p-3 text-sm">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold text-slate-900">{flight.from} → {flight.to}</p>
                              <p className="text-xs text-slate-600 mt-1">{flight.airline} {flight.flightNumber}</p>
                            </div>
                            <p className="font-bold text-indigo-600">₹{(flight.price || 0).toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trains */}
                {bookingData.trains && bookingData.trains.length > 0 && (
                  <div className="mb-3">
                    <p className="text-sm font-semibold text-slate-800 mb-2">🚆 Trains ({bookingData.trains.length})</p>
                    <div className="space-y-2">
                      {bookingData.trains.map((train, idx) => (
                        <div key={idx} className="bg-white rounded-lg p-3 text-sm">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold text-slate-900">{train.from} → {train.to}</p>
                              <p className="text-xs text-slate-600 mt-1">Train {train.trainNumber}</p>
                            </div>
                            <p className="font-bold text-emerald-600">₹{(train.price || 0).toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Hotel */}
                {bookingData.hotel && (
                  <div className="mb-3">
                    <p className="text-sm font-semibold text-slate-800 mb-2">🏨 Hotel</p>
                    <div className="bg-white rounded-lg p-3 text-sm">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-slate-900">{bookingData.hotel.name}</p>
                          <p className="text-xs text-slate-600 mt-1">📍 {bookingData.hotel.city}</p>
                        </div>
                        <p className="font-bold text-amber-600">₹{(bookingData.hotel.pricePerNight || 0).toLocaleString()}/night</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Total */}
                <div className="border-t-2 border-indigo-300 pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-800">Total Amount</span>
                    <span className="text-xl font-bold text-indigo-600">₹{(totalPrice || 0).toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">For {formData.passengers} passenger{formData.passengers > 1 ? 's' : ''}</p>
                </div>
              </div>

              {formData.specialRequests && (
                <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                  <p className="text-xs font-bold text-amber-900 mb-2">📝 Special Requests</p>
                  <p className="text-sm text-amber-800">{formData.specialRequests}</p>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <div className="space-y-4 animate-fadeInUp">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">
                  Payment Details
                </h3>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">💳</span>
                </div>
                <h4 className="text-xl font-bold text-green-900 mb-2">Payment Integration Coming Soon!</h4>
                <p className="text-sm text-green-700 mb-4">
                  We're working on integrating secure payment gateways including:
                </p>
                <div className="flex flex-wrap justify-center gap-3 mb-4">
                  <span className="bg-white px-4 py-2 rounded-lg text-sm font-semibold">💳 Card Payment</span>
                  <span className="bg-white px-4 py-2 rounded-lg text-sm font-semibold">📱 UPI</span>
                  <span className="bg-white px-4 py-2 rounded-lg text-sm font-semibold">🏦 Net Banking</span>
                  <span className="bg-white px-4 py-2 rounded-lg text-sm font-semibold">💰 Wallets</span>
                </div>
              </div>

              <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-200">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🔒</span>
                  <div>
                    <p className="text-sm font-bold text-indigo-900 mb-1">100% Secure & Safe</p>
                    <p className="text-xs text-indigo-700">
                      Your payment information is encrypted and secure. We never store your card details.
                    </p>
                  </div>
                </div>
              </div>

              {/* Demo: Booking Confirmation */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <p className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">Booking Summary</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Booking ID</span>
                    <span className="font-mono font-semibold text-slate-900">BK{Date.now().toString().slice(-8)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Amount to Pay</span>
                    <span className="font-bold text-lg text-indigo-600">₹{(totalPrice || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex gap-3">
          {step > 1 && (
            <button
              onClick={handleBack}
              className="px-6 py-3 rounded-xl border-2 border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition-all"
            >
              ← Back
            </button>
          )}
          
          {step < 3 ? (
            <button
              onClick={handleNext}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 px-6 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
            >
              Continue →
            </button>
          ) : (
            <button
              onClick={handleConfirmBooking}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-3 px-6 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <span>✓</span>
              <span>Confirm Booking</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default BookingModal
