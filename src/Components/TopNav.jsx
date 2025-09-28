import React from 'react'
import { Link } from 'react-router-dom'
// ...existing code...

export default function TopNav({ title = 'Travel' }) {
  return (
    <header className="w-full flex items-center justify-between px-4 py-3 bg-transparent">
      <div className="flex items-center gap-3">
        <button className="w-9 h-9 rounded-full overflow-hidden border-2 border-white/60">
          <img src="/vite.svg" alt="avatar" className="w-full h-full object-cover" />
        </button>
      </div>

      <h1 className="text-base font-semibold text-slate-800">{title}</h1>

      <div>
        <button className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/90 border border-white/60 shadow-sm">
          <i className="fas fa-cog w-7 h-7 text-slate-700" aria-hidden="true" />
        </button>
      </div>
    </header>
  )
}