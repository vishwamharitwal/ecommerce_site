// ==========================================
// Shared Utilities (Backend Agent Logic)
// ==========================================

/**
 * Sanitizes cart data by removing invalid or blacklisted items.
 * Ensures data integrity before UI rendering.
 * @param {Array} cart - Raw cart array
 * @returns {Array} - Cleaned cart array
 */
export function sanitizeCart(cart) {
    if (!Array.isArray(cart)) return [];

    return cart.filter(item => {
        // 1. Basic Structure Validation
        if (!item || typeof item !== 'object') return false;

        // 2. Name Validation (Ghost Check)
        const name = (item.name || "").toLowerCase();
        const isGhost = name.includes("rk test") || name.includes("test product");

        // 3. Price Validation
        let price = item.price;
        if (typeof price === 'string') {
            price = parseFloat(price);
        }

        // 4. Final Verdict
        const isValid = !isGhost &&
            !isNaN(price) &&
            price >= 0 &&
            item.name &&
            (item.id !== undefined && item.id !== null);

        if (!isValid) {
            console.warn(`🗑️ Removed invalid item: ${item.name} ($${item.price})`);
        }

        return isValid;
    });
}

/**
 * Merges Local and Cloud carts intelligently.
 * Uses Max Quantity logic to avoid double counting on sync.
 * keys: id + size + color
 */
export function mergeCarts(localCart, cloudCart) {
    if (!Array.isArray(localCart)) localCart = [];
    if (!Array.isArray(cloudCart)) cloudCart = [];

    // Composite Key Generator
    const getKey = (item) => `${item.id}-${item.selectedSize || 'Def'}-${item.selectedColor || 'Def'}`;

    const mergedMap = new Map();

    // Process both lists (Cloud first, then Local overwrites if needed? No, merge)
    [...cloudCart, ...localCart].forEach(item => {
        const key = getKey(item);
        if (mergedMap.has(key)) {
            const existing = mergedMap.get(key);
            // Use MAX quantity to avoid double counting same item
            existing.quantity = Math.max(existing.quantity, item.quantity);
        } else {
            mergedMap.set(key, { ...item });
        }
    });

    return Array.from(mergedMap.values());
}
