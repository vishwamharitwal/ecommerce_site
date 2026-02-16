import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { auth } from './firebase-config.js';
import { fetchUserData } from './db.js'; // Relative to /js/ (Wait, browser resolves relative to HTML location?)

// Browser resolves ES modules relative to the *file importing them*.
// If admin.js is in /js/admin.js, and db.js is in /js/db.js, then './db.js' is correct.
// BUT, if loaded via <script src="../js/admin.js">, the import runs from /js/.
// So imports inside admin.js (which is in /js/) should use ./db.js (which is in /js/).
// Yes.

console.log("👑 Admin Script Loaded");

// Admin Guard
const ADMIN_EMAILS = ['vishwamharitwal12@gmail.com'];

document.addEventListener('DOMContentLoaded', () => {
    onAuthStateChanged(auth, async (user) => {
        const loadingDiv = document.getElementById('authLoading');
        const contentDiv = document.getElementById('adminContent');

        if (!user) {
            console.warn("🚫 Not Logged In. Redirecting...");
            alert("Please Login First (Admin Check Failed)");
            window.location.href = '../index.html';
            return;
        }

        console.log("👤 User Email:", user.email);

        if (!ADMIN_EMAILS.includes(user.email)) {
            console.error("🚫 Access Denied for:", user.email);
            alert("Access Denied: You do not have permission.");
            window.location.href = '../index.html';
            return;
        }

        console.log("🔓 Admin Access Granted:", user.email);

        // Hide Loading, Show Dashboard
        if (loadingDiv) loadingDiv.classList.add('hidden');
        if (contentDiv) contentDiv.classList.remove('hidden');

        initDashboard();
    });
});

function initDashboard() {
    // Render Stats etc.
    document.getElementById('adminName').innerText = auth.currentUser.displayName || 'Admin';
}
