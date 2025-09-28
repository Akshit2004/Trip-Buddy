import { collection, addDoc, doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { db, auth } from './config'

// Collection name for users
const USERS_COLLECTION = 'users'

/**
 * Create a new user account and store user data in Firestore
 * @param {Object} userData - User information
 * @param {string} userData.name - User's full name
 * @param {string} userData.email - User's email
 * @param {string} userData.password - User's password
 * @returns {Object} Result object with success status and user data
 */
export const createUserAccount = async (userData) => {
  try {
    const { name, email, password } = userData
    
    console.log('Starting user account creation for:', email)
    
    // Create user account with Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user
    
    console.log('Firebase Auth account created successfully:', user.uid)
    
    // Prepare user data for Firestore (exclude password)
    const userDocData = {
      uid: user.uid,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      profileComplete: false,
      preferences: {
        notifications: true,
        theme: 'light',
        // default language preference
        language: 'en'
      }
    }
    
    console.log('Attempting to save user data to Firestore:', userDocData)
    
    // Store user data in Firestore using the user's UID as document ID
    await setDoc(doc(db, USERS_COLLECTION, user.uid), userDocData)
    
    console.log('User data saved to Firestore successfully!')
    
    return {
      success: true,
      user: {
        uid: user.uid,
        name: userDocData.name,
        email: userDocData.email,
        preferences: userDocData.preferences
      },
      message: 'Account created successfully!'
    }
    
  } catch (error) {
    console.error('Detailed error creating user account:', error)
    console.error('Error code:', error.code)
    console.error('Error message:', error.message)
    
    // Handle specific Firebase Auth errors
    let errorMessage = 'Failed to create account. Please try again.'
    
    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'An account with this email already exists.'
        break
      case 'auth/weak-password':
        errorMessage = 'Password should be at least 6 characters long.'
        break
      case 'auth/invalid-email':
        errorMessage = 'Please enter a valid email address.'
        break
      case 'auth/network-request-failed':
        errorMessage = 'Network error. Please check your connection.'
        break
      case 'firestore/permission-denied':
        errorMessage = 'Database access denied. Please check Firestore rules.'
        break
      case 'firestore/unavailable':
        errorMessage = 'Database temporarily unavailable. Please try again.'
        break
      default:
        errorMessage = error.message || errorMessage
    }
    
    return {
      success: false,
      error: errorMessage
    }
  }
}

/**
 * Sign in existing user
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Object} Result object with success status and user data
 */
export const signInUser = async (email, password) => {
  try {
    // Basic client-side validation to avoid sending malformed requests
    if (!email || !email.toString().trim()) {
      console.error('signInUser called with empty email')
      return { success: false, error: 'Please provide an email address.' }
    }
    if (!password || password.length < 6) {
      console.error('signInUser called with empty or too-short password')
      return { success: false, error: 'Please provide a valid password (min 6 characters).' }
    }
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user
    
    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, USERS_COLLECTION, user.uid))
    
    if (userDoc.exists()) {
      const userData = userDoc.data()
      
      return {
        success: true,
        user: {
          uid: user.uid,
          name: userData.name,
          email: userData.email,
          profileComplete: userData.profileComplete || false,
          preferences: userData.preferences || {}
        },
        message: 'Signed in successfully!'
      }
    } else {
      // If user doc doesn't exist in Firestore, create a basic one
      const basicUserData = {
        uid: user.uid,
        email: user.email,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
      
      await setDoc(doc(db, USERS_COLLECTION, user.uid), basicUserData)
      
      return {
        success: true,
        user: {
          uid: user.uid,
          email: user.email,
          preferences: basicUserData.preferences || {}
        },
        message: 'Signed in successfully!'
      }
    }
    
  } catch (error) {
    // Log full error for debugging (developer console only)
    console.error('Error signing in:', error)

    // Build a helpful error message for the UI
    let errorMessage = 'Failed to sign in. Please try again.'

    // Provide clearer mappings for common Firebase auth errors
    switch (error.code) {
      case 'auth/user-not-found':
        errorMessage = 'No account found for that email.'
        break
      case 'auth/wrong-password':
        errorMessage = 'Incorrect password. Please try again.'
        break
      case 'auth/invalid-credential':
      case 'auth/invalid-email':
        errorMessage = 'Invalid email or credential. Please check your login details.'
        break
      case 'auth/too-many-requests':
        errorMessage = 'Too many failed attempts. Please try again later.'
        break
      case 'auth/network-request-failed':
        errorMessage = 'Network error. Please check your connection.'
        break
      default:
        // Fall back to the raw message for unknown errors (developer-friendly)
        errorMessage = error.message || errorMessage
    }

    return {
      success: false,
      error: errorMessage,
      code: error.code
    }
  }
}

