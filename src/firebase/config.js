// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB8mRC1d7iyUj4v55bwzYCkjSlOEfaX8Dg",
  authDomain: "tripbuddy-c8ac1.firebaseapp.com",
  projectId: "tripbuddy-c8ac1",
  storageBucket: "tripbuddy-c8ac1.firebasestorage.app",
  messagingSenderId: "346053165980",
  appId: "1:346053165980:web:06ba6372a444463bf53e59",
  measurementId: "G-N159PQ3ZYV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
