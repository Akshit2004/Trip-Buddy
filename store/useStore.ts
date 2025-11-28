import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TripPlannerResponse, TripPlannerForm, TravelItem } from '@/types';

export interface Booking {
  id: string;
  type: 'flight' | 'hotel' | 'train' | 'bus' | 'cab';
  title: string;
  date: string;
  price: number;
  pointsEarned: number;
  status: 'confirmed' | 'cancelled';
}

interface UserState {
  name: string;
  email: string;
  points: number;
  bookings: Booking[];
  generatedTrip: TripPlannerResponse | null;
  tripSearchParams: TripPlannerForm | null;
  selectedTripOptions: { transport: TravelItem | null; hotel: TravelItem | null } | null;
  singleBookingItem: TravelItem | null;
  addBooking: (booking: Booking) => void;
  addPoints: (amount: number) => void;
  setGeneratedTrip: (trip: TripPlannerResponse | null) => void;
  setTripSearchParams: (params: TripPlannerForm | null) => void;
  setSelectedTripOptions: (options: { transport: TravelItem | null; hotel: TravelItem | null } | null) => void;
  setSingleBookingItem: (item: TravelItem | null) => void;
  resetUser: () => void;
}

export const useStore = create<UserState>()(
  persist(
    (set) => ({
      name: 'Akshit', // Default user
      email: 'akshit@example.com',
      points: 0, // Starting points
      bookings: [],
      generatedTrip: null,
      tripSearchParams: null,
      selectedTripOptions: null,
      singleBookingItem: null,
      addBooking: (booking) =>
        set((state) => ({
          bookings: [booking, ...state.bookings],
          points: state.points + booking.pointsEarned,
        })),
      addPoints: (amount) =>
        set((state) => ({ points: state.points + amount })),
      setGeneratedTrip: (trip) => set({ generatedTrip: trip }),
      setTripSearchParams: (params) => set({ tripSearchParams: params }),
      setSelectedTripOptions: (options) => set({ selectedTripOptions: options }),
      setSingleBookingItem: (item) => set({ singleBookingItem: item }),
      resetUser: () =>
        set({ points: 0, bookings: [], generatedTrip: null, tripSearchParams: null, selectedTripOptions: null, singleBookingItem: null }),
    }),
    {
      name: 'travel-buddy-storage',
      version: 1,
      migrate: (persistedState: unknown, version: number) => {
        // Reset points to 0 for all users when upgrading from previous versions
        if (typeof persistedState === 'object' && persistedState !== null) {
          const ps = persistedState as Partial<UserState>;
          if (version === 0 && ps.points !== undefined) {
            ps.points = 0;
          }
          return ps;
        }
        return null;
      },
    }
  )
);