/**
 * Get user data from Firestore
 * @param {string} uid - User's UID
 * @returns {Object} User data or null
 */
export const getUserData = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, USERS_COLLECTION, uid))
    
    if (userDoc.exists()) {
      return userDoc.data()
    } else {
      console.log('No user document found')
      return null
    }
  } catch (error) {
    console.error('Error getting user data:', error)
    return null
  }
}

/**
 * Get user preferences from Firestore
 * @param {string} uid - User's UID
 * @returns {Object} Result with preferences data
 */
export const getUserPreferences = async (uid) => {
  try {
    if (!uid) throw new Error('No uid provided')

    const userDoc = await getDoc(doc(db, USERS_COLLECTION, uid))
    
    if (userDoc.exists()) {
      const userData = userDoc.data()
      return { 
        success: true, 
        data: userData.preferences || {},
        name: userData.name,
        email: userData.email
      }
    } else {
      return { success: false, error: 'User document not found' }
    }
  } catch (error) {
    console.error('Error getting user preferences:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Mark user profile as complete after first-time setup
 * @param {string} uid - User's UID
 * @returns {Object} Result with success status
 */
export const setProfileComplete = async (uid) => {
  try {
    if (!uid) throw new Error('No uid provided')

    await setDoc(doc(db, USERS_COLLECTION, uid), {
      profileComplete: true,
      updatedAt: serverTimestamp()
    }, { merge: true })

    return { success: true }
  } catch (error) {
    console.error('Error setting profile complete:', error)
    return { success: false, error: error.message }
  }
}

export const setUserLanguage = async (uid, language) => {
  try {
    if (!uid) throw new Error('No uid provided')

    await setDoc(doc(db, USERS_COLLECTION, uid), {
      preferences: {
        language
      },
      updatedAt: serverTimestamp()
    }, { merge: true })

    return { success: true }
  } catch (error) {
    console.error('Error setting user language:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Update user details (name, email, phone) in Firestore using merge
 */
export const setUserDetails = async (uid, details) => {
  try {
    if (!uid) throw new Error('No uid provided')

    const payload = {
      updatedAt: serverTimestamp(),
      ...details
    }

    await setDoc(doc(db, USERS_COLLECTION, uid), payload, { merge: true })
    return { success: true }
  } catch (error) {
    console.error('Error setting user details:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Sign in with Google (popup)
 * Creates a Firestore user doc if missing.
 */
export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)
    const user = result.user

    // Try to get Firestore user doc
    const userDoc = await getDoc(doc(db, USERS_COLLECTION, user.uid))

    if (userDoc.exists()) {
      const userData = userDoc.data()
      return {
        success: true,
        user: {
          uid: user.uid,
          name: userData.name || user.displayName || null,
          email: userData.email || user.email || null,
          profileComplete: userData.profileComplete || false,
          preferences: userData.preferences || {}
        },
        message: 'Signed in with Google'
      }
    } else {
      // Create basic user doc from Google profile
      const basicUserData = {
        uid: user.uid,
        name: user.displayName || null,
        email: user.email || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
      await setDoc(doc(db, USERS_COLLECTION, user.uid), basicUserData)

      return {
        success: true,
        user: {
          uid: user.uid,
          name: basicUserData.name,
          email: basicUserData.email,
          preferences: {}
        },
        message: 'Signed in with Google'
      }
    }
  } catch (error) {
    console.error('Error signing in with Google:', error)
    let errorMessage = error.message || 'Google sign-in failed'
    return { success: false, error: errorMessage, code: error.code }
  }
}