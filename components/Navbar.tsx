'use client';

import Link from 'next/link';
import { Plane, User, LogOut, Cpu } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { getUserData } from '@/lib/userService';

export default function Navbar() {
  const storePoints = useStore((state) => state.points);
  const { user, logOut } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [points, setPoints] = useState(storePoints);

  // Fetch points from Firestore when user changes
  useEffect(() => {
    const fetchPoints = async () => {
      if (user) {
        const data = await getUserData(user.uid);
        if (data?.points !== undefined) {
          setPoints(data.points);
        }
      }
    };
    fetchPoints();
  }, [user]);

  // Keep local points in sync with store updates
  useEffect(() => {
    setPoints(storePoints);
  }, [storePoints]);

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50">
      <div className="container-custom flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 group">
          <motion.div
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.5 }}
          >
            <Plane className="w-6 h-6 text-primary" />
          </motion.div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            TravelBuddy
          </span>
        </Link>
        
        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium hover:text-primary transition-colors relative group">
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
          </Link>
          <Link href="/search/flights" className="text-sm font-medium hover:text-primary transition-colors relative group">
            Flights
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
          </Link>
          <Link href="/ai-trip" className="text-sm font-medium hover:text-primary transition-colors relative group flex items-center gap-2">
            <Cpu className="w-4 h-4 text-primary" />
            AI Trip
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
          </Link>
          <Link href="/search/hotels" className="text-sm font-medium hover:text-primary transition-colors relative group">
            Hotels
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
          </Link>
          <Link href="/search/trains" className="text-sm font-medium hover:text-primary transition-colors relative group">
            Trains
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
          </Link>
          <Link href="/search/cabs" className="text-sm font-medium hover:text-primary transition-colors relative group">
            Car Booking
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <motion.div 
                key={points}
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.2, 1] }}
                className="hidden md:flex items-center gap-1 bg-secondary px-3 py-1 rounded-full"
              >
                <span className="text-sm font-bold text-primary">{points}</span>
                <span className="text-xs text-muted-foreground">pts</span>
              </motion.div>
              
              <div className="relative">
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                >
                  {user.photoURL ? (
                    <Image src={user.photoURL} alt="User" width={32} height={32} className="rounded-full" />
                  ) : (
                    <User className="w-5 h-5 text-primary" />
                  )}
                </button>

                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-border py-1 overflow-hidden"
                    >
                      <div className="px-4 py-2 border-b border-border">
                        <p className="text-sm font-bold truncate">{user.displayName || 'User'}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                      <Link 
                        href="/profile" 
                        className="block px-4 py-2 text-sm hover:bg-secondary transition-colors"
                        onClick={() => setShowDropdown(false)}
                      >
                        Profile
                      </Link>
                      <button 
                        onClick={() => {
                          logOut();
                          setShowDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <Link href="/login" className="btn-primary">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
