// ==========================================
// Product Details Page Logic
// ==========================================

import { auth, db } from './firebase-config.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Get Product ID from URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

// State
let product = null;
let currentUser = null;
let selectedSize = null;
let selectedColor = null;

// Initialize
document.addEventListener('DOMContentLoaded', async () => {

    // Auth Listener
    onAuthStateChanged(auth, (user) => {
        currentUser = user;
        updateCartBadge();
        updateAuthUI(user);

        const actions = document.getElementById('productActions');
        const loginPromptId = 'loginPromptBox';
        let loginPrompt = document.getElementById(loginPromptId);

        if (user) {
            if (actions) actions.classList.remove('hidden');
            if (loginPrompt) loginPrompt.classList.add('hidden');
        } else {
            if (actions) actions.classList.add('hidden');

            // Show Login Prompt
            if (!loginPrompt && actions) {
                loginPrompt = document.createElement('div');
                loginPrompt.id = loginPromptId;
                loginPrompt.className = 'p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-center border border-slate-100 dark:border-slate-700';
                loginPrompt.innerHTML = `
                    <p class="text-sm text-slate-500 mb-3">Sign in to purchase this exclusive item</p>
                    <button id="paramsLoginBtn" class="px-6 py-2 bg-primary text-white text-sm font-bold uppercase tracking-widest rounded-lg hover:bg-slate-800 transition-colors">
                        Log In to Shop
                    </button>
                `;
                actions.parentNode.insertBefore(loginPrompt, actions.nextSibling);

                // Add listener to new button
                document.getElementById('paramsLoginBtn').addEventListener('click', () => {
                    window.location.href = 'index.html';
                });
            } else if (loginPrompt) {
                loginPrompt.classList.remove('hidden');
            }
        }
    });

    if (!productId) {
        // alert('Product ID missing'); // Debug
        // window.location.href = 'index.html'; // Optional: Redirect
        // return;
    }

    await loadProductDetails();
    setupEventListeners();
    loadDarkModePreference();
});

// Load Product Data
async function loadProductDetails() {
    // Show Loading Skeleton if possible

    // 1. Try DB
    try {
        if (productId) {
            const docRef = doc(db, "products", productId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                product = { id: docSnap.id, ...docSnap.data() };
                renderProduct(product);
                return;
            }
        }
    } catch (e) {
        console.warn("Firestore fetch failed, falling back to mock:", e);
    }

    // 2. Fallback Mock Data (For demo/testing without DB)
    console.log("Using Mock Data");
    product = getMockProduct(productId || '1');
    renderProduct(product);
}

function renderProduct(p) {
    if (!p) return;

    // Set Page Title
    document.title = `${p.name} - VOGUE`;

    // Safe Text Updates
    setText('productName', p.name);
    setText('productBrand', p.brand);
    setText('productPrice', `$${p.price.toFixed(2)}`);
    setText('bcCategory', p.category || 'Collection');
    setText('bcProduct', p.name);

    // Image
    const img = document.getElementById('mainImage');
    if (img) {
        img.src = p.image;
        img.alt = p.name;
    }

    // Optional Fields
    if (p.originalPrice) {
        setText('productOriginalPrice', `$${p.originalPrice.toFixed(2)}`);
        setVisible('productOriginalPrice', true);

        const discount = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
        setText('discountBadge', `SAVE ${discount}%`);
        setVisible('discountBadge', true);
    }

    // Colors
    const colorContainer = document.getElementById('colorContainer');
    if (colorContainer) {
        const colors = p.colors || (p.color ? [p.color] : ['Black']);
        colorContainer.innerHTML = colors.map(color => `
            <button class="color-option w-8 h-8 rounded-full border border-slate-200 transition-transform hover:scale-110 focus:outline-none" 
                    style="background-color: ${color.toLowerCase()};"
                    onclick="selectColor(this, '${color}')"
                    title="${color}">
            </button>
        `).join('');
        // Select first
        if (colorContainer.firstElementChild) selectColor(colorContainer.firstElementChild, colors[0]);
    }

    // Sizes
    const sizeContainer = document.getElementById('sizeContainer');
    if (sizeContainer) {
        const sizes = p.sizes || ['S', 'M', 'L'];
        sizeContainer.innerHTML = sizes.map(size => `
            <button class="size-option py-2 px-4 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:border-primary hover:text-primary transition-all"
                    onclick="selectSize(this, '${size}')">
                ${size.toUpperCase()}
            </button>
        `).join('');
    }
}

