// ==========================================
// Firebase Configuration & Initialization
// ==========================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBxYg0QIoBku4baHQuC196Mg_a5aTNgatQ",
    authDomain: "first-ecommerce-e7d82.firebaseapp.com",
    projectId: "first-ecommerce-e7d82",
    storageBucket: "first-ecommerce-e7d82.firebasestorage.app",
    messagingSenderId: "634130560797",
    appId: "1:634130560797:web:570a9c9d472d5a552fd3f4",
    measurementId: "G-JNSS84ME4L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

console.log('🔥 Firebase Initialized Successfully!');
