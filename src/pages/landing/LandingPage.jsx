import React from 'react';
import './LandingPage.css';
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Testimonials from './components/Testimonials';
import Benefits from './components/Benefits';


const LandingPage = () => {
  return (
    <div className="landing-page">
      <Hero />
      <Features />
      <HowItWorks />
      <Benefits />
      <Testimonials />
    </div>
  );
};

export default LandingPage;
