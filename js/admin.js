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
        if (!user) {
            console.warn("🚫 Not Logged In. Redirecting...");
            alert("Please Login First (Admin Check Failed)"); // Debug Alert
            window.location.href = '../index.html';
            return;
        }

        console.log("👤 User Email:", user.email); // Debug Log

        if (!ADMIN_EMAILS.includes(user.email)) {
            console.error("🚫 Access Denied for:", user.email);
            alert(`Access Denied! You are logged in as: ${user.email}\nExpected: ${ADMIN_EMAILS.join(', ')}`);
            window.location.href = '../index.html';
            return;
        }

        console.log("🔓 Admin Access Granted:", user.email);
        initDashboard();
    });
});

function initDashboard() {
    // Render Stats etc.
    document.getElementById('adminName').innerText = auth.currentUser.displayName || 'Admin';
}
