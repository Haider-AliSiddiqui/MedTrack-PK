// Firebase configuration and initialization...!

import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth"; // for authentication
import { getFirestore } from "firebase/firestore"; // for firestore database

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDlTowS_NlIy4hL-xFhqlqtw0JZEjg2spw",
  authDomain: "medtrack-pk.firebaseapp.com",
  projectId: "medtrack-pk",
  storageBucket: "medtrack-pk.firebasestorage.app",
  messagingSenderId: "630831698955",
  appId: "1:630831698955:web:457fb53ea0e7e4b265e30e",
  measurementId: "G-JR5LX0C5YX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Authentication
const auth = getAuth(app);

// Database
const db = getFirestore(app);

export { app, auth, db };
