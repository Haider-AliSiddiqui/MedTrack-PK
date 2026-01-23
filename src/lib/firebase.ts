// Firebase configuration and initialization...!

import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth"; // for authentication
import { getFirestore } from "firebase/firestore"; // for firestore database

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBdLscXwQKP--JBNuQ3cGXv68ze3fRwE5Y",
  authDomain: "next-js-project-aed3f.firebaseapp.com",
  projectId: "next-js-project-aed3f",
  storageBucket: "next-js-project-aed3f.firebasestorage.app",
  messagingSenderId: "55373160706",
  appId: "1:55373160706:web:02d42687b9a7d76512e21b",
  measurementId: "G-KE0L1M7NYX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Authentication
const auth = getAuth(app);

// Database
const db = getFirestore(app);

export { app, auth, db };
