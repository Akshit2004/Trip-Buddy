import React, { useState } from 'react'
import TopNav from '../Components/TopNav'
import BottomNav from '../Components/BottomNav'
// ...existing code...
import FlightIcon from '../Components/icons/FlightIcon'
import TrainIcon from '../Components/icons/TrainIcon'
import HotelIcon from '../Components/icons/HotelIcon'
import BusIcon from '../Components/icons/BusIcon'

export default function Home() {
  const [activeTab, setActiveTab] = useState('flights')

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto">
        <TopNav title="Travel" />

        <main className="px-4 pb-28">{/* pb to avoid bottom nav overlap */}
          <div className="mt-3">
            <div className="relative">
              <input
                type="search"
                placeholder="Where to?"
                className="w-full rounded-xl pl-4 pr-12 py-3 border border-gray-200 shadow-sm bg-gray-50"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </div>
            </div>

            <div className="mt-4 bg-white rounded-xl shadow-sm p-2 flex items-center justify-around">
              <button onClick={() => setActiveTab('flights')} className={`flex flex-col items-center gap-1 text-sm ${activeTab==='flights' ? 'text-teal-600' : 'text-gray-500'}`}>
                <FlightIcon active={activeTab==='flights'} />
                <span className="text-xs">Flights</span>
              </button>
              <button onClick={() => setActiveTab('trains')} className={`flex flex-col items-center gap-1 text-sm ${activeTab==='trains' ? 'text-teal-600' : 'text-gray-500'}`}>
                <TrainIcon active={activeTab==='trains'} />
                <span className="text-xs">Trains</span>
              </button>
              <button onClick={() => setActiveTab('hotels')} className={`flex flex-col items-center gap-1 text-sm ${activeTab==='hotels' ? 'text-teal-600' : 'text-gray-500'}`}>
                <HotelIcon active={activeTab==='hotels'} />
                <span className="text-xs">Hotels</span>
              </button>
              <button onClick={() => setActiveTab('buses')} className={`flex flex-col items-center gap-1 text-sm ${activeTab==='buses' ? 'text-teal-600' : 'text-gray-500'}`}>
                <BusIcon active={activeTab==='buses'} />
                <span className="text-xs">Buses</span>
              </button>
            </div>

            <div className="mt-5">
              <span className="text-sm text-gray-500 mb-3">Recent Trip</span>

              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                <div className="p-4 flex items-center gap-4">
                  <div className="w-16 h-12 rounded-md bg-gradient-to-br from-sky-300 to-cyan-300 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-slate-800">Mumbai to Goa</div>
                    <div className="text-xs text-gray-500">20 - 22 Dec</div>
                  </div>
                  <button className="bg-sky-500 text-white px-3 py-2 rounded-lg text-sm">View Details</button>
                </div>
              </div>
            </div>

          </div>
        </main>

        <BottomNav />
      </div>
    </div>
  )
}
