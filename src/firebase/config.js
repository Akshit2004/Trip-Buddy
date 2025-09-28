// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

// Debug: Log configuration status
console.log('Firebase Config Check:')
console.log('API Key:', firebaseConfig.apiKey ? '✅ Set' : '❌ Missing')
console.log('Auth Domain:', firebaseConfig.authDomain ? '✅ Set' : '❌ Missing')
console.log('Project ID:', firebaseConfig.projectId ? '✅ Set' : '❌ Missing')
console.log('Storage Bucket:', firebaseConfig.storageBucket ? '✅ Set' : '❌ Missing')
console.log('Messaging Sender ID:', firebaseConfig.messagingSenderId ? '✅ Set' : '❌ Missing')
console.log('App ID:', firebaseConfig.appId ? '✅ Set' : '❌ Missing')

// Check if critical values are missing
const missingValues = Object.entries(firebaseConfig)
  .filter(([key, value]) => !value)
  .map(([key]) => key)

if (missingValues.length > 0) {
  console.error('🚨 Missing Firebase configuration values:', missingValues)
  console.error('Please create a .env file with your Firebase configuration')
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase services
export const db = getFirestore(app)
export const auth = getAuth(app)
export default app