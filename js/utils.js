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
