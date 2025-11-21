import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { auth } from '../firebase/config'
import boyAvatar from '../assets/Profile Picture/Boy.png'
import girlAvatar from '../assets/Profile Picture/Girl.png'
import AnimatedBlob from './AnimatedBlob'

// Helper to pick an avatar based on available data.
// Preference order: auth.currentUser.photoURL > localStorage.preferredGender (female -> girl) > default (boy)
function chooseAvatar() {
  const currentUser = auth.currentUser
  if (currentUser?.photoURL) return currentUser.photoURL
  const gender = (localStorage.getItem('preferredGender') || '').toLowerCase()
  if (gender.startsWith('f') || gender.includes('girl') || gender.includes('female')) return girlAvatar
  return boyAvatar
}

export default function TopNav({ title = 'Trip Buddy' }) {
  const [avatarSrc, setAvatarSrc] = useState(chooseAvatar())

  // Update avatar when auth state changes (e.g., login) or when localStorage might change.
  useEffect(() => {
    const onAuthChange = () => setAvatarSrc(chooseAvatar())
    // auth.currentUser can change without an event here, but listening to storage and polling is overkill.
    // We'll update once on mount and also when window receives a storage event (in case another tab changed it).
    window.addEventListener('storage', onAuthChange)
    // Minor interval to catch immediate changes after login in the same tab
    const t = setInterval(onAuthChange, 800)
    return () => {
      window.removeEventListener('storage', onAuthChange)
      clearInterval(t)
    }
  }, [])

  return (
    <header className="w-full flex items-center justify-between px-4 py-3 bg-transparent">
      <div className="flex items-center gap-3">
        <Link to="/profile" className="w-9 h-9 rounded-full overflow-hidden border-2 border-white/60 block">
          <img src={avatarSrc} alt="avatar" className="w-full h-full object-cover" />
        </Link>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
        <AnimatedBlob size={12} />
      </div>

      <div>
        <button className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/90 border border-white/60 shadow-sm">
          <i className="fas fa-cog w-7 h-7 text-slate-700" aria-hidden="true" />
        </button>
      </div>
    </header>
  )
}