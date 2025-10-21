import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Welcome from './pages/landing/Welcome'
import Login from './pages/auth/Login'
import Home from './pages/Home'
import Profile from './pages/Profile'
import TripPlanner from './pages/TripPlanner'
import History from './pages/History'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/home" element={<Home />} />
        <Route path="/trips" element={<TripPlanner />} />
        <Route path="/history" element={<History />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  )
}