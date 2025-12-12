import { db } from './firebaseClient';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { User, UserPreferences, Booking } from '@/types';

// Create a new user document in Firestore
export const createUser = async (
    uid: string,
    email: string,
    displayName: string,
    photoURL: string | null
): Promise<void> => {
    try {
        const userRef = doc(db, 'users', uid);
        const userData: Omit<User, 'uid'> = {
            email,
            displayName,
            photoURL,
            preferences: null,
            pro: false,
            points: 0,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        };

        await setDoc(userRef, userData);
        console.log('User created successfully:', uid);
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

// Get user data from Firestore
export const getUserData = async (uid: string): Promise<User | null> => {
    try {
        const userRef = doc(db, 'users', uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            return { uid, ...userSnap.data() } as User;
        } else {
            console.log('No user document found for:', uid);
            return null;
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
};

// Update user preferences (from onboarding)
export const updateUserPreferences = async (
    uid: string,
    preferences: UserPreferences
): Promise<void> => {
    try {
        const userRef = doc(db, 'users', uid);
        await updateDoc(userRef, {
            preferences,
            updatedAt: serverTimestamp()
        });
        console.log('User preferences updated:', uid);
    } catch (error) {
        console.error('Error updating preferences:', error);
        throw error;
    }
};

// Update user points
export const updateUserPoints = async (
    uid: string,
    points: number
): Promise<void> => {
    try {
        const userRef = doc(db, 'users', uid);
        await updateDoc(userRef, {
            points,
            updatedAt: serverTimestamp()
        });
        console.log('User points updated:', uid, points);
    } catch (error) {
        console.error('Error updating user points:', error);
        throw error;
    }
};

// Check if user exists in Firestore
export const userExists = async (uid: string): Promise<boolean> => {
    try {
        const userRef = doc(db, 'users', uid);
        const userSnap = await getDoc(userRef);
        return userSnap.exists();
    } catch (error) {
        console.error('Error checking user existence:', error);
        return false;
    }
};

// Add points to user
export const addUserPoints = async (uid: string, pointsToAdd: number): Promise<void> => {
    try {
        const userRef = doc(db, 'users', uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const currentPoints = userSnap.data().points || 0;
            await updateDoc(userRef, {
                points: currentPoints + pointsToAdd,
                updatedAt: serverTimestamp()
            });
        }
    } catch (error) {
        console.error('Error adding points:', error);
        throw error;
    }
};

// Save a new booking
export const saveBooking = async (uid: string, bookingData: Record<string, unknown>): Promise<void> => {
    try {
        // Create a reference to the bookings subcollection
        const { collection, addDoc } = await import('firebase/firestore');
        const bookingsRef = collection(db, 'users', uid, 'bookings');

        await addDoc(bookingsRef, {
            ...(bookingData as Record<string, unknown>),
            createdAt: serverTimestamp(),
            status: 'confirmed'
        });
        console.log('Booking saved successfully');
    } catch (error) {
        console.error('Error saving booking:', error);
        throw error;
    }
};

// Get all bookings for a user
export const getUserBookings = async (uid: string): Promise<Booking[]> => {
    try {
        const { collection, getDocs, orderBy, query } = await import('firebase/firestore');
        const bookingsRef = collection(db, 'users', uid, 'bookings');
        // Order by createdAt descending so newest bookings first if available
        const q = query(bookingsRef, orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);

        const bookings: Booking[] = [];
        snap.forEach((doc) => {
            const data = doc.data() as Booking;
            bookings.push({ ...data, id: doc.id });
        });

        return bookings;
    } catch (error) {
        console.error('Error fetching user bookings:', error);
        throw error;
    }
};

// Update user subscription status
export const updateUserSubscription = async (
    uid: string,
    status: 'free' | 'pro'
): Promise<void> => {
    try {
        const userRef = doc(db, 'users', uid);
        const isPro = status === 'pro';
        await updateDoc(userRef, {
            pro: isPro,
            updatedAt: serverTimestamp()
        });
        console.log('User subscription updated:', uid, status, 'Pro:', isPro);
    } catch (error) {
        console.error('Error updating subscription:', error);
        throw error;
    }
};
