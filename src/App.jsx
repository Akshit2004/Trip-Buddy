import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Welcome from './Pages/landing/Welcome'
import Login from './Pages/auth/Login'

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