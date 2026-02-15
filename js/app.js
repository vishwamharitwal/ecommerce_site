// ==========================================
// VOGUE Fashion Store - Main JavaScript
// ==========================================

import { loginWithGoogle, logoutUser, monitorAuthState } from './auth.js';
import { fetchProducts, seedProducts, syncUserData, fetchUserData } from './db.js';

// Initial Product Data (For Seeding)
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

// Safe localStorage Helper (Prevents crashes in Private Mode)
function safeGetLocalStorage(key, fallback = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : fallback;
    } catch (error) {
        console.warn(`⚠️ localStorage.getItem failed for "${key}":`, error.message);
        return fallback;
    }
}

function safeSetLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        if (error.name === 'QuotaExceededError') {
            console.error('❌ localStorage quota exceeded');
            showToast('Storage full. Please clear browser data.', 'error');
        } else {
            console.error('❌ localStorage.setItem failed:', error);
        }
        return false;
    }
}

// Product Data (Dynamic)
let products = [];

// State Management (SAFE localStorage access)
let currentUser = null;
let cart = safeGetLocalStorage('cart', []);
let wishlist = safeGetLocalStorage('wishlist', []);
let filters = {
    category: null,
    subcategory: null,
    brands: [],
    sizes: [],
    colors: [],
    priceRange: { min: 0, max: 500 },
    sortBy: 'popularity'
};

// Initialize App
document.addEventListener('DOMContentLoaded', async () => {
    // 0. Start Auth Listener IMMEDIATELY (Before animation)
    // 0. Start Auth Listener IMMEDIATELY
    monitorAuthState(
        (user) => {
            currentUser = user;
            updateAuthUI(user);
            renderProducts(); // Re-render to show buttons
            if (user) loadUserData(user.uid);
        },
        () => {
            currentUser = null;
            updateAuthUI(null);
            renderProducts(); // Re-render to hide buttons
        }
    );

    initializeApp();
});

async function initializeApp() {
    try {
        // 1. Seed Database if needed
        await seedProducts(initialProducts);

        // 2. Fetch from Database
        const dbProducts = await fetchProducts();
        if (dbProducts.length > 0) {
            products = dbProducts;
        } else {
            products = initialProducts; // Fallback
        }

        // 3. Render
        renderProducts();
        setupEventListeners();
        updateCartCount();
        updateWishlistCount();
        loadDarkModePreference();

    } catch (error) {
        console.error('❌ App initialization failed:', error);
        showToast('Failed to load products. Please refresh.', 'error');

        // Fallback to local products
        products = initialProducts;
        renderProducts();
        setupEventListeners();
    }
}

// Load User Data from Firestore (SAFE localStorage)
async function loadUserData(userId) {
    try {
        const userData = await fetchUserData(userId);
        if (userData) {
            // Merge cloud data with local data
            if (userData.cart && userData.cart.length > 0) {
                cart = userData.cart;
                safeSetLocalStorage('cart', cart);
                updateCartCount();
            }
            if (userData.wishlist && userData.wishlist.length > 0) {
                wishlist = userData.wishlist;
                safeSetLocalStorage('wishlist', wishlist);
                updateWishlistCount();
                renderProducts(); // Re-render to show correct heart icons
            }
        }
    } catch (error) {
        console.error('❌ Failed to load user data:', error);
        // Continue with local data (graceful degradation)
    }
}

function updateAuthUI(user) {
    const accountBtn = document.getElementById('accountBtn');
    if (!accountBtn) return;

    if (user) {
        // Logged In: Show Profile Photo
        // Added referrerpolicy="no-referrer" for Google Images
        // Added onerror handler to fallback to initial if image fails
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
    } else {
        // Logged Out: Show Outline Icon
        accountBtn.innerHTML = '<span class="material-icons">person_outline</span>';
        accountBtn.title = "Sign In";
    }
}

// Splash Screen Logic with Fail-Safe
const splashScreen = document.getElementById('splashScreen');

if (splashScreen) {
    console.log('Splash Screen found, starting animation...');

    // 1. Reveal Letters (Staggered)
    const letters = document.querySelectorAll('.splash-letter');
    letters.forEach((letter, index) => {
        setTimeout(() => letter.classList.add('active'), index * 100 + 100);
    });

    // 2. Hide Splash (Standard Flow)
    setTimeout(() => {
        hideSplashScreen();
    }, 3000);

    // 3. Fail-Safe Backup (Force remove after 4s)
    setTimeout(() => {
        if (splashScreen.style.display !== 'none') {
            console.warn('Splash timeout triggered - forcing removal');
            hideSplashScreen();
        }
    }, 4000);
} else {
    console.warn('Splash Screen NOT found - showing content immediately');
    showMainContent();
}

