// ==========================================
// Database Logic (Firestore)
// ==========================================

import { db } from './firebase-config.js';
import { collection, getDocs, addDoc, doc, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Fetch Products
export async function fetchProducts() {
    const products = [];
    try {
        const querySnapshot = await getDocs(collection(db, "products"));
        querySnapshot.forEach((doc) => {
            products.push({ id: doc.id, ...doc.data() });
        });
        return products;
    } catch (e) {
        console.error("Error fetching products: ", e);
        return [];
    }
}

// Seed Products (One time use)
export async function seedProducts(productsData) {
    const collectionRef = collection(db, "products");

    try {
        const snapshot = await getDocs(collectionRef);
        if (!snapshot.empty) {
            console.log("Database already has products. Skipping seed.");
            return;
        }

        console.log("Seeding database...");
        let count = 0;
        for (const product of productsData) {
            const { id, ...data } = product;
            await addDoc(collectionRef, data);
            count++;
        }
        console.log(`Seeding complete! Added ${count} products.`);
    } catch (e) {
        console.error("Error seeding products:", e);
    }
}

// Generic User Data Sync (Cart or Wishlist)
export async function syncUserData(userId, field, data) {
    const userRef = doc(db, "users", userId);
    try {
        await updateDoc(userRef, {
            [field]: data
        });
    } catch (error) {
        console.error(`Error syncing ${field}:`, error);
    }
}

// Fetch User Data
export async function fetchUserData(userId) {
    const userRef = doc(db, "users", userId);
    try {
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            console.log("No such document!");
            return null;
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        return null;
    }
}