// UI Helpers
function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

function setVisible(id, visible) {
    const el = document.getElementById(id);
    if (el) visible ? el.classList.remove('hidden') : el.classList.add('hidden');
}

// Selection Logic (Global for inline onclick)
window.selectColor = (el, color) => {
    document.querySelectorAll('.color-option').forEach(b => {
        b.classList.remove('ring-2', 'ring-primary', 'ring-offset-2');
    });
    el.classList.add('ring-2', 'ring-primary', 'ring-offset-2');
    selectedColor = color;
};

window.selectSize = (el, size) => {
    document.querySelectorAll('.size-option').forEach(b => {
        b.classList.remove('bg-primary', 'text-white', 'border-primary');
    });
    el.classList.add('bg-primary', 'text-white', 'border-primary');
    selectedSize = size;
};

// Cart Logic
window.addToCart = function () {
    console.log("Add to Cart Clicked");
    console.log("Current User:", currentUser);
    console.log("Product:", product);
    console.log("Selected Size:", selectedSize);
    console.log("Selected Color:", selectedColor);

    if (!currentUser) {
        showToast('Please login to continue shopping', 'error');
        // prompt login
        const logicPrompt = document.getElementById('loginPromptBox');
        if (logicPrompt) logicPrompt.scrollIntoView({ behavior: 'smooth' });
        return;
    }

    if (!product) {
        console.error("Product object is null/undefined during addToCart call");
        showToast('Still loading product details... please wait', 'info');
        return;
    }

    // Auto-select first options if not selected (UX Improvement)
    if (!selectedSize && product.sizes && product.sizes.length > 0) {
        selectedSize = product.sizes[0];
        console.log("Auto-selected size:", selectedSize);

        // Visually select it
        const sizeBtns = document.querySelectorAll('.size-option');
        if (sizeBtns.length > 0) {
            sizeBtns[0].classList.add('bg-primary', 'text-white', 'border-primary');
        }
    }

    if (!selectedColor && (product.colors || product.color)) {
        const colors = product.colors || [product.color];
        if (colors.length > 0) selectedColor = colors[0];
        console.log("Auto-selected color:", selectedColor);

        // Visually select it
        const colorBtns = document.querySelectorAll('.color-option');
        if (colorBtns.length > 0) {
            colorBtns[0].classList.add('ring-2', 'ring-primary', 'ring-offset-2');
        }
    }


    if (!selectedSize) {
        showToast('Please select a size', 'error');
        return;
    }

    // Explicit quantity (using window.qty from HTML script or default)
    const qtyDisplay = document.getElementById('qtyDisplay');
    let quantity = 1;
    if (qtyDisplay) {
        quantity = parseInt(qtyDisplay.innerText);
    }
    if (isNaN(quantity) || quantity < 1) quantity = 1;

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const existingItem = cart.find(item => item.id == product.id && item.selectedSize == selectedSize && item.selectedColor == selectedColor);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            selectedSize: selectedSize || (product.sizes ? product.sizes[0] : 'One Size'),
            selectedColor: selectedColor || (product.colors ? product.colors[0] : 'Default'),
            quantity: quantity
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
    showToast(`${product.name} added to cart!`, 'success');

    // Redirect to Cart Page after short delay
    setTimeout(() => {
        window.location.href = 'cart.html';
    }, 1000);
};

function updateCartBadge() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((acc, item) => acc + item.quantity, 0);
    const badge = document.getElementById('cartCount');
    if (badge) badge.textContent = count;
}

function setupEventListeners() {
    // AddToCart button uses onclick

    const darkBtn = document.getElementById('darkModeToggle');
    if (darkBtn) darkBtn.addEventListener('click', toggleDarkMode);
}