function hideSplashScreen() {
    if (!splashScreen) return;

    // Visual Exit
    splashScreen.style.opacity = '0';
    splashScreen.style.transition = 'opacity 0.5s ease';

    setTimeout(() => {
        splashScreen.style.display = 'none'; // Hard remove
        document.body.classList.remove('overflow-hidden');
        showMainContent();
    }, 500);
}

function showMainContent() {
    const header = document.getElementById('mainHeader');
    const main = document.querySelector('main');
    const logo = document.getElementById('headerLogo');

    if (header) {
        header.classList.remove('opacity-0', '-translate-y-full');
        header.style.opacity = '1';
        header.style.transform = 'translateY(0)';
    }
    if (main) {
        main.classList.add('visible');
        main.style.opacity = '1';
    }
    if (logo) {
        logo.classList.remove('opacity-0');
        logo.style.opacity = '1';
    }
}

// Event Listeners (NULL-SAFE - Production Hardened)
function setupEventListeners() {
    // Helper: Safe event listener attachment
    const safeAddListener = (id, event, handler, context = 'element') => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener(event, handler);
        } else {
            console.warn(`⚠️ ${context} not found: #${id}`);
        }
    };

    // Dark Mode Toggle
    safeAddListener('darkModeToggle', 'click', toggleDarkMode, 'Dark mode toggle');

    // Auth Buttons
    const loginModal = document.getElementById('loginModal');

    safeAddListener('accountBtn', 'click', () => {
        if (currentUser) {
            if (confirm('Are you sure you want to logout?')) {
                logoutUser();
                showToast('Logged out successfully', 'info');
            }
        } else {
            if (loginModal) loginModal.classList.remove('hidden');
        }
    }, 'Account button');

    safeAddListener('closeModalBtn', 'click', () => {
        if (loginModal) loginModal.classList.add('hidden');
    }, 'Close modal button');

    safeAddListener('googleLoginBtn', 'click', async () => {
        try {
            await loginWithGoogle();
            if (loginModal) loginModal.classList.add('hidden');
        } catch (error) {
            showToast(error.message || 'Login failed', 'error');
        }
    }, 'Google login button');

    // Close modal on click outside
    if (loginModal) {
        loginModal.addEventListener('click', (e) => {
            if (e.target === loginModal) {
                loginModal.classList.add('hidden');
            }
        });
    }

    // Wishlist Button
    safeAddListener('wishlistBtn', 'click', () => showToast('Wishlist feature coming soon!', 'info'), 'Wishlist button');

    // Search
    safeAddListener('searchInput', 'input', handleSearch, 'Search input');

    // Sort
    safeAddListener('sortSelect', 'change', handleSort, 'Sort select');

    // Size Filters (may not exist on all pages)
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.addEventListener('click', () => toggleSizeFilter(btn));
    });

    // Color Filters
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.addEventListener('click', () => toggleColorFilter(btn));
    });

    // Brand Filters
    document.querySelectorAll('.brand-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', handleBrandFilter);
    });

    // Clear Filters
    safeAddListener('clearFilters', 'click', clearAllFilters, 'Clear filters button');

    // Newsletter Form
    safeAddListener('newsletterForm', 'submit', handleNewsletter, 'Newsletter form');

    // Load More
    safeAddListener('loadMoreBtn', 'click', () => {
        showToast('Loading more products...', 'info');
    }, 'Load more button');
}

