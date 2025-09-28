import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Welcome from './Pages/landing/Welcome'
import Login from './Pages/auth/Login'
import Home from './Pages/Home'
import Profile from './Pages/Profile'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  )
}