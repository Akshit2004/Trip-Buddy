import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Welcome from './pages/landing/Welcome'
import Login from './pages/auth/Login'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/welcome" element={<Welcome />} />
        {/* Fallback route could redirect to root later */}
      </Routes>
    </BrowserRouter>
  )
}