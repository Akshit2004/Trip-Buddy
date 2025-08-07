import React from 'react'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/footer/Footer'
import LandingPage from './pages/landing/LandingPage'
import './App.css'

function App() {
  return (
    <div className="App">
      <Navbar />
      <LandingPage />
      <Footer />
    </div>
  )
}

export default App