// Shared Utility Replacements
function showToast(msg, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    const bgColor = type === 'error' ? 'bg-red-500' : (type === 'success' ? 'bg-green-600' : 'bg-slate-800');

    toast.className = `p-4 rounded-lg shadow-xl text-white text-sm font-medium animate-bounce-in mb-2 ${bgColor}`;
    toast.style.minWidth = '200px';
    toast.innerText = msg;

    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function toggleDarkMode() {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('darkMode', document.documentElement.classList.contains('dark'));
}

function loadDarkModePreference() {
    if (localStorage.getItem('darkMode') === 'true') {
        document.documentElement.classList.add('dark');
    }
}

// Mock Data fallbacks
const initialProducts = [
    {
        id: 1,
        name: "Oversized Cashmere Sweater",
        brand: "Saint Laurent",
        price: 890,
        originalPrice: 1200,
        rating: 4.5,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBVKSAScgyz7tuU3yDPrcVAtGtIel581hZ3FK370DyJTnjOq-UABiMOapmPL7cU2jnLwnhQqUXHuw0JteixpnGVIhOwB7hZlS_89pVidIe-VcMoT5-BaTiGvi0kThAfysbg4H2VcIojaBeNIwSevEIelQpDU6rzTNe-xX4SZZUzZ3aQYO9AeaUAS8-arxQbxpWREcN-iH28AQC7tVBwlb9fLKJ1djDkmAZS-xaGw4_Kg1vXGrq18qHRNWEKD1PJ6Ef7wibZtRdyTRzM",
        category: "men",
        subcategory: "knitwear",
        color: "black",
        sizes: ["s", "m", "l", "xl"]
    },
    {
        id: 2,
        name: "Brushed Mohair Scarf",
        brand: "Prada",
        price: 425,
        rating: 5.0,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuARd8W_Fo27EehUST6BpUgI9vm_W0gAfnwY-4uTe3JUxlm2P5XEdvPNr4hJtBwD7YeMITJBG74Izv30obf7mwOH9zcvUNRYxPzLtdI6PE_ZamaU_dvAK0C1dKYUmQtC5UfrYM1jx9SUCnR8Xu-Yf658PVILJK1MCC6iQ3unGWVtJ4WFXgQPwjLOnZj1EwXrlG3_XO86Ys5wkfJAlvdtwCHj7weR8GmK0Ltdprq6IvsfgjcrEtiIcJ2zxwsO6rmMQKlogTKKDn-M7Qjd",
        badge: "New",
        category: "men",
        subcategory: "knitwear",
        color: "blue",
        sizes: ["m", "l"]
    },
    {
        id: 3,
        name: "Wool-Blend Shift Dress",
        brand: "Balenciaga",
        price: 1450,
        rating: 4.0,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCJW965d-058u_y6RaJ_3yw891eKKE1CEgZE-oCvGw_9JSqTE7RiU-7kkeh6IWu5xyh9wpimXixliDOuqy5Of9mbw8VeH03H5z2NCKjLEoFtgP7E_bQWpTTLLbVtqvlDZTqIEgicrJ3dCnW7j8CZQdqqsOfFeC3tTCZ-Sm9KPpYWItEm7W1P0VxL9VgzF3_Hb_hcT30GUCRhgVJmf83TAOtOeX1Q8_DJkwljXSTBro6xOEZhILHuD7g_2gqSVK4Ckk4I40VevKtxdHU",
        category: "women",
        color: "gray",
        sizes: ["xs", "s", "m", "l"]
    },
    {
        id: 4,
        name: "Poplin Cotton Shirt",
        brand: "Gucci",
        price: 550,
        originalPrice: 720,
        rating: 4.8,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCtQgnua-3En2nav8rDrUhTQ6u-a-vIMpJ6Au_EO_FAeS24e2QvMmtmRaJux0cENQP_jIBBxmKqUlSZ0aS-f6oN93Pjyojo-9Z5hcck7GQsroF-sdDz1qyAHLi_QQ1E1lBzt5mPDEbEMF19vtYC0WuqmG4aoaAfiT8D1g7lmdpj4lVSgrO0rIGRKWhV4jpMtckEYIy2f5dvn1wgPirIVoaCozlU6dDomaWWmyeQ88IQZ_FQ3V7ZvhA-h33TGfETSKb2yJ2mBi-ZngM0",
        category: "men",
        subcategory: "outerwear",
        color: "gray",
        sizes: ["s", "m", "l", "xl", "xxl"]
    },
    {
        id: 5,
        name: "Silk Wide-Leg Trousers",
        brand: "Saint Laurent",
        price: 1290,
        rating: 4.2,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDkBsGw5TKvvpXL_nFWfeD3mY-nTf3gn_YoP74HmaDrOYWN6toN3P8UugtxP4G7i4Z5xtOFNAHyQ9S1L25FkJ6M1wSzhrUY8IsxBYmdpAWc3IolVNJXn3YXn4DpjUYTCRK6ZWYWb9xGq2Eluk_PlMdICEdjGlCFVOF5Cj38Q4xtLW8MgyXMNoDj-VNeO4alGleZ9j0Jih-jmrtKa8ydryacpwk_M1p9dbFinXwb5ZpkGQ7r13_DLlLd19vnFNYUz08ALIwuA5QWMmKU",
        category: "women",
        color: "black",
        sizes: ["xs", "s", "m", "l", "xl"]
    },
    {
        id: 6,
        name: "Chelsea Leather Boots",
        brand: "Prada",
        price: 950,
        rating: 5.0,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBjG6aMm7mkwiN0PLqluWbRAHAllAGf3PSIqzjFe33Pu4ePvWWmqpNEUzw5mtpiqkSToeF1vWVTEmS6qnfjCEcO0pivQfKnmjFrRRLA1v3TkLWRyXBXyxcW_8Tj1FAJ9uNCr-1_2QZtAXeXDYl01exGdKBUZf9d5o7vY_9vw8QaLjhhRzPgYmyYTY6oyANqc0vi4qe8b5-JdwoC5iYnL-t7Qjm3o_1MhaLRcLU4fKT8nme6nqg---SWI76t1cvJOmCYWskSKSztIsCz",
        badge: "Limited",
        category: "men",
        color: "black",
        sizes: ["m", "l", "xl"]
    }
];

function getMockProduct(id) {
    if (!id) return initialProducts[0];
    return initialProducts.find(p => p.id == id) || initialProducts[0];
}

function updateAuthUI(user) {
    const accountBtn = document.getElementById('accountBtn');
    if (!accountBtn) return;

    if (user) {
        const initial = (user.displayName || 'U').charAt(0).toUpperCase();
        const fallbackHTML = `<div class='w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm'>${initial}</div>`;

        accountBtn.innerHTML = `
            ${user.photoURL
                ? `<img src="${user.photoURL}" 
                       class="w-8 h-8 rounded-full border border-slate-300 dark:border-slate-600 object-cover" 
                       alt="${user.displayName}"
                       referrerpolicy="no-referrer"
                       onerror="this.onerror=null; this.parentNode.innerHTML='${fallbackHTML}'">`
                : fallbackHTML}
        `;
        accountBtn.title = `Signed in as ${user.displayName}`;

        // Ensure click logs out
        accountBtn.onclick = null; // Clear previous
        accountBtn.addEventListener('click', handleAccountClick);
    } else {
        accountBtn.innerHTML = '<span class="material-icons">person_outline</span>';
        accountBtn.title = "Sign In";

        // Ensure click goes to login (home)
        accountBtn.onclick = null;
        accountBtn.addEventListener('click', handleAccountClick);
    }
}

function handleAccountClick() {
    if (currentUser) {
        if (confirm('Are you sure you want to logout?')) {
            import('./auth.js').then(module => {
                module.logoutUser().then(() => {
                    showToast('Logged out', 'info');
                    window.location.reload();
                });
            });
        }
    } else {
        window.location.href = 'index.html'; // Go to home to login
    }
}