// Render Products
function renderProducts(productsToRender = products) {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = '';

    if (productsToRender.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full text-center py-20">
                <span class="material-icons text-6xl text-slate-300 dark:text-slate-700 mb-4">search_off</span>
                <p class="text-slate-500 text-lg">No products found matching your filters</p>
                <button onclick="clearAllFilters()" class="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors">
                    Clear Filters
                </button>
            </div>
        `;
        return;
    }

    productsToRender.forEach(product => {
        const productCard = createProductCard(product);
        grid.appendChild(productCard);
    });

    // Update product count
    document.getElementById('productCount').textContent = productsToRender.length;

    // Add event listeners to new cards
    attachProductEventListeners();
}

// Create Product Card HTML (Safe Method)
function createProductCard(product) {
    const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
    const isInWishlist = wishlist.includes(product.id);

    // Create Elements safely
    const card = document.createElement('div');
    card.className = 'group product-card';
    card.dataset.productId = product.id;

    // Image Container
    const imgContainer = document.createElement('div');
    imgContainer.className = 'relative aspect-[3/4] overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 mb-4';

    const link = document.createElement('a');
    link.href = `product.html?id=${product.id}`;
    link.className = 'block w-full h-full cursor-pointer';

    const img = document.createElement('img');
    img.className = 'w-full h-full object-cover group-hover:scale-105 transition-transform duration-500';
    img.src = product.image; // URLs are generally safe in src, but validate if needed
    img.alt = product.name;  // This is safe
    img.loading = 'lazy';

    link.appendChild(img);
    imgContainer.appendChild(link);

    // Wishlist Button
    const wishBtn = document.createElement('button');
    wishBtn.className = `wishlist-btn absolute top-4 right-4 p-2 bg-white/90 dark:bg-black/20 backdrop-blur rounded-full text-slate-900 dark:text-white hover:text-primary transition-colors ${isInWishlist ? 'active' : ''}`;
    wishBtn.dataset.productId = product.id;
    wishBtn.innerHTML = `<span class="material-icons text-xl">${isInWishlist ? 'favorite' : 'favorite_border'}</span>`; // Icons are safe static HTML
    imgContainer.appendChild(wishBtn);

    // Add to Cart Button
    const cartDiv = document.createElement('div');
    cartDiv.className = 'absolute bottom-4 left-4 right-4 add-to-cart';
    const cartBtn = document.createElement('button');
    cartBtn.className = 'add-to-cart-btn w-full py-3 bg-white text-slate-900 text-xs font-bold uppercase tracking-widest rounded-lg shadow-xl hover:bg-primary hover:text-white transition-all';
    cartBtn.dataset.productId = product.id;
    console.log(`📦 Creating cart button for Product ID: ${product.id}, Name: ${product.name}`);
    cartBtn.textContent = 'Add to Cart';
    cartDiv.appendChild(cartBtn);
    imgContainer.appendChild(cartDiv);

    // Badges
    if (product.badge) {
        const badgeSpan = document.createElement('span');
        badgeSpan.className = 'absolute top-4 left-4 px-2 py-1 bg-primary text-white text-[10px] font-bold uppercase rounded';
        badgeSpan.textContent = product.badge; // Safe
        imgContainer.appendChild(badgeSpan);
    }

    if (discount > 0) {
        const discountSpan = document.createElement('span');
        discountSpan.className = 'absolute top-4 left-4 px-2 py-1 bg-red-500 text-white text-[10px] font-bold uppercase rounded';
        // Adjust position if badge exists? For simplicity, stacking or replacing logic needed. 
        // Let's assume only one badge for now or manage styles. 
        // Existing CSS handles absolute positioning.
        if (product.badge) discountSpan.style.top = '2rem'; // Offset
        discountSpan.textContent = `-${discount}%`; // Safe
        imgContainer.appendChild(discountSpan);
    }

    card.appendChild(imgContainer);

    // Details Container
    const detailsDiv = document.createElement('div');
    detailsDiv.className = 'space-y-1';

    const brandP = document.createElement('p');
    brandP.className = 'text-[10px] font-bold text-primary uppercase tracking-widest';
    brandP.textContent = product.brand; // Safe
    detailsDiv.appendChild(brandP);

    const titleH4 = document.createElement('h4');
    titleH4.className = 'text-sm font-medium text-slate-900 dark:text-white truncate';
    titleH4.textContent = product.name; // Safe
    detailsDiv.appendChild(titleH4);

    const priceDiv = document.createElement('div');
    priceDiv.className = 'flex items-center space-x-2';

    const priceSpan = document.createElement('span');
    priceSpan.className = 'text-sm font-bold';
    priceSpan.textContent = `$${product.price.toFixed(2)}`;
    priceDiv.appendChild(priceSpan);

    if (product.originalPrice) {
        const ogPriceSpan = document.createElement('span');
        ogPriceSpan.className = 'text-xs text-slate-400 line-through';
        ogPriceSpan.textContent = `$${product.originalPrice.toFixed(2)}`;
        priceDiv.appendChild(ogPriceSpan);
    }
    detailsDiv.appendChild(priceDiv);

    const ratingDiv = document.createElement('div');
    ratingDiv.className = 'flex items-center text-primary text-[10px]';
    ratingDiv.innerHTML = renderStars(product.rating); // renderStars returns safe HTML string of icons

    const ratingCount = document.createElement('span');
    ratingCount.className = 'ml-1 text-slate-400 font-medium tracking-normal';
    ratingCount.textContent = `(${product.rating.toFixed(1)})`;
    ratingDiv.appendChild(ratingCount);

    detailsDiv.appendChild(ratingDiv);
    card.appendChild(detailsDiv);

    return card; // Return DOM Node instead of string
}

// Render Star Rating
function renderStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';

    for (let i = 0; i < fullStars; i++) {
        stars += '<span class="material-icons text-xs">star</span>';
    }

    if (hasHalfStar) {
        stars += '<span class="material-icons text-xs">star_half</span>';
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<span class="material-icons text-xs text-slate-300 dark:text-slate-700">star</span>';
    }

    return stars;
}

// Attach Event Listeners to Product Cards (EVENT DELEGATION - No Memory Leaks)
function attachProductEventListeners() {
    const productGrid = document.getElementById('productGrid');

    if (!productGrid) {
        console.warn('⚠️ Product grid not found, skipping event listeners');
        return;
    }

    // Remove old listener if exists (prevent duplicates)
    if (productGrid._hasProductListeners) return;

    // Single delegated listener for all product interactions
    productGrid.addEventListener('click', (e) => {
        // Add to Cart button clicked
        if (e.target.closest('.add-to-cart-btn')) {
            const btn = e.target.closest('.add-to-cart-btn');
            const productId = btn.dataset.productId;
            if (productId) addToCart(productId);
        }

        // Wishlist button clicked
        if (e.target.closest('.wishlist-btn')) {
            e.stopPropagation();
            const btn = e.target.closest('.wishlist-btn');
            const productId = btn.dataset.productId;
            if (productId) toggleWishlist(productId);
        }
    });

    // Mark as initialized
    productGrid._hasProductListeners = true;
}

// Cart Functions
function addToCart(productId) {
    // Input Validation (Defensive Programming)
    if (!productId || productId === 'undefined' || productId === 'null') {
        console.error('❌ Invalid productId:', productId);
        showToast('Invalid product selection', 'error');
        return;
    }

    // Auth Check
    if (!currentUser) {
        showToast('Please login to add items to cart', 'error');
        const loginModal = document.getElementById('loginModal');
        if (loginModal) loginModal.classList.remove('hidden');
        return;
    }

    // Product Existence Check
    const product = products.find(p => p.id == productId);

    if (!product) {
        console.error('❌ Product not found:', productId);
        showToast('Product not available', 'error');
        return;
    }

    // Validate product data integrity
    if (!product.name || product.price === undefined) {
        console.error('❌ Invalid product data:', product);
        showToast('Product data incomplete', 'error');
        return;
    }

    // Default Size/Color Logic (Quick Add)
    const defaultSize = (product.sizes && product.sizes.length > 0) ? product.sizes[0] : 'One Size';
    const defaultColor = (product.colors && product.colors.length > 0) ? product.colors[0] :
        (product.color ? product.color : 'Default');

    // Consistent Cart Item Structure
    const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        selectedSize: defaultSize,
        selectedColor: defaultColor,
        quantity: 1
    };

    const existingItem = cart.find(item =>
        item.id == product.id &&
        item.selectedSize == defaultSize &&
        item.selectedColor == defaultColor
    );

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push(cartItem);
    }

    safeSetLocalStorage('cart', cart);
    updateCartCount();
    showToast(`${product.name} added to cart!`, 'success');

    // Sync to Cloud if logged in
    if (currentUser) {
        syncUserData(currentUser.uid, 'cart', cart);
    }
}


function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);

    // Null-safe updates
    const cartCountEl = document.getElementById('cartCount');
    const floatingCartCountEl = document.getElementById('floatingCartCount');

    if (cartCountEl) {
        cartCountEl.textContent = count;
        if (count > 0) cartCountEl.classList.add('badge-pulse');
    }

    if (floatingCartCountEl) {
        floatingCartCountEl.textContent = count;
        if (count > 0) floatingCartCountEl.classList.add('badge-pulse');
    }
}

// Wishlist Functions
function toggleWishlist(productId) {
    // productId likely coming from data-attribute (string)
    // Find product to get real ID type
    const product = products.find(p => p.id == productId);
    if (!product) return;
    const realId = product.id;

    const index = wishlist.indexOf(realId);

    if (index > -1) {
        wishlist.splice(index, 1);
        showToast(`${product.name} removed from wishlist`, 'info');
    } else {
        wishlist.push(realId);
        showToast(`${product.name} added to wishlist!`, 'success');
    }

    safeSetLocalStorage('wishlist', wishlist);
    updateWishlistCount();
    renderProducts(getFilteredProducts());

    // Sync to Cloud if logged in
    if (currentUser) {
        syncUserData(currentUser.uid, 'wishlist', wishlist);
    }
}

function updateWishlistCount() {
    const count = wishlist.length;
    const badge = document.getElementById('wishlistCount');

    if (badge) {
        badge.textContent = count;
        if (count > 0) {
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    }
}

// Filter Functions
function toggleSizeFilter(btn) {
    const size = btn.dataset.size;
    btn.classList.toggle('active');

    if (btn.classList.contains('active')) {
        btn.classList.add('border-primary', 'bg-primary/5', 'text-primary');
        btn.classList.remove('border-slate-200', 'dark:border-slate-800');
        filters.sizes.push(size);
    } else {
        btn.classList.remove('border-primary', 'bg-primary/5', 'text-primary');
        btn.classList.add('border-slate-200', 'dark:border-slate-800');
        filters.sizes = filters.sizes.filter(s => s !== size);
    }

    applyFilters();
}

function toggleColorFilter(btn) {
    const color = btn.dataset.color;

    // Remove active from all color buttons
    document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active', 'ring-2', 'ring-offset-2', 'ring-primary'));

    // Add active to clicked button
    btn.classList.add('active', 'ring-2', 'ring-offset-2', 'ring-primary');
    filters.colors = [color];

    applyFilters();
}

function handleBrandFilter(e) {
    const brand = e.target.value;

    if (e.target.checked) {
        filters.brands.push(brand);
    } else {
        filters.brands = filters.brands.filter(b => b !== brand);
    }

    applyFilters();
}

function handleSearch(e) {
    const query = e.target.value.toLowerCase();

    if (query === '') {
        renderProducts(getFilteredProducts());
        return;
    }

    const filtered = products.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query)
    );

    renderProducts(filtered);
}

function handleSort(e) {
    filters.sortBy = e.target.value;
    applyFilters();
}

function getFilteredProducts() {
    let filtered = [...products];

    // Filter by brands
    if (filters.brands.length > 0) {
        filtered = filtered.filter(p =>
            filters.brands.includes(p.brand.toLowerCase().replace(' ', '-'))
        );
    }

    // Filter by sizes
    if (filters.sizes.length > 0) {
        filtered = filtered.filter(p =>
            p.sizes && p.sizes.some(size => filters.sizes.includes(size))
        );
    }

    // Filter by colors
    if (filters.colors.length > 0) {
        filtered = filtered.filter(p =>
            filters.colors.includes(p.color)
        );
    }

    // Sort
    switch (filters.sortBy) {
        case 'price-low':
            filtered.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filtered.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            filtered.sort((a, b) => b.rating - a.rating);
            break;
        case 'new':
            filtered.sort((a, b) => (b.badge === 'New' ? 1 : 0) - (a.badge === 'New' ? 1 : 0));
            break;
        default:
            // popularity - keep original order
            break;
    }

    return filtered;
}

function applyFilters() {
    const filtered = getFilteredProducts();
    renderProducts(filtered);
}

function clearAllFilters() {
    // Reset filters
    filters = {
        category: null,
        subcategory: null,
        brands: [],
        sizes: [],
        colors: [],
        priceRange: { min: 0, max: 500 },
        sortBy: 'popularity'
    };

    // Reset UI
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.classList.remove('active', 'border-primary', 'bg-primary/5', 'text-primary');
        btn.classList.add('border-slate-200', 'dark:border-slate-800');
    });

    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.classList.remove('active', 'ring-2', 'ring-offset-2', 'ring-primary');
    });

    document.querySelectorAll('.brand-checkbox').forEach(checkbox => {
        checkbox.checked = false;
    });

    document.getElementById('sortSelect').value = 'popularity';
    document.getElementById('searchInput').value = '';

    renderProducts(products);
    showToast('All filters cleared', 'info');
}

// Dark Mode
function toggleDarkMode() {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('darkMode', isDark);
}

function loadDarkModePreference() {
    const isDark = localStorage.getItem('darkMode') === 'true';
    if (isDark) {
        document.documentElement.classList.add('dark');
    }
}

// Toast Notifications
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span class="material-icons text-xl">
            ${type === 'success' ? 'check_circle' : type === 'error' ? 'error' : 'info'}
        </span>
        <span class="text-sm font-medium">${message}</span>
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'toastSlide 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Newsletter
function handleNewsletter(e) {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    showToast(`Thanks for subscribing with ${email}!`, 'success');
    e.target.reset();
}

// Initialize
console.log('🛍️ VOGUE Fashion Store loaded successfully!');
