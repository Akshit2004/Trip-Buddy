'use client';

import SearchWidget from "@/components/SearchWidget";
import { Star, Plane, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { TravelItem } from "@/types";
import { useEffect, useRef } from "react";

interface HomeContentProps {
  hotels: TravelItem[];
  flights: TravelItem[];
}

export default function HomeContent({ hotels, flights }: HomeContentProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const flightsRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const loadGsap = async () => {
      const gsapModule = await import("gsap");
      const scrollTriggerModule = await import("gsap/ScrollTrigger");
      
      const gsap = gsapModule.default;
      const ScrollTrigger = scrollTriggerModule.ScrollTrigger;
      
      gsap.registerPlugin(ScrollTrigger);

      // Animate hotel cards on scroll
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll(".hotel-card");
        gsap.fromTo(cards,
          { y: 60, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            stagger: 0.1,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 85%",
            }
          }
        );
      }

      // Animate flight cards on scroll
      if (flightsRef.current) {
        const cards = flightsRef.current.querySelectorAll(".flight-card");
        gsap.fromTo(cards,
          { x: -40, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            stagger: 0.12,
            duration: 0.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: flightsRef.current,
              start: "top 80%",
            }
          }
        );
      }
    };

    loadGsap();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      // Keep transition simple to satisfy Typescript types
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen pb-20 overflow-x-hidden">
      {/* Hero Section */}
      <motion.div 
        ref={heroRef}
        className="relative min-h-[600px] md:min-h-[650px] flex items-center overflow-hidden"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400">
          <motion.div 
            style={{ y: heroY }}
            className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-20"
          />
          {/* Floating decorative elements */}
          <motion.div
            animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 right-[15%] w-20 h-20 bg-white/10 rounded-full blur-xl"
          />
          <motion.div
            animate={{ y: [10, -10, 10], x: [-5, 5, -5] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-32 left-[10%] w-32 h-32 bg-cyan-300/10 rounded-full blur-2xl"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/3 left-1/4 w-40 h-40 bg-white/5 rounded-full blur-3xl"
          />
        </div>

        {/* Hero Content */}
        <motion.div 
          style={{ opacity: heroOpacity }}
          className="container-custom relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center py-16"
        >
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-white space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium"
            >
              <Plane className="w-4 h-4" />
              <span>Earn 3% points on every booking</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
            >
              Make Every Trip
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="block text-blue-100"
              >
                Unforgettable
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-lg md:text-xl text-blue-100/90 max-w-lg"
            >
              Discover amazing destinations, book with confidence, and create memories that last a lifetime.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="flex flex-wrap gap-3"
            >
              <Link href="/ai-trip" className="btn-primary flex items-center gap-2 group">
                Plan with AI
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/search/flights" className="btn-secondary">
                Explore Flights
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Content - Feature Cards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full h-[400px]">
              {/* Main floating card */}
              <motion.div
                animate={{ y: [-8, 8, -8] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 right-0 w-64 bg-white rounded-2xl p-4 shadow-2xl"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Plane className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-800">Flight Booked!</p>
                    <p className="text-xs text-gray-500">Delhi → Goa</p>
                  </div>
                </div>
                <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                  />
                </div>
              </motion.div>

              {/* Secondary floating card */}
              <motion.div
                animate={{ y: [8, -8, 8], x: [-4, 4, -4] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-16 left-8 w-56 bg-white rounded-2xl p-4 shadow-xl"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                </div>
                <p className="text-sm text-gray-700 font-medium">&quot;Best travel experience ever!&quot;</p>
                <p className="text-xs text-gray-500 mt-1">— Happy Traveler</p>
              </motion.div>

              {/* Points badge */}
              <motion.div
                animate={{ scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-24 left-0 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-2 rounded-full shadow-lg"
              >
                <span className="text-sm font-bold">+150 pts earned</span>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Search Widget Section */}
      <div className="container-custom px-4 -mt-8 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <SearchWidget />
        </motion.div>
      </div>

      {/* Featured Sections */}
      <div className="container-custom mt-20 space-y-20 px-4">
        
        {/* Trending Hotels */}
        <section>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between mb-8"
          >
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">Trending Getaways</h2>
              <p className="text-muted-foreground mt-1">Handpicked destinations for your next adventure</p>
            </div>
            <Link 
              href="/search/hotels" 
              className="text-primary font-semibold hover:underline flex items-center gap-1 group"
            >
              View All
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          <motion.div 
            ref={cardsRef}
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-4 auto-rows-[280px] gap-5"
          >
            {hotels.map((hotel, index) => (
              <motion.div 
                key={hotel.id}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`hotel-card card group overflow-hidden cursor-pointer relative h-full ${
                  index === 0 ? 'md:col-span-2 md:row-span-2' : 
                  index === 3 ? 'md:col-span-2' :
                  ''
                }`}
              >
                <Link href={`/details/hotel/${hotel.id}`} className="absolute inset-0 z-10" />
                <div className="absolute inset-0">
                  <Image
                    src={hotel.image}
                    alt={hotel.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </div>
                
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-bold shadow-lg"
                >
                  <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                  <span>{hotel.rating ?? '4.8'}</span>
                </motion.div>
                
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-bold text-lg md:text-xl group-hover:text-blue-200 transition-colors">
                    {hotel.title}
                  </h3>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-sm text-white/80">
                      From <span className="font-bold text-white">₹{hotel.price?.toLocaleString() ?? '2,999'}</span>/night
                    </p>
                    <motion.span 
                      whileHover={{ x: 5 }}
                      className="text-white/80 text-sm flex items-center gap-1"
                    >
                      Book now <ArrowRight className="w-3 h-3" />
                    </motion.span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Featured Flights */}
        <section>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between mb-8"
          >
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">Popular Flights</h2>
              <p className="text-muted-foreground mt-1">Best deals on domestic and international routes</p>
            </div>
            <Link 
              href="/search/flights" 
              className="text-primary font-semibold hover:underline flex items-center gap-1 group"
            >
              View All
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          <div ref={flightsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {flights.slice(0, 6).map((flight) => (
              <motion.div
                key={flight.id}
                whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                className="flight-card bg-white border border-border rounded-xl p-5 cursor-pointer group"
              >
                <Link href={`/details/flight/${flight.id}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                        <Plane className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{flight.title}</p>
                        <p className="text-xs text-muted-foreground">{flight.subtitle ?? 'Direct Flight'}</p>
                      </div>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="text-right"
                    >
                      <p className="text-lg font-bold text-blue-600">₹{flight.price?.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">per person</p>
                    </motion.div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-medium">{flight.rating ?? '4.5'}</span>
                    </div>
                    <span className="text-primary font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                      Book now <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-blue-400 p-8 md:p-12"
        >
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-10" />
          <motion.div
            animate={{ x: [0, 10, 0], y: [0, -5, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"
          />
          
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready for your next adventure?
            </h2>
            <p className="text-blue-100 text-lg mb-6">
              Let our AI plan the perfect trip for you. Just tell us where you want to go!
            </p>
            <Link 
              href="/ai-trip"
              className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg"
            >
              <Plane className="w-5 h-5" />
              Start Planning with AI
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
