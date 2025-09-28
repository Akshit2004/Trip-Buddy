import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db, auth } from './config'

// Helper to check if a user is signed in
const getCurrentUid = () => {
  try {
    return auth?.currentUser?.uid || null
  } catch (err) {
    return null
  }
}

const SUPPORT_COLLECTION = 'support'

/**
 * Submit a support request to Firestore
 * @param {Object} payload - support data
 * @param {string} payload.uid - user uid (optional)
 * @param {string} payload.name - user name
 * @param {string} payload.email - user email
 * @param {string} payload.subject - subject of the request
 * @param {string} payload.message - message body
 * @returns {Object} result
 */
export const submitSupportRequest = async (payload) => {
  try {
    // If the app requires authenticated requests to write to support, use current auth state
    const uid = payload.uid || getCurrentUid()

    if (!uid) {
      // Return a clear error so the UI can prompt the user to sign in
      console.error('Attempt to submit support request while not authenticated')
      return { success: false, error: 'User not authenticated. Please sign in to submit a support request.' }
    }

    const docRef = await addDoc(collection(db, SUPPORT_COLLECTION), {
      uid: uid,
      name: payload.name || null,
      email: payload.email || null,
      subject: payload.subject || 'General',
      message: payload.message || '',
      createdAt: serverTimestamp(),
      status: 'open'
    })

    return { success: true, id: docRef.id }
  } catch (error) {
    // More helpful log and return
    console.error('Error submitting support request:', error)
    // Detect permission errors and return a friendly message
    if (error?.code === 'permission-denied' || /permission/i.test(error?.message || '')) {
      return { success: false, error: 'Permission denied: your account cannot write to support. Check Firestore rules.' }
    }
    return { success: false, error: error.message || 'Failed to submit support request' }
  }
}
