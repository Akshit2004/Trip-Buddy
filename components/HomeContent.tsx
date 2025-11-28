'use client';

import SearchWidget from "@/components/SearchWidget";
import { Star, Plane } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { TravelItem } from "@/types";

interface HomeContentProps {
  hotels: TravelItem[];
  flights: TravelItem[];
}

export default function HomeContent({ hotels, flights }: HomeContentProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemAnim = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <div className="relative h-[500px] bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center text-center px-4">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg"
          >
            Explore the World with <span className="text-blue-100">TravelBuddy</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg md:text-xl text-blue-50 font-medium drop-shadow-md"
          >
            Get 3% points back on every booking. The smartest way to travel.
          </motion.p>
        </div>
      </div>

      {/* Search Widget */}
      <div className="container-custom px-4">
        <SearchWidget />
      </div>

      {/* Featured Sections */}
      <div className="container-custom mt-20 space-y-16">
        
        {/* Popular Hotels */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-foreground">Trending Getaways</h2>
            <Link href="/search/hotels" className="text-primary font-semibold hover:underline">View All</Link>
          </div>

          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-4 auto-rows-[250px] gap-4"
          >
            {hotels.map((hotel, index) => (
              <motion.div 
                key={hotel.id} 
                variants={itemAnim}
                whileHover={{ y: -5 }}
                className={`card group overflow-hidden cursor-pointer relative h-full ${
                  index === 0 ? 'md:col-span-2 md:row-span-2' : 
                  index === 3 ? 'md:col-span-2 md:row-span-1' :
                  'md:col-span-1 md:row-span-1'
                }`}
              >
                <div className="absolute inset-0">
                  <Image
                    src={hotel.image}
                    alt={hotel.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </div>
                
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1 text-xs font-bold shadow-sm z-10">
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  {hotel.rating}
                </div>

                <div className="absolute bottom-0 left-0 w-full p-6 text-white z-10">
                  <h3 className={`font-bold truncate ${index === 0 ? 'text-3xl mb-2' : 'text-xl mb-1'}`}>{hotel.title}</h3>
                  <p className="text-gray-200 text-sm mb-3 line-clamp-1">{hotel.subtitle}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-gray-300">Starts from</span>
                      <p className="text-lg font-bold">₹{hotel.price.toLocaleString()}</p>
                    </div>
                    <button className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                      Book Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Popular Flights */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-foreground">Popular Flight Routes</h2>
            <Link href="/search/flights" className="text-primary font-semibold hover:underline">View All</Link>
          </div>
          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-4 auto-rows-[250px] gap-4"
          >
            {flights.map((flight, index) => (
              <motion.div 
                key={flight.id} 
                variants={itemAnim}
                whileHover={{ scale: 1.02 }}
                className={`card p-6 hover:border-primary/50 transition-colors cursor-pointer relative overflow-hidden group flex flex-col justify-between ${
                  index === 0 ? 'md:col-span-2 md:row-span-2' : 
                  index === 1 ? 'md:col-span-2 md:row-span-1' :
                  'md:col-span-1 md:row-span-1'
                }`}
              >
                <div className="absolute inset-0">
                  <Image
                    src={flight.image || 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=2000'}
                    alt={flight.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
                </div>

                <div className="flex items-start justify-between relative z-10">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/10">
                    <Plane className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/10">
                    Earn {Math.floor(flight.price * 0.03)} pts
                  </span>
                </div>

                <div className="relative z-10 mt-auto">
                  <h3 className={`font-bold text-white ${index === 0 ? 'text-3xl mb-2' : 'text-xl mb-1'}`}>{flight.title}</h3>
                  <p className="text-gray-300 text-sm mb-4">{flight.subtitle}</p>
                  
                  <div className={`flex items-center justify-between pt-4 border-t border-white/10`}>
                    <div>
                      <span className="text-xs text-gray-400 block">Starting from</span>
                      <p className="text-xl font-bold text-white">₹{flight.price.toLocaleString()}</p>
                    </div>
                    <button className="bg-white text-primary px-4 py-2 rounded-lg text-sm font-bold opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                      Book
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Banner */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-primary rounded-2xl p-8 md:p-12 text-center text-white relative overflow-hidden"
        >
          <div className="relative z-10 space-y-4">
            <h2 className="text-3xl font-bold">Join TravelBuddy Premium</h2>
            <p className="text-blue-100 max-w-xl mx-auto">
              Unlock exclusive deals, zero convenience fees, and double points on every booking.
            </p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-primary px-8 py-3 rounded-full font-bold hover:bg-blue-50 transition-colors shadow-lg"
            >
              Join Now
            </motion.button>
          </div>
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        </motion.section>

      </div>
    </div>
  );
}
