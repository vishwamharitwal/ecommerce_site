import { auth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { createOrder, fetchUserData, syncUserData } from './db.js';
import { sanitizeCart, mergeCarts } from './utils.js';

console.log("🚀 Checkout Script Loaded");

let currentUser = null;
let cart = [];

document.addEventListener('DOMContentLoaded', () => {
    console.log("🚀 DOM Content Loaded");

    // 1. Auth Listener
    onAuthStateChanged(auth, async (user) => {
        console.log("👤 Auth State Changed:", user ? user.uid : "Logged Out");
        currentUser = user;
        if (user) {
            // Hide Auth Warning
            document.getElementById('authCheck').classList.add('hidden');
            // Fetch latest cart data
            const userData = await fetchUserData(user.uid);
            if (userData && userData.cart) {
                console.log("☁️ Merging with Cloud Cart:", userData.cart.length);
                // Merge logic (Security: Ensure we have latest cloud data)
                const localCart = JSON.parse(localStorage.getItem('cart')) || [];
                cart = mergeCarts(localCart, userData.cart);
                renderOrderSummary();
            } else {
                console.log("☁️ No Cloud Cart found");
            }
        } else {
            console.log("🚧 User Logged Out - Using Local Cart");
            // Show Auth Warning
            document.getElementById('authCheck').classList.remove('hidden');
            // Load local cart
            const rawCart = localStorage.getItem('cart');
            cart = rawCart ? JSON.parse(rawCart) : [];
            cart = sanitizeCart(cart);
            renderOrderSummary();
        }
    });

    // 2. Setup Form Listener
    const payBtn = document.getElementById('payBtn');
    if (payBtn) {
        console.log("✅ Pay Button Found");
        payBtn.addEventListener('click', handleCheckout);
    } else {
        console.error("❌ Pay Button NOT Found!");
    }
});

function renderOrderSummary() {
    console.log("🛒 Rendering Summary. Items:", cart.length);
    const container = document.getElementById('cartItems');
    const subtotalEl = document.getElementById('subtotalDisplay');
    const totalEl = document.getElementById('totalDisplay');

    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = '<div class="text-center text-slate-400 py-4">Your cart is empty.</div>';
        subtotalEl.innerText = '$0.00';
        totalEl.innerText = '$0.00';
        const payBtn = document.getElementById('payBtn');
        if (payBtn) {
            payBtn.disabled = true;
            payBtn.classList.add('opacity-50', 'cursor-not-allowed');
        }
        return;
    }

    let subtotal = 0;
    container.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        return `
            <div class="flex items-center gap-4 text-sm">
                <div class="relative">
                    <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-lg border border-slate-100">
                    <span class="absolute -top-2 -right-2 w-5 h-5 bg-slate-500 text-white text-xs flex items-center justify-center rounded-full">${item.quantity}</span>
                </div>
                <div class="flex-1">
                    <h4 class="font-medium text-slate-900 dark:text-white line-clamp-1">${item.name}</h4>
                    <p class="text-slate-500 text-xs">${item.selectedColor} / ${item.selectedSize}</p>
                </div>
                <div class="font-bold text-slate-700 dark:text-slate-300">$${itemTotal.toFixed(2)}</div>
            </div>
        `;
    }).join('');

    subtotalEl.innerText = `$${subtotal.toFixed(2)}`;
    totalEl.innerText = `$${subtotal.toFixed(2)}`;

    const payBtn = document.getElementById('payBtn');
    if (payBtn) {
        payBtn.disabled = false;
        payBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    }
}

async function handleCheckout(e) {
    e.preventDefault();
    console.log("🖱️ Pay Button Clicked");

    // 1. Validation
    if (!currentUser) {
        console.warn("🚫 Login Required");
        alert("Please login to place an order.");
        window.location.href = 'index.html'; // Or show login modal if we had one here
        return;
    }

    if (cart.length === 0) {
        console.warn("🚫 Cart Empty");
        alert("Your cart is empty!");
        return;
    }

    const form = document.getElementById('checkoutForm');
    if (!form.checkValidity()) {
        console.warn("🚫 Form Invalid");
        form.reportValidity();
        return;
    }

    console.log("✅ Validation Passed. Processing...");

    // 2. Collect Data
    const inputs = form.querySelectorAll('input, select');
    const addressData = {};
    inputs.forEach(input => {
        if (input.type !== 'checkbox') {
            // For simplicity, using index or assume order triggers.
            // Better to use name attributes.
            // checkout.html inputs don't have name attributes!
            // Let's use labels or assumptions for now as prototype.
        }
    });

    // Mock Address for Verification Phase
    const shippingAddress = {
        firstName: inputs[0].value,
        lastName: inputs[1].value,
        email: document.getElementById('emailInput').value,
        address: inputs[3].value,
        city: inputs[4].value,
        zip: inputs[5].value,
        country: inputs[6].value
    };

    // 3. processing State
    const loadingOverlay = document.getElementById('loadingOverlay');
    loadingOverlay.classList.remove('hidden');

    // 4. Create Order (Backend)
    const orderPayload = {
        items: cart,
        totalAmount: parseFloat(document.getElementById('totalDisplay').innerText.replace('$', '')),
        shippingAddress: shippingAddress,
        paymentMethod: 'Credit Card (Mock)',
        paymentStatus: 'paid' // Mocking successful payment
    };

    // Simulate Network Delay (Payment Gateway)
    await new Promise(r => setTimeout(r, 2000));

    const result = await createOrder(currentUser.uid, orderPayload);

    loadingOverlay.classList.add('hidden');

    if (result.success) {
        // Success
        console.log("✅ Order Placed:", result.orderId);

        // Clear Local Cart
        localStorage.removeItem('cart');
        cart = [];

        // Show Success Modal
        const successModal = document.getElementById('successModal');
        successModal.classList.remove('hidden');
        // Trigger animation
        setTimeout(() => successModal.classList.remove('opacity-0'), 10);

    } else {
        console.error("❌ Order Failed:", result.error);
        alert("Order failed: " + result.error);
    }
}
