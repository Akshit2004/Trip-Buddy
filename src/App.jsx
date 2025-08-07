import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/footer/Footer'
import LandingPage from './pages/landing/LandingPage'
import Login from './pages/auth/Login'
import TripPlanner from './pages/trip-planner/TripPlanner'
import './App.css'

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={
            <>
              <Navbar />
              <LandingPage />
              <Footer />
            </>
          } />
          <Route path="/auth" element={<Login />} />
          <Route path="/plan" element={<TripPlanner />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
