// ==========================================
// Checkout Logic
// ==========================================

import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// State
let currentUser = null;
let cart = [];

// Initialize
document.addEventListener('DOMContentLoaded', async () => {

    // Auth Listener
    onAuthStateChanged(auth, (user) => {
        currentUser = user;
        checkAuthStatus();
    });

    loadCart();
    setupEventListeners();
});

function checkAuthStatus() {
    const authCheck = document.getElementById('authCheck');
    const payBtn = document.getElementById('payBtn');

    if (currentUser) {
        authCheck.classList.add('hidden');
        payBtn.disabled = false;
        payBtn.classList.remove('opacity-50', 'cursor-not-allowed');

        // Auto-fill mock data if needed or fetch from profile
        // For now, let's keep form empty for user to fill
    } else {
        authCheck.classList.remove('hidden');
        payBtn.disabled = true;
        payBtn.classList.add('opacity-50', 'cursor-not-allowed');
    }
}

function loadCart() {
    // Get local cart
    const storedCart = localStorage.getItem('cart');
    cart = storedCart ? JSON.parse(storedCart) : [];

    const cartContainer = document.getElementById('cartItems');
    const subtotalEl = document.getElementById('subtotalDisplay');
    const totalEl = document.getElementById('totalDisplay');

    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="text-center py-8">
                <span class="material-icons text-slate-300 text-4xl mb-2">production_quantity_limits</span>
                <p class="text-sm text-slate-500">Your cart is empty.</p>
                <a href="index.html" class="text-primary text-xs font-bold underline mt-2 block">Go Shop</a>
            </div>
        `;
        subtotalEl.textContent = '$0.00';
        totalEl.textContent = '$0.00';
        document.getElementById('payBtn').disabled = true;
        return;
    }

    // Render Items
    cartContainer.innerHTML = cart.map(item => `
        <div class="flex items-center gap-4 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
            <div class="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0 border border-slate-200">
                <img src="${item.image}" class="w-full h-full object-cover" alt="${item.name}">
            </div>
            <div class="flex-1 min-w-0">
                <h4 class="text-sm font-bold text-slate-900 dark:text-white truncate">${item.name}</h4>
                <p class="text-xs text-slate-500 truncate">${item.brand}</p>
                <div class="flex items-center gap-2 mt-1">
                    <span class="text-xs px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-slate-600 dark:text-slate-300 uppercase font-bold">${item.selectedSize}</span>
                    <span class="w-3 h-3 rounded-full border border-slate-300" style="background-color: ${item.selectedColor}"></span>
                    <span class="text-xs text-slate-400">Qty: ${item.quantity}</span>
                </div>
            </div>
            <div class="text-right">
                <p class="text-sm font-bold text-slate-900 dark:text-white">$${(item.price * item.quantity).toFixed(2)}</p>
            </div>
        </div>
    `).join('');

    // Calculate Totals
    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    subtotalEl.textContent = `$${total.toFixed(2)}`;
    totalEl.textContent = `$${total.toFixed(2)}`;
}

function setupEventListeners() {
    document.getElementById('payBtn').addEventListener('click', processPayment);
}

async function processPayment() {
    if (!currentUser) {
        alert('Please log in to continue.');
        window.location.href = 'index.html';
        return;
    }

    // Validate Form (Basic)
    const form = document.getElementById('checkoutForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    // Show Loading
    const loadingOverlay = document.getElementById('loadingOverlay');
    loadingOverlay.classList.remove('hidden');

    // Simulate Network Delay (2 seconds)
    setTimeout(async () => {

        // 1. Success! Clear Cart
        localStorage.removeItem('cart');

        // 2. Clear Cloud Cart (If we had backend sync)
        if (currentUser) {
            try {
                const userRef = doc(db, "users", currentUser.uid);
                await updateDoc(userRef, {
                    cart: [] // Empty cart in DB
                });
            } catch (e) {
                console.warn("Backend sync failed, but local cleared", e);
            }
        }

        // 3. Hide Loading
        loadingOverlay.classList.add('hidden');

        // 4. Show Success Modal
        const successModal = document.getElementById('successModal');
        successModal.classList.remove('hidden');
        successModal.classList.remove('opacity-0'); // Fade in
        successModal.querySelector('div').classList.remove('scale-90'); // Scale up
        successModal.querySelector('div').classList.add('scale-100');

        // 5. Confetti Effect (Simple CSS or JS?)
        // Let's stick to the modal for elegance.

    }, 2500);
}
