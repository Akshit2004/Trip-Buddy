import { db } from './firebase';
import {
    doc,
    setDoc,
    updateDoc,
    arrayUnion,
    onSnapshot,
    getDoc,
    collection
} from 'firebase/firestore';
import { Booking } from '@/types';

// Convert a private user booking to a shared trip
export const shareTrip = async (userId: string, booking: Booking): Promise<string> => {
    try {
        // If it's already a shared trip (has an ID in the 'trips' collection), just return the ID
        if (booking.isShared && booking.sharedTripId) {
            return booking.sharedTripId;
        }

        // Generate a unique share code (or use doc ID)
        const tripRef = doc(collection(db, 'trips'));
        const shareCode = tripRef.id;

        const sharedTripData = {
            ...booking,
            id: shareCode,
            userId, // Owner
            isShared: true,
            createdAt: new Date().toISOString(),
            collaborators: [userId], // Owner is first collaborator
            shareCode
        };

        // Create the public trip document
        await setDoc(tripRef, sharedTripData);

        // Update the original private booking to point to this shared trip
        // This is optional depending on if we want to keep them linked or just "move" it
        // For now, we'll mark the user's booking as shared
        if (booking.id) {
            const userBookingRef = doc(db, 'users', userId, 'bookings', booking.id);
            await updateDoc(userBookingRef, {
                isShared: true,
                sharedTripId: shareCode
            });
        }

        return shareCode;
    } catch (error) {
        console.error('Error sharing trip:', error);
        throw error;
    }
};

// Add a user to a trip using the share code
export const joinTrip = async (userId: string, shareCode: string): Promise<string> => {
    try {
        if (!shareCode) throw new Error('Invalid share code');
        const tripRef = doc(db, 'trips', shareCode);
        const tripSnap = await getDoc(tripRef);

        if (!tripSnap.exists()) {
            throw new Error('Trip not found');
        }

        // Add user to collaborators
        await updateDoc(tripRef, {
            collaborators: arrayUnion(userId)
        });

        // Also ensure this trip is "linked" in the user's bookings list for easy access
        // We create a "proxy" booking in their private collection that points to the shared one
        const tripData = tripSnap.data() as Booking;
        const linkedBooking = {
            ...tripData,
            id: shareCode, // Use same ID
            isShared: true,
            sharedTripId: shareCode,
            role: 'collaborator',
            linkedAt: new Date().toISOString()
        };

        await setDoc(doc(db, 'users', userId, 'bookings', shareCode), linkedBooking);

        return shareCode;
    } catch (error) {
        console.error('Error joining trip:', error);
        throw error;
    }
};

// Hook for real-time trip updates
export const subscribeToTrip = (tripId: string, onUpdate: (data: Booking) => void) => {
    if (!tripId) return () => { };

    const tripRef = doc(db, 'trips', tripId);

    const unsubscribe = onSnapshot(tripRef, (doc) => {
        if (doc.exists()) {
            onUpdate({ ...doc.data(), id: doc.id } as Booking);
        }
    });

    return unsubscribe;
};

// Get collaborators details (mocked for now, real app would fetch user profiles)
export const getCollaborators = async (userIds: string[]) => {
    // In a real app, we would fetch 'users' collection where uid is in userIds
    // For now, we might just return the IDs or dummy data if profiles aren't public
    return userIds.map(uid => ({ uid, name: 'Traveler', photo: null }));
};
