// ==========================================
// Authentication Logic
// ==========================================

import { auth, googleProvider, db } from './firebase-config.js';
import { signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Login with Google
export async function loginWithGoogle() {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        // Save user to Firestore if new
        await saveUserProfile(user);

        return user;
    } catch (error) {
        console.error("Login Error Details:", {
            code: error.code,
            message: error.message,
            customData: error.customData
        });

        let userMessage = "Login failed. ";
        if (error.code === 'auth/popup-closed-by-user') {
            userMessage += "You closed the login popup.";
        } else if (error.code === 'auth/cancelled-popup-request') {
            userMessage += "Another popup is already open.";
        } else if (error.code === 'auth/unauthorized-domain') {
            userMessage += "This domain (localhost) is not authorized in Firebase Console.";
        } else {
            userMessage += error.message;
        }

        throw new Error(userMessage);
    }
}

// Logout
export async function logoutUser() {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Logout failed:", error);
        throw error;
    }
}

// Save User Profile to Firestore
async function saveUserProfile(user) {
    const userRef = doc(db, "users", user.uid);

    try {
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            await setDoc(userRef, {
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                createdAt: new Date(),
                wishlist: [], // Store product IDs
                cart: []      // Store {id, quantity} objects
            });
            console.log("New user profile created");
        }
    } catch (e) {
        console.error("Error creating user profile", e);
    }
}

// Monitor Auth State
export function monitorAuthState(onLogin, onLogout) {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("User is signed in:", user.displayName);
            onLogin(user);
        } else {
            console.log("User is signed out");
            onLogout();
        }
    });
}
