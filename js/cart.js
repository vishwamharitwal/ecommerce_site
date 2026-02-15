
import { auth, onAuthStateChanged } from './firebase-config.js';
import { syncUserData } from './db.js';
import { sanitizeCart } from './utils.js';

// ==========================================
// CART PAGE LOGIC
// ==========================================

let currentUser = null;
let cart = [];

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Auth Listener to enable Cloud Sync
    onAuthStateChanged(auth, (user) => {
        currentUser = user;
        if (user) {
            console.log("👤 Cart Page: User logged in:", user.email);
            // Optional: Fetch latest cart from cloud? 
            // relying on local storage for now, but syncing updates UP
        }
    });

    // 2. Initial Render
    loadCart();
});

function loadCart() {
    try {
        const rawCart = localStorage.getItem('cart');
        cart = rawCart ? JSON.parse(rawCart) : [];
    } catch (e) {
        console.error("Cart load error:", e);
        cart = [];
    }

    // --- FIX ISSUE 1: REMOVE GHOST PRODUCTS (ROBUST via Utils) ---
    const initialLength = cart.length;
    cart = sanitizeCart(cart);

    if (cart.length !== initialLength) {
        console.warn("🧹 Cleaned up invalid/ghost items from cart.");
        saveCart(); // Save cleaned state immediately
    }
    // ------------------------------------------

    renderCart();
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));

    // UI Update: Immediately update header badge
    updateHeaderBadge();

    // Cloud Sync
    if (currentUser) {
        syncUserData(currentUser.uid, 'cart', cart)
            .then(() => console.log("☁️ Cart synced to cloud"))
            .catch(err => console.error("Sync failed:", err));
    }
}

// Helper: Update Header Badge directly
function updateHeaderBadge() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const els = ['cartCount', 'floatingCartCount'];

    els.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = count;
            if (count > 0) el.classList.add('badge-pulse');
            else el.classList.remove('badge-pulse');
        }
    });
}

function renderCart() {
    const container = document.getElementById('cartItemsContainer');
    const subtotalEl = document.getElementById('subtotalDisplay');
    const totalEl = document.getElementById('totalDisplay');
    const checkoutBtn = document.getElementById('checkoutBtn');

    // UI IMPROVEMENT: Loading State
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="text-center py-12 md:py-20 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                <span class="material-icons text-5xl md:text-6xl text-slate-300 mb-4">remove_shopping_cart</span>
                <p class="text-lg text-slate-500 font-medium">Your cart is empty.</p>
                <p class="text-sm text-slate-400 mb-6">Looks like you haven't added anything yet.</p>
                <a href="index.html" class="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/30">
                    <span class="material-icons text-sm">arrow_back</span>
                    Start Shopping
                </a>
            </div>
         `;
        if (subtotalEl) subtotalEl.innerText = '$0.00';
        if (totalEl) totalEl.innerText = '$0.00';
        if (checkoutBtn) {
            checkoutBtn.disabled = true;
            checkoutBtn.classList.add('opacity-50', 'cursor-not-allowed');
        }
        return;
    }

    if (checkoutBtn) {
        checkoutBtn.disabled = false;
        checkoutBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    }

    let subtotal = 0;

    container.innerHTML = cart.map((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        // RESPONSIVE UI FIX: Flex-col on mobile, Row on Desktop
        return `
        <div class="group flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm transition-all hover:shadow-md">
            <!-- Image -->
            <div class="w-full sm:w-24 h-48 sm:h-32 flex-shrink-0 bg-slate-50 rounded-lg overflow-hidden relative">
                <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover transition-transform group-hover:scale-105">
            </div>
            
            <!-- Details -->
            <div class="flex-1 flex flex-col justify-between">
                <div>
                    <div class="flex justify-between items-start gap-4">
                        <h4 class="font-bold text-slate-900 dark:text-white text-lg sm:text-base leading-tight">${item.name}</h4>
                        <button onclick="window.removeCartItem(${index})" class="text-slate-400 hover:text-red-500 transition-colors p-1 hover:bg-red-50 rounded-full" title="Remove Item">
                            <span class="material-icons text-xl">close</span>
                        </button>
                    </div>
                    <p class="text-sm text-slate-500 mt-1 font-medium">
                        ${item.selectedColor} <span class="mx-1">•</span> ${item.selectedSize}
                    </p>
                    <div class="text-base font-bold text-primary mt-2">$${item.price.toFixed(2)}</div>
                </div>

                <div class="flex items-center justify-between mt-4 sm:mt-0">
                    <!-- Qty Control -->
                    <div class="flex items-center border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900">
                        <button onclick="window.updateCartQty(${index}, -1)" class="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center hover:bg-white dark:hover:bg-slate-800 text-slate-600 transition-colors rounded-l-lg">-</button>
                        <span class="w-10 sm:w-8 text-center text-sm font-bold">${item.quantity}</span>
                        <button onclick="window.updateCartQty(${index}, 1)" class="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center hover:bg-white dark:hover:bg-slate-800 text-slate-600 transition-colors rounded-r-lg">+</button>
                    </div>
                    <span class="font-bold text-slate-900 dark:text-white text-lg">$${itemTotal.toFixed(2)}</span>
                </div>
            </div>
        </div>
        `;
    }).join('');

    if (subtotalEl) subtotalEl.innerText = `$${subtotal.toFixed(2)}`;
    if (totalEl) totalEl.innerText = `$${subtotal.toFixed(2)}`;
}

// Global functions for inline HTML calls (Attached to window)
window.updateCartQty = (index, change) => {
    if (cart[index]) {
        cart[index].quantity += change;
        if (cart[index].quantity < 1) cart[index].quantity = 1;

        saveCart(); // Syncs to cloud
        renderCart();
    }
};

window.removeCartItem = (index) => {
    if (index > -1 && index < cart.length) {
        cart.splice(index, 1);
        saveCart(); // Syncs to cloud (Removing item permanently)
        renderCart();
    }
};
