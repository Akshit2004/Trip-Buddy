'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import { useAuth } from '@/context/AuthContext';
import { getUserBookings, getUserData } from '@/lib/userService';
import { Wallet, Calendar, MapPin, Clock, CheckCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Booking } from '@/store/useStore';

export default function ProfilePage() {
  const { user } = useAuth();
  const { name: storeName, email: storeEmail, points: storePoints } = useStore();
  
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [points, setPoints] = useState(storePoints);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const [fetchedBookings, userData] = await Promise.all([
            getUserBookings(user.uid),
            getUserData(user.uid)
          ]);
          setBookings(fetchedBookings);
          if (userData?.points) {
            setPoints(userData.points);
          }
        } catch (error) {
          console.error("Error fetching profile data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const displayName = user?.displayName || storeName;
  const displayEmail = user?.email || storeEmail;

  return (
    <div className="min-h-screen bg-secondary/30 py-12 px-4">
      <div className="container-custom max-w-5xl">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl p-8 border border-border shadow-sm mb-8 flex flex-col md:flex-row items-center gap-8">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-3xl font-bold text-primary border-4 border-white shadow-md">
            {displayName.charAt(0)}
          </div>
          <div className="text-center md:text-left flex-1">
            <h1 className="text-3xl font-bold mb-1">{displayName}</h1>
            <p className="text-muted-foreground">{displayEmail}</p>
          </div>
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-6 rounded-xl shadow-lg min-w-[250px] text-center md:text-right">
            <div className="flex items-center justify-center md:justify-end gap-2 mb-1 opacity-90">
              <Wallet className="w-5 h-5" />
              <span className="text-sm font-medium">Available Points</span>
            </div>
            <p className="text-4xl font-bold">{points.toLocaleString()}</p>
            <p className="text-xs text-blue-100 mt-2">Worth ₹{points} in rewards</p>
          </div>
        </div>

        {/* Bookings History */}
        <h2 className="text-2xl font-bold mb-6">Booking History</h2>
        
        {bookings.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-border border-dashed">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-bold mb-2">No bookings yet</h3>
            <p className="text-muted-foreground mb-6">Start exploring the world and earn points on your first trip!</p>
            <Link href="/" className="btn-primary inline-block">
              Start Booking
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6 items-center">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                      Trip
                    </span>
                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> {booking.status || 'Confirmed'}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold">{booking.tripName || booking.title || 'Trip'}</h3>
                  <p className="text-sm text-muted-foreground flex items-center justify-center md:justify-start gap-2 mt-1">
                    <Clock className="w-3 h-3" />
                    {booking.startDate} - {booking.endDate}
                  </p>
                </div>

                <div className="text-center md:text-right">
                  <p className="text-lg font-bold">₹{booking.totalPrice?.toLocaleString() ?? 0}</p>
                  <p className="text-xs text-green-600 font-medium">+{booking.pointsEarned} pts earned</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
